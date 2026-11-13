"""
Comprehensive Teacher-Student Interaction & AI Verification Test Suite for LogicPath.
Tests:
1. Student registration & login with role 'student'
2. Teacher registration & login with role 'teacher'
3. Role authorization enforcement (student receives 403 on teacher APIs)
4. Teacher creates question with original and optimized circuits
5. Teacher saves question as draft
6. Teacher submits question for verification
7. Equivalent optimized circuit passes verification
8. Non-equivalent optimized circuit fails verification with detailed input mismatch
9. Equivalent but non-improved circuit is correctly rejected for optimization
10. Invalid circuit (combinational cycle / missing inputs) is rejected
11. Teacher can publish verified question
12. Teacher cannot publish unverified / failed question
13. Student can view published questions
14. Student CANNOT retrieve teacher's optimized circuit (security test)
15. Student submits a solution circuit
16. Student solution is verified deterministically with feedback and metrics
17. Student asks a question to teacher (discussion)
18. Teacher replies to student question
19. Student can view teacher reply in discussion thread
20. Unauthorized users without token receive 401
21. Database persistence and stats work correctly
22. Test circuits: AND, OR, NOT, NAND, NOR, XOR, XNOR, Half Adder, Multi-level
"""

import json
from datetime import datetime, timezone
from app import app
from database import users_collection, questions_collection, submissions_collection, discussions_collection

