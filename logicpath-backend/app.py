from datetime import datetime, timezone
from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS

from auth import (
    register_user,
    login_user,
    request_password_reset,
    reset_password_with_token,
    token_required,
    roles_allowed,
    decode_token
)
from database import (
    circuits_collection,
    simulation_history_collection,
    questions_collection,
    submissions_collection,
    discussions_collection,
    users_collection,
    learning_progress_collection,
)
from logic_engine import (
    validate_circuit,
    simulate_circuit,
    generate_truth_table,
    generate_boolean_expression,
    optimize_circuit
)
from circuit_verifier import verify_circuit_pair, calculate_circuit_metrics
from examples import EXAMPLE_CIRCUITS, EDUCATIONAL_GATES, CHALLENGES
from config import PORT, DEBUG


app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app, resources={r"/*": {"origins": "*"}})


# --------------------------------------------------
# SYSTEM & HEALTH
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return "LogicPath backend is running!"


@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({
        "status": "online",
        "message": "React successfully connected to Flask!",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


# --------------------------------------------------
# AUTHENTICATION
# --------------------------------------------------

@app.route("/api/auth/register", methods=["POST"])
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip() or data.get("email", "").split("@")[0]
    email = data.get("email", "").strip()
    password = data.get("password", "")
    role = data.get("role", "student")

    result = register_user(name, email, password, role=role)
    return jsonify(result), result.get("status_code", 200)


@app.route("/api/auth/login", methods=["POST"])
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")

    result = login_user(email, password)
    return jsonify(result), result.get("status_code", 200)


@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    result = request_password_reset(email)
    return jsonify(result), result.get("status_code", 200)


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token", "").strip()
    password = data.get("password", "")
    result = reset_password_with_token(token, password)
    return jsonify(result), result.get("status_code", 200)


@app.route("/api/auth/me", methods=["GET"])
@token_required
def get_current_user_profile(current_user):
    return jsonify({
        "success": True,
        "user": current_user
    }), 200


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200


# --------------------------------------------------
# CIRCUIT PERSISTENCE (Protected by JWT)
# --------------------------------------------------

def serialize_circuit(doc):
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", "Untitled Circuit"),
        "description": doc.get("description", ""),
        "nodes": doc.get("nodes", []),
        "connections": doc.get("connections", []),
        "inputs": doc.get("inputs", [n.get("label") or n.get("id") for n in doc.get("nodes", []) if n.get("type", "").upper() == "INPUT"]),
        "outputs": doc.get("outputs", [n.get("label") or n.get("id") for n in doc.get("nodes", []) if n.get("type", "").upper() == "OUTPUT"]),
        "boolean_expression": doc.get("boolean_expression", ""),
        "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at", ""),
        "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at", ""),
    }


@app.route("/api/circuits", methods=["POST"])
@token_required
def create_circuit(current_user):
    data = request.get_json() or {}
    name = (data.get("name") or "Untitled Circuit").strip()
    description = (data.get("description") or "").strip()
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])
    boolean_expression = data.get("boolean_expression", "")

    inputs = [n.get("label") or n.get("id") for n in nodes if n.get("type", "").upper() == "INPUT"]
    outputs = [n.get("label") or n.get("id") for n in nodes if n.get("type", "").upper() == "OUTPUT"]

    if not boolean_expression and nodes and connections:
        try:
            expr_res = generate_boolean_expression(nodes, connections)
            if expr_res.get("success") and expr_res.get("expressions"):
                expr_parts = [f"{out} = {item['standard']}" for out, item in expr_res["expressions"].items()]
                boolean_expression = "; ".join(expr_parts)
        except Exception:
            pass

    now = datetime.now(timezone.utc)
    circuit_doc = {
        "user_id": current_user["id"],
        "name": name,
        "description": description,
        "nodes": nodes,
        "connections": connections,
        "inputs": inputs,
        "outputs": outputs,
        "boolean_expression": boolean_expression,
        "created_at": now,
        "updated_at": now,
    }

    result = circuits_collection.insert_one(circuit_doc)
    circuit_id = str(result.inserted_id)

    return jsonify({
        "success": True,
        "message": "Circuit saved successfully!",
        "circuit_id": circuit_id,
        "circuit": serialize_circuit({**circuit_doc, "_id": result.inserted_id})
    }), 201


@app.route("/api/circuits", methods=["GET"])
@token_required
def list_circuits(current_user):
    cursor = circuits_collection.find({"user_id": current_user["id"]})
    try:
        cursor = cursor.sort("updated_at", -1)
    except Exception:
        pass

    circuits = [serialize_circuit(doc) for doc in cursor]
    return jsonify({
        "success": True,
        "count": len(circuits),
        "circuits": circuits
    }), 200


@app.route("/api/circuits/<circuit_id>", methods=["GET"])
@token_required
def get_circuit(current_user, circuit_id):
    query = {"user_id": current_user["id"]}
    if ObjectId.is_valid(circuit_id):
        query["_id"] = ObjectId(circuit_id)
    else:
        query["_id"] = circuit_id

    doc = circuits_collection.find_one(query)
    if not doc:
        return jsonify({"success": False, "message": "Circuit not found or access denied"}), 404

    return jsonify({
        "success": True,
        "circuit": serialize_circuit(doc)
    }), 200


@app.route("/api/circuits/<circuit_id>", methods=["PUT"])
@token_required
def update_circuit(current_user, circuit_id):
    query = {"user_id": current_user["id"]}
    if ObjectId.is_valid(circuit_id):
        query["_id"] = ObjectId(circuit_id)
    else:
        query["_id"] = circuit_id

    existing = circuits_collection.find_one(query)
    if not existing:
        return jsonify({"success": False, "message": "Circuit not found or access denied"}), 404

    data = request.get_json() or {}
    update_fields = {"updated_at": datetime.now(timezone.utc)}

    if "name" in data:
        update_fields["name"] = data["name"].strip() or "Untitled Circuit"
    if "description" in data:
        update_fields["description"] = data["description"].strip()
    if "nodes" in data:
        update_fields["nodes"] = data["nodes"]
        update_fields["inputs"] = [n.get("label") or n.get("id") for n in data["nodes"] if n.get("type", "").upper() == "INPUT"]
        update_fields["outputs"] = [n.get("label") or n.get("id") for n in data["nodes"] if n.get("type", "").upper() == "OUTPUT"]
    if "connections" in data:
        update_fields["connections"] = data["connections"]
    if "boolean_expression" in data:
        update_fields["boolean_expression"] = data["boolean_expression"]

    circuits_collection.update_one(query, {"$set": update_fields})

    updated_doc = circuits_collection.find_one(query)
    return jsonify({
        "success": True,
        "message": "Circuit updated successfully!",
        "circuit": serialize_circuit(updated_doc)
    }), 200


