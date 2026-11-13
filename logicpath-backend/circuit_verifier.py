"""
Circuit Verifier Module for LogicPath.
Implements:
1. Deterministic 2^N Truth Table Equivalence Engine using topological simulation.
2. Measurable Circuit Metrics & Optimization Engine (Gates, Depth, Connections, Gate Cost).
3. AI-Assisted Pedagogical Explanation Layer (with robust fallback when AI API is unconfigured).
"""

import os
import json
import itertools
import urllib.request
import urllib.error
from collections import defaultdict
from logic_engine import (
    validate_circuit,
    simulate_circuit,
    topological_sort,
    generate_boolean_expression,
    calculate_metrics
)

# Estimated relative silicon/transistor gate costs
GATE_COST_TABLE = {
    "NOT": 1,
    "AND": 2,
    "OR": 2,
    "NAND": 2,
    "NOR": 2,
    "XOR": 3,
    "XNOR": 3,
}

SUPPORTED_LOGIC_GATES = {"AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"}


def calculate_circuit_metrics(nodes, connections):
    """
    Computes rigorous circuit graph metrics:
    - gate_count (logic gates, excluding INPUT and OUTPUT)
    - non_io_gate_count
    - circuit_depth (propagation levels from inputs to outputs)
    - connection_count (number of wires)
    - estimated_gate_cost (weighted by gate complexity)
    - input_count
    - output_count
    """
    base_metrics = calculate_metrics(nodes, connections)

    gates = [n for n in nodes if n.get("type", "").upper() in SUPPORTED_LOGIC_GATES]
    inputs = [n for n in nodes if n.get("type", "").upper() == "INPUT"]
    outputs = [n for n in nodes if n.get("type", "").upper() == "OUTPUT"]

    total_cost = 0
    gate_distribution = defaultdict(int)
    for g in gates:
        gtype = g.get("type", "").upper()
        gate_distribution[gtype] += 1
        total_cost += GATE_COST_TABLE.get(gtype, 2)

    return {
        "gate_count": len(gates),
        "non_io_gate_count": len(gates),
        "circuit_depth": base_metrics.get("circuit_depth", 0),
        "connection_count": len(connections),
        "estimated_gate_cost": total_cost,
        "input_count": len(inputs),
        "output_count": len(outputs),
        "gate_distribution": dict(gate_distribution),
    }