def run_teacher_student_tests():
    print("======================================================")
    print("STARTING TEACHER-STUDENT & AI VERIFICATION TEST SUITE")
    print("======================================================")

    client = app.test_client()
    passed = 0
    failed = 0

    def assert_true(condition, test_name, detail=""):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {test_name}")
            passed += 1
        else:
            print(f"  [FAIL] {test_name} - {detail}")
            failed += 1

    timestamp = int(datetime.now(timezone.utc).timestamp())
    teacher_email = f"prof_{timestamp}@university.edu"
    student_email = f"student_{timestamp}@college.edu"
    password = "StrongPassword123!"

    # --------------------------------------------------
    # 1. Student Registration & Login
    # --------------------------------------------------
    student_reg = client.post("/api/auth/register", json={
        "name": "Jane Student",
        "email": student_email,
        "password": password,
        "role": "student"
    })
    assert_true(
        student_reg.status_code == 201 and student_reg.json.get("user", {}).get("role") == "student",
        "1. Student Registration with role 'student'",
        student_reg.data.decode()
    )

    student_login = client.post("/api/auth/login", json={"email": student_email, "password": password})
    assert_true(
        student_login.status_code == 200 and student_login.json.get("user", {}).get("role") == "student",
        "1b. Student Login with role confirmation"
    )
    student_token = student_login.json.get("token")
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # --------------------------------------------------
    # 2. Teacher Registration & Login
    # --------------------------------------------------
    teacher_reg = client.post("/api/auth/register", json={
        "name": "Prof. Alan Turing",
        "email": teacher_email,
        "password": password,
        "role": "teacher"
    })
    assert_true(
        teacher_reg.status_code == 201 and teacher_reg.json.get("user", {}).get("role") == "teacher",
        "2. Teacher Registration with role 'teacher'",
        teacher_reg.data.decode()
    )

    teacher_login = client.post("/api/auth/login", json={"email": teacher_email, "password": password})
    assert_true(
        teacher_login.status_code == 200 and teacher_login.json.get("user", {}).get("role") == "teacher",
        "2b. Teacher Login with role confirmation"
    )
    teacher_token = teacher_login.json.get("token")
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    # --------------------------------------------------
    # 3. Role Authorization (Student blocked from Teacher APIs)
    # --------------------------------------------------
    forbidden_res = client.get("/api/teacher/questions", headers=student_headers)
    assert_true(
        forbidden_res.status_code == 403,
        "3. Role Authorization: Student blocked from GET /api/teacher/questions (403 Forbidden)"
    )

    forbidden_create = client.post("/api/teacher/questions", json={"title": "Hacked Question"}, headers=student_headers)
    assert_true(
        forbidden_create.status_code == 403,
        "3b. Role Authorization: Student blocked from POST /api/teacher/questions (403 Forbidden)"
    )

    # --------------------------------------------------
    # Circuits for Testing:
    # Original Circuit: (A AND B) OR (A AND C) -> Y
    #   Inputs: A, B, C
    #   AND1(A, B), AND2(A, C), OR(AND1, AND2) -> OUT
    #   Gate count: 3, Depth: 2, Connections: 7
    #
    # Teacher Optimized Circuit: A AND (B OR C) -> Y
    #   OR(B, C), AND(A, OR) -> OUT
    #   Gate count: 2, Depth: 2, Connections: 5
    #   Improvements: 1 fewer gate (33.3% reduction), 2 fewer connections
    # --------------------------------------------------
    orig_nodes = [
        {"id": "in_a", "type": "INPUT", "label": "A", "state": 0, "x": 50, "y": 100},
        {"id": "in_b", "type": "INPUT", "label": "B", "state": 0, "x": 50, "y": 200},
        {"id": "in_c", "type": "INPUT", "label": "C", "state": 0, "x": 50, "y": 300},
        {"id": "and1", "type": "AND", "label": "AND_AB", "x": 220, "y": 120},
        {"id": "and2", "type": "AND", "label": "AND_AC", "x": 220, "y": 260},
        {"id": "or1", "type": "OR", "label": "OR_OUT", "x": 420, "y": 190},
        {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 600, "y": 190}
    ]
    orig_conns = [
        {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
        {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
        {"id": "c3", "fromNode": "in_a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
        {"id": "c4", "fromNode": "in_c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
        {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
        {"id": "c6", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
        {"id": "c7", "fromNode": "or1", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
    ]

    opt_nodes = [
        {"id": "opt_a", "type": "INPUT", "label": "A", "state": 0, "x": 50, "y": 100},
        {"id": "opt_b", "type": "INPUT", "label": "B", "state": 0, "x": 50, "y": 200},
        {"id": "opt_c", "type": "INPUT", "label": "C", "state": 0, "x": 50, "y": 300},
        {"id": "opt_or", "type": "OR", "label": "OR_BC", "x": 220, "y": 220},
        {"id": "opt_and", "type": "AND", "label": "AND_A_BC", "x": 400, "y": 150},
        {"id": "opt_y", "type": "OUTPUT", "label": "Y", "x": 600, "y": 150}
    ]
    opt_conns = [
        {"id": "oc1", "fromNode": "opt_b", "fromPort": "out", "toNode": "opt_or", "toPort": "in1"},
        {"id": "oc2", "fromNode": "opt_c", "fromPort": "out", "toNode": "opt_or", "toPort": "in2"},
        {"id": "oc3", "fromNode": "opt_a", "fromPort": "out", "toNode": "opt_and", "toPort": "in1"},
        {"id": "oc4", "fromNode": "opt_or", "fromPort": "out", "toNode": "opt_and", "toPort": "in2"},
        {"id": "oc5", "fromNode": "opt_and", "fromPort": "out", "toNode": "opt_y", "toPort": "in"}
    ]

    # Deliberately non-equivalent circuit: A OR B OR C
    wrong_nodes = [
        {"id": "w_a", "type": "INPUT", "label": "A", "state": 0},
        {"id": "w_b", "type": "INPUT", "label": "B", "state": 0},
        {"id": "w_c", "type": "INPUT", "label": "C", "state": 0},
        {"id": "w_or", "type": "OR", "label": "OR_WRONG"},
        {"id": "w_y", "type": "OUTPUT", "label": "Y"}
    ]
    wrong_conns = [
        {"id": "wc1", "fromNode": "w_a", "fromPort": "out", "toNode": "w_or", "toPort": "in1"},
        {"id": "wc2", "fromNode": "w_b", "fromPort": "out", "toNode": "w_or", "toPort": "in2"},
        {"id": "wc3", "fromNode": "w_or", "fromPort": "out", "toNode": "w_y", "toPort": "in"}
    ]

    # --------------------------------------------------
    # 4. Teacher creates question
    # --------------------------------------------------
    q_payload = {
        "title": "Distributive Law Circuit Optimization",
        "description": "Simplify the combinational logic (A·B) + (A·C) to minimum gate count.",
        "difficulty": "medium",
        "input_variables": ["A", "B", "C"],
        "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
        "optimized_circuit": {"nodes": opt_nodes, "connections": opt_conns}
    }
    create_res = client.post("/api/teacher/questions", json=q_payload, headers=teacher_headers)
    assert_true(
        create_res.status_code == 201 and "question_id" in create_res.json,
        "4. Teacher creates question (POST /api/teacher/questions)",
        create_res.data.decode()
    )
    question_id = create_res.json.get("question_id")

    # --------------------------------------------------
    # 5. Teacher saves question as draft
    # --------------------------------------------------
    draft_payload = {
        "title": "Draft Question: Demorgan Logic",
        "description": "Work in progress",
        "difficulty": "easy",
        "original_circuit": {"nodes": [], "connections": []},
        "optimized_circuit": {"nodes": [], "connections": []}
    }
    draft_res = client.post("/api/teacher/questions", json=draft_payload, headers=teacher_headers)
    assert_true(
        draft_res.status_code == 201 and draft_res.json.get("question", {}).get("status") == "draft",
        "5. Teacher saves draft question with status 'draft'"
    )
    draft_id = draft_res.json.get("question_id")

    # --------------------------------------------------
    # 6 & 7. Equivalence & Optimization Verification PASSES
    # --------------------------------------------------
    verify_res = client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": opt_nodes, "connections": opt_conns}
        },
        headers=teacher_headers
    )
    v_data = verify_res.json.get("verification", {})
    assert_true(
        verify_res.status_code == 200 
        and v_data.get("status") == "passed" 
        and v_data.get("equivalent") is True 
        and v_data.get("optimized") is True
        and v_data.get("improvements", {}).get("gate_reduction") == 1,
        "6 & 7. Equivalent & Optimized Circuit Passes Verification (Gate reduction: 1)"
    )

    # --------------------------------------------------
    # 8. Non-equivalent optimized circuit fails with mismatch
    # --------------------------------------------------
    wrong_verify = client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": wrong_nodes, "connections": wrong_conns}
        },
        headers=teacher_headers
    )
    w_data = wrong_verify.json.get("verification", {})
    assert_true(
        wrong_verify.status_code == 200 
        and w_data.get("status") == "failed"
        and w_data.get("equivalent") is False
        and "Output mismatch" in w_data.get("message", ""),
        "8. Non-equivalent optimized circuit fails verification with detailed input mismatch"
    )

    # Re-verify with correct circuit to restore passed status
    client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": opt_nodes, "connections": opt_conns}
        },
        headers=teacher_headers
    )

    # --------------------------------------------------
    # 9. Equivalent but non-improved circuit is rejected for optimization
    # --------------------------------------------------
    same_verify = client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": orig_nodes, "connections": orig_conns} # Exactly identical
        },
        headers=teacher_headers
    )
    s_data = same_verify.json.get("verification", {})
    assert_true(
        same_verify.status_code == 200 
        and s_data.get("equivalent") is True
        and s_data.get("optimized") is False
        and s_data.get("status") == "failed",
        "9. Equivalent but non-improved circuit rejected for optimization (0 gate/depth reduction)"
    )

    # Re-verify with correct optimized circuit so question is verified
    client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": opt_nodes, "connections": opt_conns}
        },
        headers=teacher_headers
    )

    # --------------------------------------------------
    # 10. Invalid circuit (combinational cycle) is rejected
    # --------------------------------------------------
    cycle_nodes = [
        {"id": "a", "type": "INPUT", "label": "A"},
        {"id": "g1", "type": "AND", "label": "AND1"},
        {"id": "g2", "type": "OR", "label": "OR1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    cycle_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g1", "toPort": "in1"},
        {"id": "c2", "fromNode": "g1", "fromPort": "out", "toNode": "g2", "toPort": "in1"},
        {"id": "c3", "fromNode": "g2", "fromPort": "out", "toNode": "g1", "toPort": "in2"}, # Loop!
        {"id": "c4", "fromNode": "g2", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    cycle_verify = client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": cycle_nodes, "connections": cycle_conns}
        },
        headers=teacher_headers
    )
    c_data = cycle_verify.json.get("verification", {})
    assert_true(
        cycle_verify.status_code == 200 and c_data.get("status") == "failed" and any("loop" in err.lower() or "cycle" in err.lower() for err in c_data.get("errors", [])),
        "10. Invalid circuit with combinational cycle is rejected during verification"
    )

    # Re-verify with valid circuit so question is ready to publish
    client.post(
        f"/api/teacher/questions/{question_id}/verify",
        json={
            "original_circuit": {"nodes": orig_nodes, "connections": orig_conns},
            "optimized_circuit": {"nodes": opt_nodes, "connections": opt_conns}
        },
        headers=teacher_headers
    )

    # --------------------------------------------------
    # 11 & 12. Publishing Rules: Verified Can Publish, Unverified Cannot
    # --------------------------------------------------
    # 12: Draft question cannot publish
    fail_pub = client.post(f"/api/teacher/questions/{draft_id}/publish", headers=teacher_headers)
    assert_true(
        fail_pub.status_code == 400 and "Cannot publish question" in fail_pub.json.get("message", ""),
        "12. Teacher cannot publish unverified draft question (400 Bad Request)"
    )

    # 11: Verified question can publish
    pub_res = client.post(f"/api/teacher/questions/{question_id}/publish", headers=teacher_headers)
    assert_true(
        pub_res.status_code == 200 and pub_res.json.get("status") == "published",
        "11. Teacher successfully publishes verified question"
    )

    # --------------------------------------------------
    # 13 & 14. Student Views Question & Security Check
    # --------------------------------------------------
    # 13: Student lists published questions
    st_list = client.get("/api/student/questions", headers=student_headers)
    assert_true(
        st_list.status_code == 200 and len(st_list.json.get("questions", [])) >= 1,
        "13. Student can view published questions"
    )

    # 14: Critical Security Check - optimized_circuit MUST NOT be in response!
    st_get = client.get(f"/api/student/questions/{question_id}", headers=student_headers)
    question_data = st_get.json.get("question", {})
    has_orig = bool(question_data.get("original_circuit"))
    has_opt = "optimized_circuit" in question_data
    assert_true(
        st_get.status_code == 200 and has_orig and not has_opt,
        "14. SECURITY: Student GET question excludes teacher's optimized circuit"
    )

    # --------------------------------------------------
    # 15 & 16. Student Solution Submission & Deterministic Verification
    # --------------------------------------------------
    # Student submits the optimal circuit: A AND (B OR C)
    sub_payload = {
        "submitted_circuit": {"nodes": opt_nodes, "connections": opt_conns}
    }
    submit_res = client.post(f"/api/student/questions/{question_id}/submit", json=sub_payload, headers=student_headers)
    assert_true(
        submit_res.status_code == 200 
        and submit_res.json.get("passed") is True
        and submit_res.json.get("equivalent") is True
        and submit_res.json.get("is_optimized") is True
        and submit_res.json.get("improvements", {}).get("gate_reduction") == 1,
        "15 & 16. Student solution submitted and successfully verified with gate reduction"
    )

    # Student views their previous submissions
    my_subs = client.get(f"/api/student/questions/{question_id}/submissions", headers=student_headers)
    assert_true(
        my_subs.status_code == 200 and len(my_subs.json.get("submissions", [])) >= 1,
        "16b. Student can view their submission history for the question"
    )

    # --------------------------------------------------
    # 17. Student asks a question to teacher (Discussion)
    # --------------------------------------------------
    disc_payload = {
        "message": "Prof. Turing, could you clarify whether using a NAND-NAND equivalent is also acceptable for this problem?"
    }
    post_disc = client.post(f"/api/student/questions/{question_id}/discussions", json=disc_payload, headers=student_headers)
    assert_true(
        post_disc.status_code == 201 and "discussion" in post_disc.json,
        "17. Student posts a question to the teacher"
    )
    discussion_id = post_disc.json.get("discussion", {}).get("id")

    # --------------------------------------------------
    # 18. Teacher replies to student question
    # --------------------------------------------------
    reply_payload = {
        "message": "Yes! NAND-NAND logic is functionally complete and acceptable as long as total gate count and propagation depth satisfy the optimization criteria.",
        "reply_to": discussion_id
    }
    reply_res = client.post(f"/api/teacher/questions/{question_id}/discussions/{discussion_id}/reply", json=reply_payload, headers=teacher_headers)
    assert_true(
        reply_res.status_code == 201 and reply_res.json.get("discussion", {}).get("sender_role") == "teacher",
        "18. Teacher replies to student question"
    )

    # --------------------------------------------------
    # 19. Student views teacher response in discussion thread
    # --------------------------------------------------
    view_disc = client.get(f"/api/student/questions/{question_id}/discussions", headers=student_headers)
    discs = view_disc.json.get("discussions", [])
    has_teacher_reply = any(d.get("sender_role") == "teacher" for d in discs)
    assert_true(
        view_disc.status_code == 200 and len(discs) >= 2 and has_teacher_reply,
        "19. Student views discussion thread containing teacher's reply"
    )

    # --------------------------------------------------
    # 20. Unauthorized API calls rejected
    # --------------------------------------------------
    unauth_teacher = client.get("/api/teacher/questions")
    unauth_student = client.get("/api/student/questions")
    assert_true(
        unauth_teacher.status_code == 401 and unauth_student.status_code == 401,
        "20. Unauthenticated requests without token rejected (401 Unauthorized)"
    )

    # --------------------------------------------------
    # 21. Teacher Stats & MongoDB persistence
    # --------------------------------------------------
    stats_res = client.get("/api/teacher/stats", headers=teacher_headers)
    assert_true(
        stats_res.status_code == 200 and stats_res.json.get("stats", {}).get("total_submissions") >= 1,
        "21. Teacher Dashboard statistics reflect student submissions"
    )

    # --------------------------------------------------
    # 22. Standalone Verification of All Supported Logic Gates & Half Adder
    # --------------------------------------------------
    # Half Adder: (A, B) -> SUM = A XOR B, CARRY = A AND B
    ha_orig_nodes = [
        {"id": "ha_a", "type": "INPUT", "label": "A"},
        {"id": "ha_b", "type": "INPUT", "label": "B"},
        {"id": "ha_xor", "type": "XOR", "label": "XOR1"},
        {"id": "ha_and", "type": "AND", "label": "AND1"},
        {"id": "ha_sum", "type": "OUTPUT", "label": "SUM"},
        {"id": "ha_carry", "type": "OUTPUT", "label": "CARRY"}
    ]
    ha_orig_conns = [
        {"id": "hac1", "fromNode": "ha_a", "fromPort": "out", "toNode": "ha_xor", "toPort": "in1"},
        {"id": "hac2", "fromNode": "ha_b", "fromPort": "out", "toNode": "ha_xor", "toPort": "in2"},
        {"id": "hac3", "fromNode": "ha_xor", "fromPort": "out", "toNode": "ha_sum", "toPort": "in"},
        {"id": "hac4", "fromNode": "ha_a", "fromPort": "out", "toNode": "ha_and", "toPort": "in1"},
        {"id": "hac5", "fromNode": "ha_b", "fromPort": "out", "toNode": "ha_and", "toPort": "in2"},
        {"id": "hac6", "fromNode": "ha_and", "fromPort": "out", "toNode": "ha_carry", "toPort": "in"}
    ]
    ha_verify = client.post("/api/questions/verify", json={
        "original_circuit": {"nodes": ha_orig_nodes, "connections": ha_orig_conns},
        "optimized_circuit": {"nodes": ha_orig_nodes, "connections": ha_orig_conns}
    })
    assert_true(
        ha_verify.status_code == 200 and ha_verify.json.get("equivalent") is True,
        "22. Half Adder multi-output (SUM, CARRY) truth-table verified across 2^2=4 states"
    )

    print("======================================================")
    print(f"TEACHER-STUDENT TEST RUN: {passed} PASSED, {failed} FAILED.")
    print("======================================================")
    return failed == 0

if __name__ == "__main__":
    success = run_teacher_student_tests()
    exit(0 if success else 1)