@app.route("/api/circuits/<circuit_id>", methods=["DELETE"])
@token_required
def delete_circuit(current_user, circuit_id):
    query = {"user_id": current_user["id"]}
    if ObjectId.is_valid(circuit_id):
        query["_id"] = ObjectId(circuit_id)
    else:
        query["_id"] = circuit_id

    result = circuits_collection.delete_one(query)
    if result.deleted_count == 0:
        return jsonify({"success": False, "message": "Circuit not found or access denied"}), 404

    return jsonify({
        "success": True,
        "message": "Circuit deleted successfully!"
    }), 200


@app.route("/api/simulations/history", methods=["GET"])
@token_required
def get_simulation_history(current_user):
    cursor = simulation_history_collection.find({"user_id": current_user["id"]})
    try:
        cursor = cursor.sort("simulated_at", -1).limit(20)
    except Exception:
        pass

    history = []
    for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "circuit_id": doc.get("circuit_id"),
            "input_values": doc.get("input_values", {}),
            "output_values": doc.get("output_values", {}),
            "simulated_at": doc.get("simulated_at").isoformat() if isinstance(doc.get("simulated_at"), datetime) else doc.get("simulated_at", "")
        })

    return jsonify({
        "success": True,
        "count": len(history),
        "history": history
    }), 200


# --------------------------------------------------
# LOGIC, SIMULATION & ANALYSIS APIS
# --------------------------------------------------

@app.route("/api/validate", methods=["POST"])
def api_validate():
    data = request.get_json() or {}
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])

    is_valid, errors, warnings = validate_circuit(nodes, connections)
    return jsonify({
        "success": is_valid,
        "errors": errors,
        "warnings": warnings,
        "message": "Circuit is logically valid!" if is_valid else "Circuit validation failed."
    }), 200 if is_valid else 422


@app.route("/api/simulate", methods=["POST"])
def api_simulate():
    data = request.get_json() or {}
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])
    input_values = data.get("input_values", {})
    circuit_id = data.get("circuit_id")

    result = simulate_circuit(nodes, connections, input_values)

    # Record in simulation_history if user token provided
    auth_header = request.headers.get("Authorization")
    if auth_header and result["success"]:
        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            payload = decode_token(parts[1])
            if payload:
                try:
                    simulation_history_collection.insert_one({
                        "user_id": payload.get("user_id"),
                        "circuit_id": circuit_id or "unpersisted",
                        "input_values": input_values,
                        "output_values": result["output_values"],
                        "simulated_at": datetime.now(timezone.utc)
                    })
                except Exception:
                    pass

    status_code = 200 if result["success"] else 422
    return jsonify(result), status_code


@app.route("/api/truth-table", methods=["POST"])
def api_truth_table():
    data = request.get_json() or {}
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])

    result = generate_truth_table(nodes, connections)
    status_code = 200 if result["success"] else 422
    return jsonify(result), status_code


@app.route("/api/boolean-expression", methods=["POST"])
def api_boolean_expression():
    data = request.get_json() or {}
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])

    result = generate_boolean_expression(nodes, connections)
    status_code = 200 if result["success"] else 422
    return jsonify(result), status_code


@app.route("/api/optimize", methods=["POST"])
def api_optimize():
    data = request.get_json() or {}
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])

    result = optimize_circuit(nodes, connections)
    status_code = 200 if result["success"] else 422
    return jsonify(result), status_code


# --------------------------------------------------
# EDUCATIONAL & PRESETS
# --------------------------------------------------

@app.route("/api/examples", methods=["GET"])
def get_examples():
    return jsonify({
        "success": True,
        "count": len(EXAMPLE_CIRCUITS),
        "examples": EXAMPLE_CIRCUITS
    }), 200


@app.route("/api/gates", methods=["GET"])
def get_educational_gates():
    return jsonify({
        "success": True,
        "gates": EDUCATIONAL_GATES
    }), 200


@app.route("/api/challenges", methods=["GET"])
def get_challenges():
    return jsonify({
        "success": True,
        "challenges": CHALLENGES
    }), 200


@app.route("/api/challenges/verify", methods=["POST"])
def verify_challenge():
    data = request.get_json() or {}
    challenge_id = data.get("challenge_id")
    nodes = data.get("nodes", [])
    connections = data.get("connections", [])

    target_challenge = next((c for c in CHALLENGES if c["id"] == challenge_id), None)
    if not target_challenge:
        return jsonify({"success": False, "message": "Challenge not found"}), 404

    tt_result = generate_truth_table(nodes, connections)
    if not tt_result["success"]:
        return jsonify({
            "success": False,
            "passed": False,
            "message": "Circuit could not be evaluated: " + "; ".join(tt_result["errors"])
        }), 422

    user_rows = tt_result["rows"]
    expected_rows = target_challenge["expectedTruthTable"]

    if len(user_rows) != len(expected_rows):
        return jsonify({
            "success": True,
            "passed": False,
            "message": f"Truth table size mismatch. Expected {len(expected_rows)} input combinations, got {len(user_rows)}."
        }), 200

    for idx, exp_row in enumerate(expected_rows):
        u_row = user_rows[idx]
        for key, exp_val in exp_row.items():
            if key not in u_row or u_row[key] != exp_val:
                return jsonify({
                    "success": True,
                    "passed": False,
                    "message": f"Verification failed at row {idx + 1}. Expected {key}={exp_val}, but circuit evaluated to {u_row.get(key, 'missing')}."
                }), 200

    return jsonify({
        "success": True,
        "passed": True,
        "message": f"🎉 Congratulations! Circuit successfully solved '{target_challenge['title']}'!"
    }), 200


# ==================================================
# TEACHER & STUDENT HELPERS & SERIALIZERS
# ==================================================

def find_doc_by_id(collection, doc_id, extra_query=None):
    q = dict(extra_query or {})
    if ObjectId.is_valid(doc_id):
        doc = collection.find_one({**q, "_id": ObjectId(doc_id)})
        if doc:
            return doc
    return collection.find_one({**q, "_id": doc_id})