def verify_logical_equivalence(orig_nodes, orig_conns, opt_nodes, opt_conns):
    """
    Performs deterministic 2^N truth-table evaluation comparing original and candidate circuits.
    Returns:
        is_equivalent (bool),
        failing_info (dict or None),
        error_message (str or None)
    """
    # 1. Validate both circuits
    orig_valid, orig_errors, _ = validate_circuit(orig_nodes, orig_conns)
    if not orig_valid:
        return False, None, f"Original circuit is invalid: {'; '.join(orig_errors)}"

    opt_valid, opt_errors, _ = validate_circuit(opt_nodes, opt_conns)
    if not opt_valid:
        return False, None, f"Optimized circuit is invalid: {'; '.join(opt_errors)}"

    # 2. Extract input and output nodes
    orig_inputs = [n for n in orig_nodes if n.get("type", "").upper() == "INPUT"]
    orig_outputs = [n for n in orig_nodes if n.get("type", "").upper() == "OUTPUT"]
    opt_inputs = [n for n in opt_nodes if n.get("type", "").upper() == "INPUT"]
    opt_outputs = [n for n in opt_nodes if n.get("type", "").upper() == "OUTPUT"]

    if not orig_inputs:
        return False, None, "Original circuit requires at least one INPUT component."
    if not orig_outputs:
        return False, None, "Original circuit requires at least one OUTPUT component."
    if not opt_inputs:
        return False, None, "Optimized circuit requires at least one INPUT component."
    if not opt_outputs:
        return False, None, "Optimized circuit requires at least one OUTPUT component."

    # Identify input variable labels (normalized uppercase)
    orig_in_labels = [n.get("label", "").strip() or n["id"] for n in orig_inputs]
    opt_in_labels = [n.get("label", "").strip() or n["id"] for n in opt_inputs]

    # Distinct variable names
    all_var_names = sorted(list(set(orig_in_labels) | set(opt_in_labels)))
    num_vars = len(all_var_names)

    if num_vars > 8:
        return False, None, f"Circuits have {num_vars} inputs. Equivalence check is capped at 8 inputs (256 combinations)."

    # Output node mapping
    orig_out_labels = [n.get("label", "").strip() or n["id"] for n in orig_outputs]
    opt_out_labels = [n.get("label", "").strip() or n["id"] for n in opt_outputs]

    # Map input nodes by label/id for fast injection
    def build_input_map(nodes_list, in_labels):
        in_map = {}
        for n in nodes_list:
            if n.get("type", "").upper() == "INPUT":
                lbl = n.get("label", "").strip() or n["id"]
                in_map[lbl] = n["id"]
        return in_map

    orig_in_map = build_input_map(orig_nodes, orig_in_labels)
    opt_in_map = build_input_map(opt_nodes, opt_in_labels)

    # 3. Simulate all 2^N input combinations
    total_combinations = 1 << num_vars

    for combo in itertools.product([0, 1], repeat=num_vars):
        combo_dict = {all_var_names[i]: combo[i] for i in range(num_vars)}

        # Build simulation input values mapping for original circuit
        sim_in_orig = {}
        for var, val in combo_dict.items():
            if var in orig_in_map:
                sim_in_orig[orig_in_map[var]] = val
            sim_in_orig[var] = val

        # Build simulation input values mapping for optimized circuit
        sim_in_opt = {}
        for var, val in combo_dict.items():
            if var in opt_in_map:
                sim_in_opt[opt_in_map[var]] = val
            sim_in_opt[var] = val

        res_orig = simulate_circuit(orig_nodes, orig_conns, sim_in_orig)
        res_opt = simulate_circuit(opt_nodes, opt_conns, sim_in_opt)

        if not res_orig["success"]:
            return False, None, f"Original circuit simulation failed: {'; '.join(res_orig['errors'])}"
        if not res_opt["success"]:
            return False, None, f"Optimized circuit simulation failed: {'; '.join(res_opt['errors'])}"

        # Compare outputs for this combination
        # If both circuits have identical output labels, match by label.
        # Otherwise, if single output, compare the single output value.
        for out_node in orig_outputs:
            out_id = out_node["id"]
            out_lbl = out_node.get("label", "").strip() or out_id
            orig_val = res_orig["output_values"].get(out_lbl, res_orig["node_values"].get(out_id, 0))

            # Find matching output in candidate
            opt_val = None
            if out_lbl in res_opt["output_values"]:
                opt_val = res_opt["output_values"][out_lbl]
            elif len(opt_outputs) == 1:
                single_opt_node = opt_outputs[0]
                opt_val = res_opt["output_values"].get(
                    single_opt_node.get("label", "").strip() or single_opt_node["id"],
                    res_opt["node_values"].get(single_opt_node["id"], 0)
                )
            else:
                return False, None, f"Optimized circuit is missing corresponding output '{out_lbl}'."

            if orig_val != opt_val:
                combo_str = "".join(str(combo_dict[v]) for v in all_var_names)
                state_desc = ", ".join(f"{v}={combo_dict[v]}" for v in all_var_names)
                return False, {
                    "input_combination": combo_str,
                    "input_values": combo_dict,
                    "output_label": out_lbl,
                    "expected_output": orig_val,
                    "actual_output": opt_val,
                    "state_description": state_desc,
                }, f"Output mismatch for input combination {combo_str} ({state_desc}). Expected {out_lbl}={orig_val}, but optimized circuit produced {out_lbl}={opt_val}."

    return True, None, None


