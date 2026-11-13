"""
Comprehensive test suite for LogicPath Backend APIs and Logic Engine.
Tests:
- Auth: Register, Duplicate, Login, Bad Login, Me, Password Reset
- Logic: AND, OR, NOT, NAND, NOR, XOR, XNOR, Multi-level
- Truth Table: 1-input, 2-input, Multi-output (Half Adder)
- Cycle detection & Port limits
- Boolean Expression generation
- Boolean Simplification & Optimization & Metrics
- Circuit Persistence (CRUD) & Ownership verification
- Presets & Challenge verification
"""

import json
from datetime import datetime, timezone
from app import app
from database import users_collection, circuits_collection

def run_tests():
    print("========================================")
    print("STARTING LOGICPATH AUTOMATED TEST SUITE")
    print("========================================")
    
    client = app.test_client()
    passed = 0
    failed = 0

    def assert_true(condition, test_name):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {test_name}")
            passed += 1
        else:
            print(f"  [FAIL] {test_name}")
            failed += 1

    # 1. Health check & test route
    res = client.get("/")
    assert_true(res.status_code == 200 and b"LogicPath backend is running!" in res.data, "GET / Health Check")

    res = client.get("/api/test")
    assert_true(res.status_code == 200 and res.json.get("status") == "online", "GET /api/test Online Status")

    # 2. Authentication Tests
    test_email = f"tester_{int(datetime.now(timezone.utc).timestamp())}@logicpath.io"
    
    # 2a. Register
    reg_payload = {"name": "Test Engineer", "email": test_email, "password": "SecurePassword123!"}
    res = client.post("/api/auth/register", json=reg_payload)
    assert_true(res.status_code == 201 and "token" in res.json, "POST /api/auth/register New User")
    token = res.json.get("token")

    # 2b. Duplicate Register
    res = client.post("/api/auth/register", json=reg_payload)
    assert_true(res.status_code == 409, "POST /api/auth/register Duplicate Email Prevention")

    # 2c. Login
    login_payload = {"email": test_email, "password": "SecurePassword123!"}
    res = client.post("/api/auth/login", json=login_payload)
    assert_true(res.status_code == 200 and res.json.get("user", {}).get("email") == test_email, "POST /api/auth/login Valid Credentials")
    token = res.json.get("token")

    # 2d. Bad Login
    bad_login = {"email": test_email, "password": "WrongPassword999"}
    res = client.post("/api/auth/login", json=bad_login)
    assert_true(res.status_code == 401, "POST /api/auth/login Invalid Password Rejection")

    # 2e. Protected Profile
    auth_headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/auth/me", headers=auth_headers)
    assert_true(res.status_code == 200 and res.json.get("user", {}).get("email") == test_email, "GET /api/auth/me Authenticated Access")

    # 2f. Unauthenticated rejection
    res = client.get("/api/auth/me")
    assert_true(res.status_code == 401, "GET /api/auth/me Reject Missing Token")

    # 2g. Forgot Password & Reset
    res = client.post("/api/auth/forgot-password", json={"email": test_email})
    reset_token = res.json.get("reset_token")
    assert_true(res.status_code == 200 and bool(reset_token), "POST /api/auth/forgot-password Generate Token")

    res = client.post("/api/auth/reset-password", json={"token": reset_token, "password": "NewSecurePassword456!"})
    assert_true(res.status_code == 200, "POST /api/auth/reset-password Update Password")

    res = client.post("/api/auth/login", json={"email": test_email, "password": "NewSecurePassword456!"})
    assert_true(res.status_code == 200, "POST /api/auth/login with New Password")
    token = res.json.get("token")
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 3. Gate Simulation Tests (All 7 gate types + multi-level)
    # 3a. AND Gate
    and_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "b", "type": "INPUT", "label": "B", "state": 1},
        {"id": "g", "type": "AND", "label": "AND1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    and_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g", "toPort": "in2"},
        {"id": "c3", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": and_nodes, "connections": and_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 1, "Simulation: AND (1,1 -> 1)")

    res = client.post("/api/simulate", json={"nodes": and_nodes, "connections": and_conns, "input_values": {"a": 1, "b": 0}})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 0, "Simulation: AND (1,0 -> 0)")

    # 3b. XOR Gate
    xor_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "b", "type": "INPUT", "label": "B", "state": 0},
        {"id": "g", "type": "XOR", "label": "XOR1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    xor_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g", "toPort": "in2"},
        {"id": "c3", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": xor_nodes, "connections": xor_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 1, "Simulation: XOR (1,0 -> 1)")

    # 3c. NOT Gate
    not_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "g", "type": "NOT", "label": "NOT1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    not_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in"},
        {"id": "c2", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": not_nodes, "connections": not_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 0, "Simulation: NOT (1 -> 0)")

    # 3d. NAND Gate
    nand_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "b", "type": "INPUT", "label": "B", "state": 1},
        {"id": "g", "type": "NAND", "label": "NAND1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    nand_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g", "toPort": "in2"},
        {"id": "c3", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": nand_nodes, "connections": nand_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 0, "Simulation: NAND (1,1 -> 0)")

    # 3e. NOR Gate
    nor_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 0},
        {"id": "b", "type": "INPUT", "label": "B", "state": 0},
        {"id": "g", "type": "NOR", "label": "NOR1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    nor_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g", "toPort": "in2"},
        {"id": "c3", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": nor_nodes, "connections": nor_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 1, "Simulation: NOR (0,0 -> 1)")

    # 3f. XNOR Gate
    xnor_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "b", "type": "INPUT", "label": "B", "state": 1},
        {"id": "g", "type": "XNOR", "label": "XNOR1"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    xnor_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g", "toPort": "in2"},
        {"id": "c3", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": xnor_nodes, "connections": xnor_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["Y"] == 1, "Simulation: XNOR (1,1 -> 1)")

    # 3g. Multi-level Circuit: (A AND B) OR C -> Y
    ml_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 1},
        {"id": "b", "type": "INPUT", "label": "B", "state": 1},
        {"id": "c", "type": "INPUT", "label": "C", "state": 0},
        {"id": "g_and", "type": "AND", "label": "X"},
        {"id": "g_or", "type": "OR", "label": "Y"},
        {"id": "out", "type": "OUTPUT", "label": "OUT"}
    ]
    ml_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g_and", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "g_and", "toPort": "in2"},
        {"id": "c3", "fromNode": "g_and", "fromPort": "out", "toNode": "g_or", "toPort": "in1"},
        {"id": "c4", "fromNode": "c", "fromPort": "out", "toNode": "g_or", "toPort": "in2"},
        {"id": "c5", "fromNode": "g_or", "fromPort": "out", "toNode": "out", "toPort": "in"}
    ]
    res = client.post("/api/simulate", json={"nodes": ml_nodes, "connections": ml_conns})
    assert_true(res.status_code == 200 and res.json["output_values"]["OUT"] == 1, "Simulation: Multi-Level DAG (1,1,0 -> 1)")

    # 4. Truth Table Generation Tests
    # 4a. 1-input (NOT gate) -> 2^1 = 2 rows
    res = client.post("/api/truth-table", json={"nodes": not_nodes, "connections": not_conns})
    assert_true(res.status_code == 200 and len(res.json["rows"]) == 2, "Truth Table: 1-input (2^1 = 2 rows)")

    # 4b. 2-input (XOR gate) -> 2^2 = 4 rows
    res = client.post("/api/truth-table", json={"nodes": xor_nodes, "connections": xor_conns})
    assert_true(res.status_code == 200 and len(res.json["rows"]) == 4, "Truth Table: 2-input (2^2 = 4 rows)")

    # 4c. Multi-output Half Adder (SUM, CARRY)
    ha_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 0},
        {"id": "b", "type": "INPUT", "label": "B", "state": 0},
        {"id": "xor", "type": "XOR", "label": "XOR1"},
        {"id": "and", "type": "AND", "label": "AND1"},
        {"id": "sum", "type": "OUTPUT", "label": "SUM"},
        {"id": "carry", "type": "OUTPUT", "label": "CARRY"}
    ]
    ha_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "xor", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "xor", "toPort": "in2"},
        {"id": "c3", "fromNode": "xor", "fromPort": "out", "toNode": "sum", "toPort": "in"},
        {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "and", "toPort": "in1"},
        {"id": "c5", "fromNode": "b", "fromPort": "out", "toNode": "and", "toPort": "in2"},
        {"id": "c6", "fromNode": "and", "fromPort": "out", "toNode": "carry", "toPort": "in"}
    ]
    res = client.post("/api/truth-table", json={"nodes": ha_nodes, "connections": ha_conns})
    expected_ha = [
        {"A": 0, "B": 0, "SUM": 0, "CARRY": 0},
        {"A": 0, "B": 1, "SUM": 1, "CARRY": 0},
        {"A": 1, "B": 0, "SUM": 1, "CARRY": 0},
        {"A": 1, "B": 1, "SUM": 0, "CARRY": 1},
    ]
    assert_true(res.status_code == 200 and res.json["rows"] == expected_ha, "Truth Table: Half Adder Multi-Output Exact Match")

    # 5. Cycle Detection & Connection Validation
    # 5a. Cycle: g1 -> g2 -> g1
    cycle_nodes = [
        {"id": "g1", "type": "AND", "label": "G1"},
        {"id": "g2", "type": "OR", "label": "G2"}
    ]
    cycle_conns = [
        {"id": "c1", "fromNode": "g1", "fromPort": "out", "toNode": "g2", "toPort": "in1"},
        {"id": "c2", "fromNode": "g2", "fromPort": "out", "toNode": "g1", "toPort": "in1"}
    ]
    res = client.post("/api/validate", json={"nodes": cycle_nodes, "connections": cycle_conns})
    has_cycle_err = any("Combinational loop" in err for err in res.json.get("errors", []))
    assert_true(res.status_code == 422 and has_cycle_err, "Validation: Cycle Detection")

    # 5b. Missing inputs detection
    missing_nodes = [
        {"id": "a", "type": "INPUT", "label": "A"},
        {"id": "g", "type": "AND", "label": "AND_GATE"},
        {"id": "y", "type": "OUTPUT", "label": "Y"}
    ]
    missing_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "g", "toPort": "in1"},
        {"id": "c2", "fromNode": "g", "fromPort": "out", "toNode": "y", "toPort": "in"}
    ]
    res = client.post("/api/validate", json={"nodes": missing_nodes, "connections": missing_conns})
    assert_true(res.status_code == 422 and "requires at least 2 input(s)" in res.json.get("errors", [""])[0], "Validation: Missing Input Detection")

    # 6. Boolean Expression Generation
    res = client.post("/api/boolean-expression", json={"nodes": ml_nodes, "connections": ml_conns})
    assert_true(res.status_code == 200 and "OUT" in res.json.get("expressions", {}), "Boolean Expression Generation")

    # 7. Optimization & Metrics
    # A redundant circuit: A OR (A AND B) -> simplifies to A!
    red_nodes = [
        {"id": "a", "type": "INPUT", "label": "A", "state": 0},
        {"id": "b", "type": "INPUT", "label": "B", "state": 0},
        {"id": "and1", "type": "AND", "label": "AND_AB"},
        {"id": "or1", "type": "OR", "label": "OR_FINAL"},
        {"id": "out", "type": "OUTPUT", "label": "Y"}
    ]
    red_conns = [
        {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
        {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
        {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
        {"id": "c4", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
        {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "out", "toPort": "in"}
    ]
    res = client.post("/api/optimize", json={"nodes": red_nodes, "connections": red_conns})
    assert_true(res.status_code == 200 and res.json.get("can_optimize") == True, "Optimization: Absorption Law Simplification")
    assert_true(res.json["optimized_metrics"]["gate_count"] < res.json["original_metrics"]["gate_count"], "Optimization: Reduced Gate Count Verified")

    # 8. Circuit Persistence CRUD
    circ_payload = {
        "name": "Full Adder Circuit Model",
        "description": "3-input binary adder",
        "nodes": ha_nodes,
        "connections": ha_conns,
        "boolean_expression": "SUM = A ^ B, CARRY = A & B"
    }

    # 8a. Create
    res = client.post("/api/circuits", json=circ_payload, headers=auth_headers)
    assert_true(
        res.status_code == 201 
        and "circuit_id" in res.json 
        and "inputs" in res.json["circuit"] 
        and "outputs" in res.json["circuit"], 
        "CRUD: Create Circuit (POST /api/circuits) with inputs/outputs"
    )
    created_id = res.json.get("circuit_id")

    # 8b. List
    res = client.get("/api/circuits", headers=auth_headers)
    assert_true(res.status_code == 200 and res.json["count"] >= 1, "CRUD: List User Circuits (GET /api/circuits)")

    # 8c. Read by ID
    res = client.get(f"/api/circuits/{created_id}", headers=auth_headers)
    assert_true(
        res.status_code == 200 
        and res.json["circuit"]["name"] == "Full Adder Circuit Model"
        and len(res.json["circuit"]["inputs"]) == 2
        and len(res.json["circuit"]["outputs"]) == 2, 
        "CRUD: Read Circuit by ID with verified inputs/outputs schema"
    )

    # 8d. Update
    update_payload = {"name": "Updated 1-Bit Adder", "description": "Modified description"}
    res = client.put(f"/api/circuits/{created_id}", json=update_payload, headers=auth_headers)
    assert_true(res.status_code == 200 and res.json["circuit"]["name"] == "Updated 1-Bit Adder", "CRUD: Update Circuit (PUT /api/circuits/<id>)")

    # 8e. Ownership verification: Different user cannot read or delete this circuit!
    hacker_email = f"hacker_{int(datetime.now(timezone.utc).timestamp())}@evil.com"
    diff_payload = {"name": "Hacker", "email": hacker_email, "password": "Password123!"}
    res_diff = client.post("/api/auth/register", json=diff_payload)
    diff_token = res_diff.json.get("token")
    diff_headers = {"Authorization": f"Bearer {diff_token}"}

    res = client.get(f"/api/circuits/{created_id}", headers=diff_headers)
    assert_true(res.status_code == 404, "Security: Access Denied for Foreign User Circuit Read")

    res = client.delete(f"/api/circuits/{created_id}", headers=diff_headers)
    assert_true(res.status_code == 404, "Security: Access Denied for Foreign User Circuit Delete")

    # 8f. Delete as owner
    res = client.delete(f"/api/circuits/{created_id}", headers=auth_headers)
    assert_true(res.status_code == 200, "CRUD: Delete Circuit (DELETE /api/circuits/<id>)")

    # 8g. Simulation History
    res = client.get("/api/simulations/history", headers=auth_headers)
    assert_true(res.status_code == 200 and "history" in res.json, "GET /api/simulations/history")

    # 9. Examples & Presets API
    res = client.get("/api/examples")
    assert_true(res.status_code == 200 and res.json["count"] >= 7, "GET /api/examples Preset Library")

    res = client.get("/api/gates")
    assert_true(res.status_code == 200 and len(res.json["gates"]) == 9, "GET /api/gates 9 Logic Gate Compendium")

    # 10. Challenges API & Deterministic Verification
    res = client.get("/api/challenges")
    assert_true(res.status_code == 200 and len(res.json["challenges"]) >= 3, "GET /api/challenges")

    # Test challenge verification with our Half Adder circuit against 'chal_half_adder'
    verify_payload = {
        "challenge_id": "chal_half_adder",
        "nodes": ha_nodes,
        "connections": ha_conns
    }
    res = client.post("/api/challenges/verify", json=verify_payload)
    assert_true(res.status_code == 200 and res.json.get("passed") == True, "Challenges: Deterministic Truth Table Verification (Half Adder)")

    # 11. Pre-seeded Demo Engineer Authentication
    demo_login_res = client.post("/api/auth/login", json={"email": "demo@logicpath.io", "password": "DemoPassword123!"})
    assert_true(demo_login_res.status_code == 200 and "token" in demo_login_res.json, "Auth: Demo Engineer Pre-seeded Authentication")

    print("========================================")
    print(f"TEST RUN COMPLETED: {passed} PASSED, {failed} FAILED.")
    print("========================================")
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