def serialize_question(doc, include_optimized=False):
    """
    Serializes a question document.
    Crucial security safeguard: include_optimized defaults to False to prevent
    exposing teacher's solution to students.
    """
    res = {
        "id": str(doc["_id"]),
        "title": doc.get("title", "Untitled Problem"),
        "description": doc.get("description", ""),
        "category": doc.get("category", "Boolean"),
        "topic": doc.get("topic", doc.get("law", "General Logic")),
        "law": doc.get("law", doc.get("topic", "General Logic")),
        "difficulty": doc.get("difficulty", "medium"),
        "input_variables": doc.get("input_variables", []),
        "output_variables": doc.get("output_variables", []),
        "constraints": doc.get("constraints", ""),
        "hints": doc.get("hints", []),
        "teacher_id": str(doc.get("teacher_id", "")),
        "teacher_name": doc.get("teacher_name", "Teacher"),
        "original_circuit": doc.get("original_circuit", {"nodes": [], "connections": []}),
        "verification": doc.get("verification", {
            "status": "pending",
            "equivalent": False,
            "optimized": False,
            "message": "Verification pending"
        }),
        "status": doc.get("status", "draft"),
        "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at", ""),
        "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at", ""),
    }
    if include_optimized:
        res["optimized_circuit"] = doc.get("optimized_circuit", {"nodes": [], "connections": []})
    return res


def serialize_submission(doc):
    feedback = doc.get("teacher_feedback") or {}
    return {
        "id": str(doc["_id"]),
        "student_id": str(doc.get("student_id", "")),
        "student_name": doc.get("student_name", "Student"),
        "student_email": doc.get("student_email", ""),
        "question_id": str(doc.get("question_id", "")),
        "question_title": doc.get("question_title", ""),
        "submitted_circuit": doc.get("submitted_circuit", {}),
        "equivalence_result": doc.get("equivalence_result", {}),
        "optimization_metrics": doc.get("optimization_metrics", {}),
        "verification_result": doc.get("verification_result", {}),
        "xp_awarded": doc.get("xp_awarded", 0),
        "teacher_feedback": {
            "status": feedback.get("status"),
            "score": feedback.get("score"),
            "text": feedback.get("text", ""),
            "teacher_name": feedback.get("teacher_name", ""),
            "updated_at": feedback.get("updated_at", ""),
        } if feedback else None,
        "submitted_at": doc.get("submitted_at").isoformat() if isinstance(doc.get("submitted_at"), datetime) else doc.get("submitted_at", ""),
    }


XP_BY_DIFFICULTY = {"easy": 50, "medium": 100, "hard": 150}
XP_OPTIMIZATION_BONUS = 25
XP_PER_LEVEL = 200


def compute_level(xp):
    return max(1, (int(xp) // XP_PER_LEVEL) + 1)


def derive_achievements(problems_completed, xp, total_submissions, optimized_count):
    badges = []
    if problems_completed >= 1:
        badges.append({"id": "first_solve", "name": "First Circuit Solved", "description": "Completed your first logic problem"})
    if problems_completed >= 5:
        badges.append({"id": "circuit_crafter", "name": "Circuit Crafter", "description": "Solved 5 problems"})
    if problems_completed >= 10:
        badges.append({"id": "logic_master", "name": "Logic Master", "description": "Solved 10 problems"})
    if optimized_count >= 3:
        badges.append({"id": "optimizer", "name": "Optimization Ace", "description": "Submitted 3 optimized solutions"})
    if xp >= 500:
        badges.append({"id": "xp_hunter", "name": "XP Hunter", "description": "Earned 500 XP"})
    if total_submissions >= 1:
        badges.append({"id": "first_attempt", "name": "First Attempt", "description": "Submitted your first solution"})
    return badges


def award_student_xp(user_id, xp_gain, problem_newly_completed=False):
    """Persist XP / level / achievements for a student. Returns updated stats."""
    from bson import ObjectId as BsonObjectId

    user = None
    if ObjectId.is_valid(user_id):
        user = users_collection.find_one({"_id": BsonObjectId(user_id)})
    if not user:
        user = users_collection.find_one({"_id": user_id})
    if not user:
        return {"xp": 0, "level": 1, "xp_awarded": 0, "achievements": []}

    current_xp = int(user.get("xp") or 0)
    problems_completed = int(user.get("problems_completed") or 0)
    new_xp = current_xp + max(0, int(xp_gain))
    if problem_newly_completed:
        problems_completed += 1

    # Count optimized / total submissions for achievements
    all_subs = list(submissions_collection.find({"student_id": str(user_id)}))
    optimized_count = sum(1 for s in all_subs if s.get("optimization_metrics", {}).get("is_optimized"))
    achievements = derive_achievements(problems_completed, new_xp, len(all_subs), optimized_count)
    new_level = compute_level(new_xp)

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "xp": new_xp,
            "level": new_level,
            "problems_completed": problems_completed,
            "achievements": achievements,
            "updated_at": datetime.now(timezone.utc),
        }}
    )
    return {
        "xp": new_xp,
        "level": new_level,
        "xp_awarded": max(0, int(xp_gain)),
        "problems_completed": problems_completed,
        "achievements": achievements,
    }


def serialize_discussion(doc):
    return {
        "id": str(doc["_id"]),
        "question_id": str(doc.get("question_id", "")),
        "sender_id": str(doc.get("sender_id", "")),
        "sender_name": doc.get("sender_name", "User"),
        "sender_role": doc.get("sender_role", "student"),
        "message": doc.get("message", ""),
        "reply_to": str(doc.get("reply_to")) if doc.get("reply_to") else None,
        "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at", ""),
    }


# ==================================================
# STANDALONE CIRCUIT VERIFICATION API
# ==================================================

@app.route("/api/questions/verify-circuits", methods=["POST"])
@app.route("/api/questions/verify", methods=["POST"])
def verify_arbitrary_circuits():
    """
    Runs deterministic equivalence & optimization verification on two circuits.
    """
    data = request.get_json() or {}
    orig = data.get("original_circuit") or {}
    opt = data.get("optimized_circuit") or data.get("candidate_circuit") or {}

    result = verify_circuit_pair(orig, opt)
    return jsonify(result), 200


# ==================================================
# TEACHER APIS
# ==================================================

