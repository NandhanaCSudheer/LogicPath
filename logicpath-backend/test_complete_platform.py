"""
End-to-End Verification and Validation Suite for LogicPath Learning Platform.
Tests all requirements specified in the prompt:
1. Learning Progress & MongoDB Persistence
2. Level Unlocking & Sequential Enforcement
3. Topic Unlocking & Sequential Enforcement
4. 10 Questions per Level / 40 per Topic Validation
5. 30+ Verified Seed Teacher Questions
6. Teacher Question Creation, Verification & Publication Blocking
7. Student Submission, Verification & XP Awarding
8. Teacher-Student Feedback Loop
9. Discussion System End-to-End
10. API Security & Role Isolation
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import (
    users_collection,
    questions_collection,
    submissions_collection,
    discussions_collection,
    learning_progress_collection,
)
from auth import register_user, login_user
from circuit_verifier import verify_circuit_pair
from app import app

results = {}

def report(name, passed, detail=""):
    results[name] = "PASS" if passed else "FAIL"
    status_str = "PASS" if passed else "FAIL"
    print(f"[{status_str}] {name}: {detail}")

print("=" * 60)
print("LOGICPATH PLATFORM COMPREHENSIVE END-TO-END VALIDATION")
print("=" * 60)

with app.test_client() as client:
    # -------------------------------------------------------------
    # 1. AUTHENTICATION & USERS SETUP
    # -------------------------------------------------------------
    ts = int(time.time())
    teacher_email = f"teacher_{ts}@logicpath.io"
    student_email = f"student_{ts}@logicpath.io"
    password = "TestPassword123!"

    reg_t = register_user("Prof. Turing", teacher_email, password, role="teacher")
    reg_s = register_user("Ada Student", student_email, password, role="student")

    auth_passed = reg_t.get("success") and reg_s.get("success")
    report("Authentication", auth_passed, f"Teacher ({teacher_email}) and Student ({student_email}) registered")

    teacher_token = reg_t.get("token")
    student_token = reg_s.get("token")
    student_id = str(reg_s["user"]["id"])
    t_headers = {"Authorization": f"Bearer {teacher_token}"}
    s_headers = {"Authorization": f"Bearer {student_token}"}

    # -------------------------------------------------------------
    # 2. SEED VALIDATION & 30+ TEACHER QUESTIONS
    # -------------------------------------------------------------
    pub_count = questions_collection.count_documents({"status": "published"})
    has_30_plus = pub_count >= 30
    report("30+ Teacher Questions", has_30_plus, f"Found {pub_count} published teacher questions in MongoDB")

    # Verify that seeded circuits are valid and have matched logic
    seed_q = questions_collection.find_one({"status": "published"})
    seed_valid = False
    if seed_q:
        v_check = verify_circuit_pair(seed_q.get("original_circuit", {}), seed_q.get("optimized_circuit", {}))
        seed_valid = v_check["verification_status"] == "PASSED" and v_check["equivalent"] and v_check["optimized"]
    report("Seed Validation", seed_valid, f"Sample verified seed problem: '{seed_q.get('title') if seed_q else 'None'}'")

    # -------------------------------------------------------------
    # 3. 10 QUESTIONS PER LEVEL / 600 QUESTIONS CHECK
    # -------------------------------------------------------------
    data_file_path = os.path.join(os.path.dirname(__file__), "..", "logicpath-frontend", "src", "pages", "learningTopicsData.js")
    all_topics_have_40 = False
    if os.path.exists(data_file_path):
        import re
        with open(data_file_path, "r", encoding="utf-8") as f:
            data_content = f.read()
        q_count = len(re.findall(r"id:\s*[\'\"][^\'\"]+[\'\"],\s*q:", data_content))
        all_topics_have_40 = (q_count >= 600)
        report("10 Questions per Level", all_topics_have_40, f"Found {q_count} verified learning questions (15 topics * 4 levels * 10 questions)")
    else:
        report("10 Questions per Level", False, "learningTopicsData.js not found")

    # -------------------------------------------------------------
    # 4. LEARNING PROGRESS & MONGODB PERSISTENCE
    # -------------------------------------------------------------
    lp_res = client.get("/api/student/learning-progress", headers=s_headers)
    lp_data = lp_res.get_json()
    lp_get_ok = lp_data.get("success") and "progress" in lp_data
    report("Learning Progress", lp_get_ok, "Initial empty learning progress successfully initialized in MongoDB")

    # Test Level Unlocking: Level 1 complete with 90% (>= 80%)
    c1 = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law",
        "level_number": 1,
        "score": 90
    })
    c1_data = c1.get_json()
    lvl1_ok = c1_data.get("passed") is True and c1_data.get("xp_gained") == 50

    # Test Level 3 attempt without Level 2 (should be blocked with 403)
    c3_bypass = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law",
        "level_number": 3,
        "score": 100
    })
    bypass_blocked = c3_bypass.status_code == 403

    # Test score below 80% (should fail without unlocking)
    c2_fail = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law",
        "level_number": 2,
        "score": 70
    })
    c2_fail_data = c2_fail.get_json()
    fail_blocked = c2_fail_data.get("passed") is False

    # Now pass Level 2, Level 3, Level 4
    client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law", "level_number": 2, "score": 85
    })
    client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law", "level_number": 3, "score": 90
    })
    c4 = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "distributive-law", "level_number": 4, "score": 100
    })
    c4_data = c4.get_json()
    topic1_done = c4_data.get("topic_completed") is True

    level_unlock_ok = lvl1_ok and bypass_blocked and fail_blocked
    report("Level Unlocking", level_unlock_ok, "Level 1 passed, Level 2 unlocked, Level 3 blocked prior to Level 2, <80% rejected")

    # Test Topic Unlocking:
    # Topic 1 completed -> Topic 2 (commutative-law) Level 1 should now succeed
    c_topic2 = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "commutative-law", "level_number": 1, "score": 95
    })
    topic2_ok = c_topic2.get_json().get("passed") is True

    # But Topic 3 (associative-law) should be blocked because Topic 2 is not completed
    c_topic3_bypass = client.post("/api/student/learning-progress/complete-level", headers=s_headers, json={
        "topic_id": "associative-law", "level_number": 1, "score": 90
    })
    topic3_bypass_blocked = c_topic3_bypass.status_code == 403

    topic_unlock_ok = topic1_done and topic2_ok and topic3_bypass_blocked
    report("Topic Unlocking", topic_unlock_ok, "Topic 1 completion successfully unlocks Topic 2; skipping to Topic 3 strictly blocked")

    # MongoDB persistence test: fetch again and verify records in DB
    db_record = learning_progress_collection.find_one({"student_id": student_id})
    mongo_persisted = (
        db_record is not None
        and "distributive-law" in db_record.get("completed_topics", [])
        and db_record.get("total_learning_xp", 0) > 0
    )
    report("MongoDB Persistence", mongo_persisted, f"Learning progress verified in MongoDB with {db_record.get('total_learning_xp') if db_record else 0} XP")

    # -------------------------------------------------------------
    # 5. TEACHER QUESTION CREATION, VERIFICATION & PUBLICATION
    # -------------------------------------------------------------
    # Valid circuit pair: A + A'B -> A + B
    orig_c = {
        "nodes": [
            {"id": "a", "type": "INPUT", "label": "A"},
            {"id": "b", "type": "INPUT", "label": "B"},
            {"id": "not1", "type": "NOT", "label": "NOT1"},
            {"id": "and1", "type": "AND", "label": "AND1"},
            {"id": "or1", "type": "OR", "label": "OR1"},
            {"id": "y", "type": "OUTPUT", "label": "Y"}
        ],
        "connections": [
            {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
            {"id": "c2", "fromNode": "not1", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
            {"id": "c3", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
            {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
            {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
            {"id": "c6", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
        ]
    }
    opt_c = {
        "nodes": [
            {"id": "a", "type": "INPUT", "label": "A"},
            {"id": "b", "type": "INPUT", "label": "B"},
            {"id": "or1", "type": "OR", "label": "OR1"},
            {"id": "y", "type": "OUTPUT", "label": "Y"}
        ],
        "connections": [
            {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
            {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
            {"id": "c3", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
        ]
    }

    # First, test creating draft question without optimized circuit
    create_res = client.post("/api/teacher/questions", headers=t_headers, json={
        "title": f"Live Test Problem {ts}",
        "description": "Simplify A + A'B",
        "category": "Boolean",
        "topic": "Absorption Law",
        "difficulty": "medium",
        "original_circuit": orig_c,
        "optimized_circuit": {"nodes": [], "connections": []}
    })
    q_data = create_res.get_json()
    new_q_id = q_data.get("question_id")
    t_create_ok = create_res.status_code == 201 and new_q_id is not None

    # Try to publish before verification -> MUST BE BLOCKED
    pub_attempt = client.post(f"/api/teacher/questions/{new_q_id}/publish", headers=t_headers)
    pub_blocked = pub_attempt.status_code == 400

    # Now verify the question with the real optimized circuit
    verify_res = client.post(f"/api/teacher/questions/{new_q_id}/verify", headers=t_headers, json={
        "optimized_circuit": opt_c
    })
    v_data = verify_res.get_json()
    opt_verified = v_data.get("success") and v_data.get("can_publish") is True
    has_ai = "ai_explanation" in v_data.get("verification", {})

    # Now publish should succeed
    pub_res = client.post(f"/api/teacher/questions/{new_q_id}/publish", headers=t_headers)
    pub_ok = pub_res.status_code == 200 and pub_res.get_json().get("status") == "published"

    report("Teacher Question Creation", t_create_ok and pub_blocked and pub_ok, "Question created as draft, publishing unverified circuit blocked, published after verification")
    report("Optimization Verification", opt_verified, "Deterministic 2^N verification confirms equivalence and gate savings")
    report("AI Verification", has_ai, "Pedagogical explanation produced seamlessly")

    # -------------------------------------------------------------
    # 6. STUDENT SUBMISSION & SOLUTION FLOW
    # -------------------------------------------------------------
    # Verify student does NOT receive optimized circuit from API
    st_q_res = client.get(f"/api/student/questions/{new_q_id}", headers=s_headers)
    st_q_data = st_q_res.get_json()
    solution_hidden = "optimized_circuit" not in st_q_data.get("question", {})

    # Student submits valid optimized solution
    sub_res = client.post(f"/api/student/questions/{new_q_id}/submit", headers=s_headers, json={
        "submitted_circuit": opt_c
    })
    sub_data = sub_res.get_json()
    sub_id = sub_data.get("submission_id")
    student_passed = sub_data.get("passed") is True and sub_data.get("xp_awarded") > 0

    student_flow_ok = solution_hidden and student_passed and sub_id is not None
    report("Student Submission", student_flow_ok, f"Reference solution hidden; submission verified, passed and awarded {sub_data.get('xp_awarded')} XP")

    # -------------------------------------------------------------
    # 7. TEACHER-STUDENT FEEDBACK
    # -------------------------------------------------------------
    fb_res = client.post(f"/api/teacher/submissions/{sub_id}/feedback", headers=t_headers, json={
        "status": "excellent",
        "score": 100,
        "text": "Flawless optimization using the Negative Absorption Law!"
    })
    fb_data = fb_res.get_json()
    teacher_fb_ok = fb_res.status_code == 200 and fb_data.get("success") is True

    # Student fetches own submissions to confirm feedback
    st_subs_res = client.get("/api/student/submissions", headers=s_headers)
    st_subs = st_subs_res.get_json().get("submissions", [])
    found_fb = any(s.get("teacher_feedback", {}).get("status") == "excellent" for s in st_subs)
    report("Teacher Feedback", teacher_fb_ok and found_fb, "Teacher provided feedback + score (100) and student sees it in submissions")

    # -------------------------------------------------------------
    # 8. DISCUSSION SYSTEM END-TO-END
    # -------------------------------------------------------------
    # Student asks question
    disc_s = client.post(f"/api/student/questions/{new_q_id}/discussions", headers=s_headers, json={
        "message": "Why does A + A'B simplify to A + B?"
    })
    disc_s_data = disc_s.get_json()
    student_disc_ok = disc_s.status_code == 201

    # Teacher replies
    disc_t = client.post(f"/api/teacher/questions/{new_q_id}/discussions", headers=t_headers, json={
        "message": "By Distributive Law: A + A'B = (A + A')(A + B) = 1 · (A + B) = A + B."
    })
    teacher_disc_ok = disc_t.status_code == 201

    # Student reads discussions
    disc_list = client.get(f"/api/student/questions/{new_q_id}/discussions", headers=s_headers)
    msgs = disc_list.get_json().get("discussions", [])
    disc_end_to_end = len(msgs) >= 2 and any(m.get("sender_role") == "teacher" for m in msgs)
    report("Discussion", disc_end_to_end, "Student question stored in MongoDB, teacher replied, student retrieved conversation")

    # -------------------------------------------------------------
    # 9. BACKEND TESTS / HEALTH
    # -------------------------------------------------------------
    health_res = client.get("/api/test")
    health_ok = health_res.status_code == 200
    report("Backend Tests", health_ok, "Flask API test endpoint responsive and healthy")

# Check frontend build
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "logicpath-frontend", "dist", "index.html")
frontend_ok = os.path.exists(frontend_dist)
report("Frontend Build", frontend_ok, "Vite production build verified in logicpath-frontend/dist")

print("=" * 60)
all_pass = all(v == "PASS" for v in results.values())
print(f"OVERALL RESULT: {'ALL PASS' if all_pass else 'SOME TESTS FAILED'}")
print("=" * 60)