def evaluate_circuit_improvements(orig_metrics, opt_metrics):
    """
    Evaluates whether the candidate circuit genuinely improves measurable metrics.
    """
    gate_red = orig_metrics["gate_count"] - opt_metrics["gate_count"]
    depth_red = orig_metrics["circuit_depth"] - opt_metrics["circuit_depth"]
    conn_red = orig_metrics["connection_count"] - opt_metrics["connection_count"]
    cost_red = orig_metrics["estimated_gate_cost"] - opt_metrics["estimated_gate_cost"]

    orig_gates = orig_metrics["gate_count"]
    orig_depth = orig_metrics["circuit_depth"]

    gate_red_pct = round((gate_red / orig_gates) * 100, 1) if orig_gates > 0 else 0
    depth_red_pct = round((depth_red / orig_depth) * 100, 1) if orig_depth > 0 else 0

    improvements = {
        "gate_reduction": gate_red,
        "gate_reduction_pct": gate_red_pct,
        "depth_reduction": depth_red,
        "depth_reduction_pct": depth_red_pct,
        "connection_reduction": conn_red,
        "cost_reduction": cost_red,
    }

    # Optimization rules:
    # 1. Gate count reduced OR
    # 2. Circuit depth reduced (with no increase in gates) OR
    # 3. Silicon gate cost reduced OR
    # 4. Connection count reduced with no worse gate count
    is_improved = False
    reasons = []

    if gate_red > 0:
        is_improved = True
        reasons.append(f"reduces total gates from {orig_gates} to {opt_metrics['gate_count']} ({gate_red_pct}% reduction)")

    if depth_red > 0 and gate_red >= 0:
        is_improved = True
        reasons.append(f"decreases propagation delay / depth from {orig_depth} to {opt_metrics['circuit_depth']} ({depth_red_pct}% reduction)")

    if cost_red > 0 and gate_red >= 0:
        is_improved = True
        reasons.append(f"lowers transistor gate cost from {orig_metrics['estimated_gate_cost']} to {opt_metrics['estimated_gate_cost']}")

    if conn_red > 0 and gate_red >= 0 and depth_red >= 0:
        is_improved = True
        reasons.append(f"eliminates {conn_red} unnecessary wiring connections")

    if not is_improved:
        if gate_red == 0 and depth_red == 0 and conn_red == 0 and cost_red == 0:
            msg = "Optimized circuit is logically equivalent but identical in all metrics. No simplification or metric reduction was achieved."
        elif gate_red < 0 and depth_red <= 0:
            msg = f"Optimized circuit introduces {abs(gate_red)} additional gate(s) without reducing circuit depth."
        else:
            msg = "Optimized circuit does not satisfy optimization criteria (gate count, depth, or cost did not improve)."
    else:
        msg = f"The optimized circuit is logically equivalent and improves circuit design: {'; '.join(reasons)}."

    return is_improved, improvements, msg