@app.route("/api/teacher/questions", methods=["POST"])
@roles_allowed("teacher")
def teacher_create_question(current_user):
    data = request.get_json() or {}
    title = (data.get("title") or "Untitled Logic Problem").strip()
    description = (data.get("description") or "").strip()
    difficulty = (data.get("difficulty") or "medium").strip().lower()
    category = (data.get("category") or "Boolean").strip()
    topic = (
            data.get("topic")
            or data.get("law")
            or "Distributive Law"
        ).strip()
    law = (
            data.get("law")
            or data.get("topic")
            or topic
        ).strip()
    input_variables = data.get("input_variables") or []
    output_variables = data.get("output_variables") or []
    constraints = (data.get("constraints") or "").strip()
    hints = data.get("hints") or []
    if isinstance(hints, str):
        hints = [h.strip() for h in hints.split("\n") if h.strip()]
    original_circuit = data.get("original_circuit") or {"nodes": [], "connections": []}
    optimized_circuit = data.get("optimized_circuit") or {"nodes": [], "connections": []}

    # Extract input variables from original circuit if not explicitly provided
    if not input_variables and original_circuit.get("nodes"):
        input_variables = [
            n.get("label") or n.get("id")
            for n in original_circuit["nodes"]
            if n.get("type", "").upper() == "INPUT"
        ]
    if not output_variables and original_circuit.get("nodes"):
        output_variables = [
            n.get("label") or n.get("id")
            for n in original_circuit["nodes"]
            if n.get("type", "").upper() == "OUTPUT"
        ]

    now = datetime.now(timezone.utc)
    question_doc = {
        "title": title,
        "description": description,
        "category": category,
        "topic": topic,
        "law": law,
        "difficulty": difficulty,
        "input_variables": input_variables,
        "output_variables": output_variables,
        "constraints": constraints,
        "hints": hints,
        "teacher_id": current_user["id"],
        "teacher_name": current_user.get("name", "Teacher"),
        "original_circuit": original_circuit,
        "optimized_circuit": optimized_circuit,
        "verification": {
            "status": "pending",
            "equivalent": False,
            "optimized": False,
            "message": "Circuit verification not yet executed.",
            "errors": []
        },
        "status": "draft",
        "created_at": now,
        "updated_at": now,
    }

    # If both circuits are non-empty, run initial verification automatically
    if original_circuit.get("nodes") and optimized_circuit.get("nodes"):
        v_res = verify_circuit_pair(original_circuit, optimized_circuit)
        question_doc["verification"] = {
            "status": "passed" if v_res["verification_status"] == "PASSED" else "failed",
            "equivalent": v_res["equivalent"],
            "optimized": v_res["optimized"],
            "original_metrics": v_res["original_metrics"],
            "optimized_metrics": v_res["optimized_metrics"],
            "improvements": v_res["improvements"],
            "ai_explanation": v_res["ai_explanation"],
            "message": v_res["message"],
            "errors": v_res["errors"],
        }
        if v_res["verification_status"] == "PASSED":
            question_doc["status"] = "verified"

    result = questions_collection.insert_one(question_doc)
    question_id = str(result.inserted_id)

    return jsonify({
        "success": True,
        "message": "Question created successfully!",
        "question_id": question_id,
        "question": serialize_question({**question_doc, "_id": result.inserted_id}, include_optimized=True)
    }), 201


@app.route("/api/teacher/questions", methods=["GET"])
@roles_allowed("teacher")
def teacher_list_questions(current_user):
    cursor = questions_collection.find({"teacher_id": current_user["id"]})
    try:
        cursor = cursor.sort("updated_at", -1)
    except Exception:
        pass

    questions = []
    for doc in cursor:
        q_ser = serialize_question(doc, include_optimized=True)
        q_id = str(doc["_id"])
        # Attach statistics
        try:
            subs = list(submissions_collection.find({"question_id": q_id}))
            q_ser["submissions_count"] = len(subs)
            q_ser["passed_submissions_count"] = sum(
                1 for s in subs if s.get("verification_result", {}).get("passed") is True
            )
            discs = list(discussions_collection.find({"question_id": q_id}))
            q_ser["discussions_count"] = len(discs)
        except Exception:
            q_ser["submissions_count"] = 0
            q_ser["passed_submissions_count"] = 0
            q_ser["discussions_count"] = 0
        questions.append(q_ser)

    return jsonify({
        "success": True,
        "count": len(questions),
        "questions": questions
    }), 200


@app.route("/api/teacher/questions/<question_id>", methods=["GET"])
@roles_allowed("teacher")
def teacher_get_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    q_ser = serialize_question(doc, include_optimized=True)
    q_id = str(doc["_id"])
    subs = list(submissions_collection.find({"question_id": q_id}))
    q_ser["submissions_count"] = len(subs)
    q_ser["passed_submissions_count"] = sum(
        1 for s in subs if s.get("verification_result", {}).get("passed") is True
    )

    return jsonify({
        "success": True,
        "question": q_ser
    }), 200


@app.route("/api/teacher/questions/<question_id>", methods=["PUT"])
@roles_allowed("teacher")
def teacher_update_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    data = request.get_json() or {}
    update_fields = {"updated_at": datetime.now(timezone.utc)}

    if "title" in data:
        update_fields["title"] = data["title"].strip() or "Untitled Logic Problem"
    if "description" in data:
        update_fields["description"] = data["description"].strip()
    if "category" in data:
        update_fields["category"] = (
        data.get("category") or "Boolean"
    ).strip()

    if "topic" in data or "law" in data:
        topic_value = (
        data.get("topic")
        or data.get("law")
        or doc.get("topic")
        or doc.get("law")
        or "Distributive Law"
    ).strip()

    update_fields["topic"] = topic_value
    update_fields["law"] = topic_value
    if "difficulty" in data:
        update_fields["difficulty"] = data["difficulty"].strip().lower()
    if "input_variables" in data:
        update_fields["input_variables"] = data["input_variables"]
    if "output_variables" in data:
        update_fields["output_variables"] = data["output_variables"]
    if "constraints" in data:
        update_fields["constraints"] = (data["constraints"] or "").strip()
    if "hints" in data:
        hints = data["hints"]
        if isinstance(hints, str):
            hints = [h.strip() for h in hints.split("\n") if h.strip()]
        update_fields["hints"] = hints or []
    if "original_circuit" in data:
        update_fields["original_circuit"] = data["original_circuit"]
    if "optimized_circuit" in data:
        update_fields["optimized_circuit"] = data["optimized_circuit"]

    # If circuits were updated, reset verification status to require re-verification
    if "original_circuit" in data or "optimized_circuit" in data:
        orig = update_fields.get("original_circuit", doc.get("original_circuit"))
        opt = update_fields.get("optimized_circuit", doc.get("optimized_circuit"))
        if orig.get("nodes") and opt.get("nodes"):
            v_res = verify_circuit_pair(orig, opt)
            update_fields["verification"] = {
                "status": "passed" if v_res["verification_status"] == "PASSED" else "failed",
                "equivalent": v_res["equivalent"],
                "optimized": v_res["optimized"],
                "original_metrics": v_res["original_metrics"],
                "optimized_metrics": v_res["optimized_metrics"],
                "improvements": v_res["improvements"],
                "ai_explanation": v_res["ai_explanation"],
                "message": v_res["message"],
                "errors": v_res["errors"],
            }
            update_fields["status"] = "verified" if v_res["verification_status"] == "PASSED" else "draft"
        else:
            update_fields["status"] = "draft"
            update_fields["verification"] = {
                "status": "pending",
                "equivalent": False,
                "optimized": False,
                "message": "Circuits incomplete."
            }

    q_filter = {"_id": doc["_id"]}
    questions_collection.update_one(q_filter, {"$set": update_fields})
    updated_doc = questions_collection.find_one(q_filter)

    return jsonify({
        "success": True,
        "message": "Question updated successfully!",
        "question": serialize_question(updated_doc, include_optimized=True)
    }), 200


@app.route("/api/teacher/questions/<question_id>", methods=["DELETE"])
@roles_allowed("teacher")
def teacher_delete_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    q_id = str(doc["_id"])
    questions_collection.delete_one({"_id": doc["_id"]})
    try:
        submissions_collection.delete_many({"question_id": q_id})
        discussions_collection.delete_many({"question_id": q_id})
    except Exception:
        pass

    return jsonify({
        "success": True,
        "message": "Question and associated records deleted successfully!"
    }), 200


@app.route("/api/teacher/questions/<question_id>/verify", methods=["POST"])
@roles_allowed("teacher")
def teacher_verify_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    data = request.get_json() or {}
    orig = data.get("original_circuit") or doc.get("original_circuit") or {}
    opt = data.get("optimized_circuit") or doc.get("optimized_circuit") or {}

    v_res = verify_circuit_pair(orig, opt)
    v_status = "passed" if v_res["verification_status"] == "PASSED" else "failed"

    verification_doc = {
        "status": v_status,
        "equivalent": v_res["equivalent"],
        "optimized": v_res["optimized"],
        "original_metrics": v_res["original_metrics"],
        "optimized_metrics": v_res["optimized_metrics"],
        "improvements": v_res["improvements"],
        "ai_explanation": v_res["ai_explanation"],
        "message": v_res["message"],
        "errors": v_res["errors"],
        "verified_at": datetime.now(timezone.utc).isoformat()
    }

    new_status = "verified" if v_status == "passed" else "draft"
    update_data = {
        "verification": verification_doc,
        "status": new_status,
        "updated_at": datetime.now(timezone.utc)
    }
    if "original_circuit" in data:
        update_data["original_circuit"] = data["original_circuit"]
    if "optimized_circuit" in data:
        update_data["optimized_circuit"] = data["optimized_circuit"]

    questions_collection.update_one({"_id": doc["_id"]}, {"$set": update_data})

    return jsonify({
        "success": True,
        "verification": verification_doc,
        "can_publish": (v_status == "passed"),
        "message": v_res["message"]
    }), 200


@app.route("/api/teacher/questions/<question_id>/publish", methods=["POST"])
@roles_allowed("teacher")
def teacher_publish_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    verification = doc.get("verification", {})
    if verification.get("status") != "passed" or not verification.get("equivalent") or not verification.get("optimized"):
        return jsonify({
            "success": False,
            "message": "Cannot publish question: The teacher-provided optimized circuit must pass deterministic equivalence and optimization verification before publishing."
        }), 400

    questions_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": "published", "updated_at": datetime.now(timezone.utc)}}
    )

    return jsonify({
        "success": True,
        "message": "Question successfully published! Students can now access and solve this problem.",
        "status": "published"
    }), 200


@app.route("/api/teacher/questions/<question_id>/unpublish", methods=["POST"])
@roles_allowed("teacher")
def teacher_unpublish_question(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    questions_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": "unpublished", "updated_at": datetime.now(timezone.utc)}}
    )

    return jsonify({
        "success": True,
        "message": "Question unpublished. It is no longer accessible to students.",
        "status": "unpublished"
    }), 200