def generate_ai_explanation(orig_nodes, orig_conns, opt_nodes, opt_conns, orig_metrics, opt_metrics, improvements, is_equiv, is_opt, fail_msg=None):
    """
    Produces pedagogical AI analysis.
    Uses configured AI provider (Gemini / OpenAI / Claude) via environment variables,
    or falls back seamlessly to deterministic rule-based analysis.
    """
    provider = os.getenv("AI_PROVIDER", "").strip().lower()
    api_key = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    # Generate Boolean expressions for context
    orig_expr = "N/A"
    opt_expr = "N/A"
    try:
        e1 = generate_boolean_expression(orig_nodes, orig_conns)
        if e1.get("success") and e1.get("expressions"):
            orig_expr = ", ".join(f"{k} = {v.get('standard', '')}" for k, v in e1["expressions"].items())
        e2 = generate_boolean_expression(opt_nodes, opt_conns)
        if e2.get("success") and e2.get("expressions"):
            opt_expr = ", ".join(f"{k} = {v.get('standard', '')}" for k, v in e2["expressions"].items())
    except Exception:
        pass

    # Attempt external LLM if configured
    if provider == "gemini" and api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            prompt = (
                f"You are a digital logic verification expert. Provide a concise, 2-3 paragraph verification report.\n"
                f"Original Circuit Expression: {orig_expr}\n"
                f"Optimized Circuit Expression: {opt_expr}\n"
                f"Equivalence Status: {'PASSED' if is_equiv else 'FAILED'}\n"
                f"Optimization Status: {'PASSED' if is_opt else 'FAILED'}\n"
                f"Original Metrics: {json.dumps(orig_metrics)}\n"
                f"Optimized Metrics: {json.dumps(opt_metrics)}\n"
                f"Improvements: {json.dumps(improvements)}\n"
                f"Failure Details (if any): {fail_msg or 'None'}\n"
                f"Explain why this circuit is or is not optimal, what Boolean laws apply, and what advantages it provides."
            )
            req_body = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
            req = urllib.request.Request(url, data=req_body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                resp_json = json.loads(resp.read().decode("utf-8"))
                text = resp_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if text:
                    return text.strip()
        except Exception:
            # Fall back to deterministic explanation without interrupting workflow
            pass

    # Deterministic rule-based analytical explanation (Pedagogical & High Quality)
    if not is_equiv:
        return (
            f"❌ Equivalence Verification Failure\n\n"
            f"The candidate circuit does not compute the expected Boolean function. "
            f"Deterministic evaluation across all 2^N input combinations identified a discrepancy:\n"
            f"• {fail_msg}\n\n"
            f"Expected logic: {orig_expr}\n"
            f"Observed candidate logic: {opt_expr}\n"
            f"Review the gate connections and logic inversions to ensure functional equivalence."
        )

    if not is_opt:
        return (
            f"⚠️ Logical Equivalence Confirmed, Optimization Target Not Met\n\n"
            f"The candidate circuit satisfies 100% truth-table equivalence with the original circuit across all 2^N states.\n"
            f"However, circuit metrics show no measurable efficiency gains:\n"
            f"• Gate Count: {orig_metrics['gate_count']} (original) vs {opt_metrics['gate_count']} (candidate)\n"
            f"• Logic Depth: {orig_metrics['circuit_depth']} (original) vs {opt_metrics['circuit_depth']} (candidate)\n"
            f"• Wires / Connections: {orig_metrics['connection_count']} vs {opt_metrics['connection_count']}\n\n"
            f"To qualify as an optimized solution, apply Boolean algebra reduction (such as De Morgan's laws, absorption, or consensus) "
            f"to reduce gate count or propagation levels."
        )

    # Both equivalent and optimized
    gate_saving_str = f"{improvements['gate_reduction']} gate(s) saved ({improvements['gate_reduction_pct']}%)" if improvements['gate_reduction'] > 0 else "Gate count maintained"
    depth_saving_str = f"propagation depth reduced from {orig_metrics['circuit_depth']} to {opt_metrics['circuit_depth']}" if improvements['depth_reduction'] > 0 else "depth maintained"
    
    return (
        f"✓ Circuit Verification & Optimization Certified\n\n"
        f"1. Functional Equivalence: Confirmed across all 2^N truth-table input combinations. The circuit faithfully computes the target Boolean function without truth-table drift.\n"
        f"2. Optimization Quality: {gate_saving_str}, and {depth_saving_str}.\n"
        f"3. Silicon Footprint: Reduced gate complexity from {orig_metrics['estimated_gate_cost']} to {opt_metrics['estimated_gate_cost']} estimated unit cost.\n\n"
        f"Boolean Function: {opt_expr or orig_expr}"
    )


def verify_circuit_pair(original_circuit, candidate_circuit):
    """
    Main entry point for verifying an original circuit vs a candidate (teacher or student) circuit.
    Returns:
    {
        "equivalent": bool,
        "optimized": bool,
        "verification_status": "PASSED" | "FAILED",
        "original_metrics": {...},
        "optimized_metrics": {...},
        "improvements": {...},
        "ai_explanation": str,
        "message": str,
        "errors": list[str]
    }
    """
    orig_nodes = original_circuit.get("nodes", [])
    orig_conns = original_circuit.get("connections", [])
    cand_nodes = candidate_circuit.get("nodes", [])
    cand_conns = candidate_circuit.get("connections", [])

    errors = []

    # 1. Equivalence check
    is_equiv, fail_info, fail_msg = verify_logical_equivalence(orig_nodes, orig_conns, cand_nodes, cand_conns)
    if not is_equiv:
        errors.append(fail_msg or "Circuits are not logically equivalent.")

    # 2. Metrics calculation
    orig_metrics = calculate_circuit_metrics(orig_nodes, orig_conns)
    cand_metrics = calculate_circuit_metrics(cand_nodes, cand_conns)

    # 3. Optimization check
    is_opt, improvements, opt_msg = evaluate_circuit_improvements(orig_metrics, cand_metrics)
    if not is_opt and is_equiv:
        errors.append(opt_msg)

    # 4. Verification status
    verification_status = "PASSED" if (is_equiv and is_opt) else "FAILED"

    # Overall message
    if verification_status == "PASSED":
        main_message = f"Verification PASSED: {opt_msg}"
    elif not is_equiv:
        main_message = f"Verification FAILED: {fail_msg}"
    else:
        main_message = f"Verification FAILED: {opt_msg}"

    # 5. AI Explanation
    ai_explanation = generate_ai_explanation(
        orig_nodes, orig_conns,
        cand_nodes, cand_conns,
        orig_metrics, cand_metrics,
        improvements,
        is_equiv, is_opt,
        fail_msg
    )

    return {
        "equivalent": is_equiv,
        "optimized": is_opt,
        "verification_status": verification_status,
        "original_metrics": orig_metrics,
        "optimized_metrics": cand_metrics,
        "improvements": improvements,
        "failing_case": fail_info,
        "ai_explanation": ai_explanation,
        "message": main_message,
        "errors": errors,
    }