@app.route("/api/teacher/questions/<question_id>/submissions", methods=["GET"])
@roles_allowed("teacher")
def teacher_get_question_submissions(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    cursor = submissions_collection.find({"question_id": str(doc["_id"])})
    try:
        cursor = cursor.sort("submitted_at", -1)
    except Exception:
        pass

    subs = [serialize_submission(s) for s in cursor]
    return jsonify({
        "success": True,
        "count": len(subs),
        "submissions": subs
    }), 200


@app.route("/api/teacher/questions/<question_id>/discussions", methods=["GET"])
@roles_allowed("teacher")
def teacher_get_question_discussions(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    cursor = discussions_collection.find({"question_id": str(doc["_id"])})
    try:
        cursor = cursor.sort("created_at", 1)
    except Exception:
        pass

    discs = [serialize_discussion(d) for d in cursor]
    return jsonify({
        "success": True,
        "count": len(discs),
        "discussions": discs
    }), 200


@app.route("/api/teacher/questions/<question_id>/discussions", methods=["POST"])
@app.route("/api/teacher/questions/<question_id>/discussions/<discussion_id>/reply", methods=["POST"])
@roles_allowed("teacher")
def teacher_reply_discussion(current_user, question_id, discussion_id=None):
    doc = find_doc_by_id(questions_collection, question_id, {"teacher_id": current_user["id"]})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or access denied"}), 404

    data = request.get_json() or {}
    message = (data.get("message") or "").strip()
    reply_to = discussion_id or data.get("reply_to")

    if not message:
        return jsonify({"success": False, "message": "Message content cannot be empty"}), 400

    now = datetime.now(timezone.utc)
    disc_doc = {
        "question_id": str(doc["_id"]),
        "sender_id": current_user["id"],
        "sender_name": current_user.get("name", "Teacher"),
        "sender_role": "teacher",
        "message": message,
        "reply_to": reply_to,
        "created_at": now,
    }

    result = discussions_collection.insert_one(disc_doc)
    return jsonify({
        "success": True,
        "message": "Reply posted successfully!",
        "discussion": serialize_discussion({**disc_doc, "_id": result.inserted_id})
    }), 201


@app.route("/api/teacher/stats", methods=["GET"])
@roles_allowed("teacher")
def teacher_dashboard_stats(current_user):
    teacher_id = current_user["id"]
    q_list = list(questions_collection.find({"teacher_id": teacher_id}))
    q_ids = [str(q["_id"]) for q in q_list]

    total_questions = len(q_list)
    published_questions = sum(1 for q in q_list if q.get("status") == "published")
    verified_questions = sum(1 for q in q_list if q.get("status") == "verified")
    draft_questions = sum(1 for q in q_list if q.get("status") == "draft")

    all_submissions = list(submissions_collection.find({"question_id": {"$in": q_ids}})) if q_ids else []
    total_submissions = len(all_submissions)
    passed_submissions = sum(1 for s in all_submissions if s.get("verification_result", {}).get("passed") is True)

    pass_rate = round((passed_submissions / total_submissions) * 100, 1) if total_submissions > 0 else 0

    return jsonify({
        "success": True,
        "stats": {
            "total_questions": total_questions,
            "published_questions": published_questions,
            "verified_questions": verified_questions,
            "draft_questions": draft_questions,
            "total_submissions": total_submissions,
            "passed_submissions": passed_submissions,
            "pass_rate_pct": pass_rate,
        }
    }), 200


# ==================================================
# STUDENT APIS
# ==================================================

@app.route("/api/student/questions", methods=["GET"])
@roles_allowed("student", "teacher")
def student_list_questions(current_user):
    """
    Returns published questions available for students to solve.
    CRITICAL: Never exposes teacher's optimized_circuit.
    """
    difficulty = request.args.get("difficulty")
    query = {"status": "published"}
    if difficulty and difficulty.lower() != "all":
        query["difficulty"] = difficulty.lower()

    cursor = questions_collection.find(query)
    try:
        cursor = cursor.sort("created_at", -1)
    except Exception:
        pass

    student_id = current_user["id"]
    questions = []
    for doc in cursor:
        q_id = str(doc["_id"])
        # NEVER include optimized_circuit
        q_ser = serialize_question(doc, include_optimized=False)

        # Check if student has solved this question
        sub = submissions_collection.find_one({
            "student_id": student_id,
            "question_id": q_id,
            "verification_result.passed": True
        })
        q_ser["user_solved"] = bool(sub)

        # Count total attempts
        try:
            attempts = len(list(submissions_collection.find({"question_id": q_id})))
            q_ser["attempts_count"] = attempts
        except Exception:
            q_ser["attempts_count"] = 0

        questions.append(q_ser)

    return jsonify({
        "success": True,
        "count": len(questions),
        "questions": questions
    }), 200


@app.route("/api/student/questions/<question_id>", methods=["GET"])
@roles_allowed("student", "teacher")
def student_get_question(current_user, question_id):
    """
    Gets single question details for student.
    CRITICAL: Strictly excludes optimized_circuit.
    """
    doc = find_doc_by_id(questions_collection, question_id, {"status": "published"})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or not published"}), 404

    # Crucial security check: include_optimized=False
    q_ser = serialize_question(doc, include_optimized=False)

    # Check student solved status
    sub = submissions_collection.find_one({
        "student_id": current_user["id"],
        "question_id": str(doc["_id"]),
        "verification_result.passed": True
    })
    q_ser["user_solved"] = bool(sub)

    return jsonify({
        "success": True,
        "question": q_ser
    }), 200


@app.route("/api/student/questions/<question_id>/submit", methods=["POST"])
@roles_allowed("student")
def student_submit_solution(current_user, question_id):
    """
    Student submits their solution circuit.
    Evaluates equivalence against the original circuit, measures optimization metrics
    against both the original and the teacher's reference optimized circuit,
    awards XP for successful solves, and returns feedback.
    """
    doc = find_doc_by_id(questions_collection, question_id, {"status": "published"})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or not published"}), 404

    data = request.get_json() or {}
    submitted_circuit = data.get("submitted_circuit") or {}
    original_circuit = doc.get("original_circuit") or {}
    optimized_circuit = doc.get("optimized_circuit") or {}

    # Run deterministic equivalence and optimization evaluation vs original
    v_res = verify_circuit_pair(original_circuit, submitted_circuit)

    is_equiv = v_res["equivalent"]
    is_opt = v_res["optimized"]
    is_passed = (is_equiv and is_opt)

    # Compare student metrics against teacher's reference optimized circuit
    reference_metrics = calculate_circuit_metrics(
        optimized_circuit.get("nodes", []),
        optimized_circuit.get("connections", []),
    )
    student_metrics = v_res["optimized_metrics"]
    vs_reference = {
        "reference_gate_count": reference_metrics.get("gate_count", 0),
        "student_gate_count": student_metrics.get("gate_count", 0),
        "gate_difference": student_metrics.get("gate_count", 0) - reference_metrics.get("gate_count", 0),
        "reference_depth": reference_metrics.get("circuit_depth", 0),
        "student_depth": student_metrics.get("circuit_depth", 0),
        "depth_difference": student_metrics.get("circuit_depth", 0) - reference_metrics.get("circuit_depth", 0),
        "reference_connections": reference_metrics.get("connection_count", 0),
        "student_connections": student_metrics.get("connection_count", 0),
        "matches_or_beats_reference": (
            is_equiv
            and student_metrics.get("gate_count", 999) <= reference_metrics.get("gate_count", 0)
        ),
    }

    # XP: only award once per problem on first successful pass
    difficulty = (doc.get("difficulty") or "medium").lower()
    xp_gain = 0
    gamification = None
    already_passed = submissions_collection.find_one({
        "student_id": current_user["id"],
        "question_id": str(doc["_id"]),
        "verification_result.passed": True,
    })
    if is_passed and not already_passed:
        xp_gain = XP_BY_DIFFICULTY.get(difficulty, 100)
        if vs_reference["matches_or_beats_reference"]:
            xp_gain += XP_OPTIMIZATION_BONUS
        gamification = award_student_xp(current_user["id"], xp_gain, problem_newly_completed=True)
        xp_gain = gamification.get("xp_awarded", xp_gain)

    now = datetime.now(timezone.utc)
    submission_doc = {
        "student_id": current_user["id"],
        "student_name": current_user.get("name", "Student"),
        "student_email": current_user.get("email", ""),
        "question_id": str(doc["_id"]),
        "question_title": doc.get("title", ""),
        "submitted_circuit": submitted_circuit,
        "equivalence_result": {
            "equivalent": is_equiv,
            "message": "Logical equivalence confirmed." if is_equiv else v_res["message"],
            "failing_case": v_res.get("failing_case")
        },
        "optimization_metrics": {
            "original_metrics": v_res["original_metrics"],
            "student_metrics": student_metrics,
            "reference_metrics": reference_metrics,
            "vs_reference": vs_reference,
            "improvements": v_res["improvements"],
            "is_optimized": is_opt,
        },
        "verification_result": {
            "passed": is_passed,
            "functionally_correct": is_equiv,
            "feedback": v_res["message"],
            "ai_explanation": v_res["ai_explanation"],
        },
        "xp_awarded": xp_gain,
        "teacher_feedback": None,
        "submitted_at": now,
    }

    result = submissions_collection.insert_one(submission_doc)

    return jsonify({
        "success": True,
        "submission_id": str(result.inserted_id),
        "passed": is_passed,
        "equivalent": is_equiv,
        "is_optimized": is_opt,
        "original_metrics": v_res["original_metrics"],
        "student_metrics": student_metrics,
        "reference_metrics": reference_metrics,
        "vs_reference": vs_reference,
        "improvements": v_res["improvements"],
        "feedback": v_res["message"],
        "ai_explanation": v_res["ai_explanation"],
        "xp_awarded": xp_gain,
        "gamification": gamification,
        "submission": serialize_submission({**submission_doc, "_id": result.inserted_id})
    }), 200


@app.route("/api/student/questions/<question_id>/submissions", methods=["GET"])
@roles_allowed("student")
def student_get_my_question_submissions(current_user, question_id):
    cursor = submissions_collection.find({
        "student_id": current_user["id"],
        "question_id": question_id
    })
    try:
        cursor = cursor.sort("submitted_at", -1)
    except Exception:
        pass

    subs = [serialize_submission(s) for s in cursor]
    return jsonify({
        "success": True,
        "count": len(subs),
        "submissions": subs
    }), 200


@app.route("/api/student/submissions", methods=["GET"])
@app.route("/api/student/my-submissions", methods=["GET"])
@roles_allowed("student")
def student_get_all_my_submissions(current_user):
    cursor = submissions_collection.find({"student_id": current_user["id"]})
    try:
        cursor = cursor.sort("submitted_at", -1)
    except Exception:
        pass

    subs = [serialize_submission(s) for s in cursor]
    return jsonify({
        "success": True,
        "count": len(subs),
        "submissions": subs
    }), 200


@app.route("/api/student/questions/<question_id>/discussions", methods=["GET"])
@roles_allowed("student", "teacher")
def student_get_discussions(current_user, question_id):
    cursor = discussions_collection.find({"question_id": question_id})
    try:
        cursor = cursor.sort("created_at", 1)
    except Exception:
        pass

    discs = [serialize_discussion(d) for d in cursor]
    return jsonify({
        "success": True,
        "count": len(discs),
        "discussions": discs
    }), 200


@app.route("/api/student/questions/<question_id>/discussions", methods=["POST"])
@roles_allowed("student")
def student_post_discussion(current_user, question_id):
    doc = find_doc_by_id(questions_collection, question_id, {"status": "published"})
    if not doc:
        return jsonify({"success": False, "message": "Question not found or not published"}), 404

    data = request.get_json() or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"success": False, "message": "Message content cannot be empty"}), 400

    now = datetime.now(timezone.utc)
    disc_doc = {
        "question_id": str(doc["_id"]),
        "sender_id": current_user["id"],
        "sender_name": current_user.get("name", "Student"),
        "sender_role": "student",
        "message": message,
        "reply_to": None,
        "created_at": now,
    }

    result = discussions_collection.insert_one(disc_doc)
    return jsonify({
        "success": True,
        "message": "Question sent to teacher!",
        "discussion": serialize_discussion({**disc_doc, "_id": result.inserted_id})
    }), 201


@app.route("/api/student/stats", methods=["GET"])
@roles_allowed("student", "teacher")
def student_dashboard_stats(current_user):
    """Real gamification / progress stats derived from MongoDB submissions."""
    student_id = current_user["id"]
    subs = list(submissions_collection.find({"student_id": student_id}))
    try:
        subs.sort(
            key=lambda s: s.get("submitted_at") or datetime.min.replace(tzinfo=timezone.utc),
            reverse=True,
        )
    except Exception:
        pass

    passed_subs = [s for s in subs if s.get("verification_result", {}).get("passed")]
    solved_question_ids = list({s.get("question_id") for s in passed_subs})
    optimized_count = sum(
        1 for s in subs if s.get("optimization_metrics", {}).get("is_optimized")
    )
    feedback_items = [
        {
            "submission_id": str(s["_id"]),
            "question_id": s.get("question_id"),
            "question_title": s.get("question_title", ""),
            "feedback": s.get("teacher_feedback"),
            "submitted_at": (
                s.get("submitted_at").isoformat()
                if isinstance(s.get("submitted_at"), datetime)
                else s.get("submitted_at", "")
            ),
        }
        for s in subs
        if s.get("teacher_feedback") and s.get("teacher_feedback", {}).get("text")
    ]

    from bson import ObjectId as BsonObjectId

    user_doc = None
    if ObjectId.is_valid(student_id):
        user_doc = users_collection.find_one({"_id": BsonObjectId(student_id)})
    if not user_doc:
        user_doc = users_collection.find_one({"_id": student_id})

    xp = int((user_doc or {}).get("xp") or current_user.get("xp") or 0)
    level = compute_level(xp)
    problems_completed = len(solved_question_ids)
    achievements = (user_doc or {}).get("achievements") or derive_achievements(
        problems_completed, xp, len(subs), optimized_count
    )

    xp_into_level = xp % XP_PER_LEVEL
    progress_pct = round((xp_into_level / XP_PER_LEVEL) * 100, 1)

    try:
        published_count = questions_collection.count_documents({"status": "published"})
    except Exception:
        published_count = len(list(questions_collection.find({"status": "published"})))

    return jsonify({
        "success": True,
        "stats": {
            "xp": xp,
            "level": level,
            "xp_into_level": xp_into_level,
            "xp_per_level": XP_PER_LEVEL,
            "progress_pct": progress_pct,
            "problems_completed": problems_completed,
            "problems_available": published_count,
            "total_submissions": len(subs),
            "passed_submissions": len(passed_subs),
            "optimized_submissions": optimized_count,
            "pass_rate_pct": round((len(passed_subs) / len(subs)) * 100, 1) if subs else 0,
            "achievements": achievements,
            "recent_feedback": feedback_items[:10],
            "recent_submissions": [serialize_submission(s) for s in subs[:5]],
        }
    }), 200


@app.route("/api/teacher/submissions/<submission_id>/feedback", methods=["POST"])
@roles_allowed("teacher")
def teacher_provide_submission_feedback(current_user, submission_id):
    """Teacher reviews a student submission and stores feedback + optional score."""
    sub = find_doc_by_id(submissions_collection, submission_id)
    if not sub:
        return jsonify({"success": False, "message": "Submission not found"}), 404

    question = find_doc_by_id(
        questions_collection, sub.get("question_id"), {"teacher_id": current_user["id"]}
    )
    if not question:
        return jsonify({
            "success": False,
            "message": "Access denied: you do not own this problem"
        }), 403

    data = request.get_json() or {}
    status = (data.get("status") or "needs_improvement").strip().lower()
    if status not in ("correct", "needs_improvement", "excellent"):
        status = "needs_improvement"
    text = (data.get("text") or data.get("feedback") or "").strip()
    score = data.get("score")
    try:
        score = int(score) if score is not None and str(score) != "" else None
        if score is not None:
            score = max(0, min(100, score))
    except (TypeError, ValueError):
        score = None

    if not text:
        return jsonify({"success": False, "message": "Feedback text is required"}), 400

    feedback_doc = {
        "status": status,
        "score": score,
        "text": text,
        "teacher_id": current_user["id"],
        "teacher_name": current_user.get("name", "Teacher"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    submissions_collection.update_one(
        {"_id": sub["_id"]},
        {"$set": {"teacher_feedback": feedback_doc}}
    )
    updated = submissions_collection.find_one({"_id": sub["_id"]})

    return jsonify({
        "success": True,
        "message": "Feedback saved successfully!",
        "submission": serialize_submission(updated),
        "teacher_feedback": feedback_doc,
    }), 200


@app.route("/api/teacher/submissions", methods=["GET"])
@roles_allowed("teacher")
def teacher_list_all_submissions(current_user):
    """List submissions across all of this teacher's questions."""
    q_list = list(questions_collection.find({"teacher_id": current_user["id"]}))
    q_ids = [str(q["_id"]) for q in q_list]
    q_titles = {str(q["_id"]): q.get("title", "") for q in q_list}

    if not q_ids:
        return jsonify({"success": True, "count": 0, "submissions": []}), 200

    cursor = submissions_collection.find({"question_id": {"$in": q_ids}})
    try:
        cursor = cursor.sort("submitted_at", -1)
    except Exception:
        pass

    subs = []
    for s in cursor:
        ser = serialize_submission(s)
        if not ser.get("question_title"):
            ser["question_title"] = q_titles.get(ser["question_id"], "")
        subs.append(ser)

    return jsonify({
        "success": True,
        "count": len(subs),
        "submissions": subs
    }), 200


# --------------------------------------------------
# STUDENT LEARNING PROGRESS APIS
# --------------------------------------------------

ORDERED_LEARNING_TOPICS = [
    "distributive-law",
    "commutative-law",
    "associative-law",
    "identity-law",
    "null-law",
    "idempotent-law",
    "complement-law",
    "involution-law",
    "absorption-law",
    "demorgan-law",
    "consensus-theorem",
    "boolean-simplification",
    "logic-gates",
    "circuit-optimization",
    "kmap-basics"
]


def serialize_learning_progress(doc):
    return {
        "student_id": str(doc.get("student_id", "")),
        "completed_topics": doc.get("completed_topics", []),
        "topic_progress": doc.get("topic_progress", {}),
        "total_learning_xp": doc.get("total_learning_xp", 0),
        "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at", ""),
    }


@app.route("/api/student/learning-progress", methods=["GET"])
@token_required
def get_student_learning_progress(current_user):
    student_id = current_user["id"]
    doc = learning_progress_collection.find_one({"student_id": student_id})
    if not doc:
        now = datetime.now(timezone.utc)
        doc = {
            "student_id": student_id,
            "completed_topics": [],
            "topic_progress": {},
            "total_learning_xp": 0,
            "created_at": now,
            "updated_at": now,
        }
        res = learning_progress_collection.insert_one(doc)
        doc["_id"] = res.inserted_id

    return jsonify({
        "success": True,
        "progress": serialize_learning_progress(doc)
    }), 200


@app.route("/api/student/learning-progress/complete-level", methods=["POST"])
@token_required
def complete_learning_level(current_user):
    student_id = current_user["id"]
    data = request.get_json() or {}
    topic_id = (data.get("topic_id") or "").strip()
    try:
        level_number = int(data.get("level_number", 1))
        score = float(data.get("score", 0))
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Invalid level_number or score format"}), 400

    if topic_id not in ORDERED_LEARNING_TOPICS:
        return jsonify({"success": False, "message": f"Unknown learning topic: {topic_id}"}), 400

    if level_number < 1 or level_number > 4:
        return jsonify({"success": False, "message": "Level number must be between 1 and 4"}), 400

    # Passing rule: 80% or higher
    if score < 80.0:
        return jsonify({
            "success": False,
            "passed": False,
            "message": f"Score of {score:.0f}% does not meet the 80% required threshold to complete Level {level_number}. Keep trying!"
        }), 200

    doc = learning_progress_collection.find_one({"student_id": student_id})
    if not doc:
        now = datetime.now(timezone.utc)
        doc = {
            "student_id": student_id,
            "completed_topics": [],
            "topic_progress": {},
            "total_learning_xp": 0,
            "created_at": now,
            "updated_at": now,
        }
        res = learning_progress_collection.insert_one(doc)
        doc["_id"] = res.inserted_id

    completed_topics = list(doc.get("completed_topics") or [])
    topic_progress = dict(doc.get("topic_progress") or {})
    total_learning_xp = int(doc.get("total_learning_xp") or 0)

    # 1. Check Topic Unlocking Rule: Topic M unlocked if M==0 or Topic M-1 in completed_topics
    topic_index = ORDERED_LEARNING_TOPICS.index(topic_id)
    if topic_index > 0:
        prev_topic = ORDERED_LEARNING_TOPICS[topic_index - 1]
        if prev_topic not in completed_topics:
            return jsonify({
                "success": False,
                "message": f"Topic '{topic_id}' is locked until previous topic '{prev_topic}' is fully completed."
            }), 403

    # 2. Check Level Unlocking Rule: Level N unlocked if N==1 or Level N-1 completed
    tp = dict(topic_progress.get(topic_id) or {"completed_levels": [], "completed": False, "current_level": 1})
    completed_levels = list(tp.get("completed_levels") or [])

    if level_number > 1:
        if (level_number - 1) not in completed_levels:
            return jsonify({
                "success": False,
                "message": f"Level {level_number} is locked until Level {level_number - 1} is completed."
            }), 403

    # Award XP only once per level
    xp_gained = 0
    level_newly_completed = level_number not in completed_levels
    if level_newly_completed:
        completed_levels.append(level_number)
        completed_levels.sort()
        xp_gained += 50  # 50 XP per level

    tp["completed_levels"] = completed_levels
    tp["current_level"] = max(tp.get("current_level", 1), min(4, level_number + 1))

    # Check topic completion (all 4 levels passed)
    topic_newly_completed = False
    if len(completed_levels) >= 4:
        tp["completed"] = True
        if topic_id not in completed_topics:
            completed_topics.append(topic_id)
            topic_newly_completed = True
            xp_gained += 100  # 100 XP topic bonus

    topic_progress[topic_id] = tp
    total_learning_xp += xp_gained

    now = datetime.now(timezone.utc)
    learning_progress_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {
            "completed_topics": completed_topics,
            "topic_progress": topic_progress,
            "total_learning_xp": total_learning_xp,
            "updated_at": now,
        }}
    )

    # Sync XP to user main document if XP was gained
    if xp_gained > 0:
        award_student_xp(student_id, xp_gained, problem_newly_completed=False)

    updated_doc = learning_progress_collection.find_one({"_id": doc["_id"]})

    return jsonify({
        "success": True,
        "passed": True,
        "level_number": level_number,
        "level_newly_completed": level_newly_completed,
        "topic_completed": tp["completed"],
        "topic_newly_completed": topic_newly_completed,
        "xp_gained": xp_gained,
        "progress": serialize_learning_progress(updated_doc)
    }), 200


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=DEBUG,
        host="127.0.0.1",
        port=PORT
    )