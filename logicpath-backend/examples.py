"""
Built-in Example Circuits and Challenges for LogicPath.
"""

EXAMPLE_CIRCUITS = [
    {
        "id": "ex_and",
        "name": "AND Gate Demonstration",
        "description": "Basic 2-input AND logic. Output is HIGH (1) only when all inputs are HIGH.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 100, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 1, "x": 100, "y": 240},
            {"id": "gate_and", "type": "AND", "label": "AND1", "x": 340, "y": 190},
            {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 580, "y": 190}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_and", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_and", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_and", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
        ]
    },
    {
        "id": "ex_or",
        "name": "OR Gate Demonstration",
        "description": "Basic 2-input OR logic. Output is HIGH (1) if at least one input is HIGH.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 100, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 0, "x": 100, "y": 240},
            {"id": "gate_or", "type": "OR", "label": "OR1", "x": 340, "y": 190},
            {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 580, "y": 190}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_or", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_or", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_or", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
        ]
    },
    {
        "id": "ex_xor",
        "name": "XOR Gate Demonstration",
        "description": "Exclusive OR. Output is HIGH (1) when inputs are different.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 100, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 0, "x": 100, "y": 240},
            {"id": "gate_xor", "type": "XOR", "label": "XOR1", "x": 340, "y": 190},
            {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 580, "y": 190}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_xor", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_xor", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_xor", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
        ]
    },
    {
        "id": "ex_nand",
        "name": "NAND Gate Demonstration",
        "description": "Universal Gate: NOT(AND). Output is 0 only when both inputs are 1.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 100, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 1, "x": 100, "y": 240},
            {"id": "gate_nand", "type": "NAND", "label": "NAND1", "x": 340, "y": 190},
            {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 580, "y": 190}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_nand", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_nand", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_nand", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
        ]
    },
    {
        "id": "ex_nor",
        "name": "NOR Gate Demonstration",
        "description": "Universal Gate: NOT(OR). Output is 1 only when both inputs are 0.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 0, "x": 100, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 0, "x": 100, "y": 240},
            {"id": "gate_nor", "type": "NOR", "label": "NOR1", "x": 340, "y": 190},
            {"id": "out_y", "type": "OUTPUT", "label": "Y", "x": 580, "y": 190}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_nor", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_nor", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_nor", "fromPort": "out", "toNode": "out_y", "toPort": "in"}
        ]
    },
    {
        "id": "ex_half_adder",
        "name": "Half Adder Circuit",
        "description": "Calculates the sum of two single-bit binary inputs: SUM = A XOR B, CARRY = A AND B.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 80, "y": 140},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 1, "x": 80, "y": 280},
            {"id": "g_xor", "type": "XOR", "label": "XOR1", "x": 320, "y": 140},
            {"id": "g_and", "type": "AND", "label": "AND1", "x": 320, "y": 280},
            {"id": "out_sum", "type": "OUTPUT", "label": "SUM", "x": 560, "y": 140},
            {"id": "out_carry", "type": "OUTPUT", "label": "CARRY", "x": 560, "y": 280}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "g_xor", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "g_xor", "toPort": "in2"},
            {"id": "c3", "fromNode": "g_xor", "fromPort": "out", "toNode": "out_sum", "toPort": "in"},
            {"id": "c4", "fromNode": "in_a", "fromPort": "out", "toNode": "g_and", "toPort": "in1"},
            {"id": "c5", "fromNode": "in_b", "fromPort": "out", "toNode": "g_and", "toPort": "in2"},
            {"id": "c6", "fromNode": "g_and", "fromPort": "out", "toNode": "out_carry", "toPort": "in"}
        ]
    },
    {
        "id": "ex_full_adder",
        "name": "Full Adder Circuit",
        "description": "Calculates SUM and CARRY for three inputs (A, B, Cin). SUM = A XOR B XOR Cin; CARRY = (A AND B) OR (Cin AND (A XOR B)).",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 60, "y": 100},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 0, "x": 60, "y": 200},
            {"id": "in_cin", "type": "INPUT", "label": "Cin", "state": 1, "x": 60, "y": 320},
            {"id": "xor1", "type": "XOR", "label": "XOR_1", "x": 240, "y": 130},
            {"id": "xor2", "type": "XOR", "label": "XOR_2", "x": 440, "y": 150},
            {"id": "and1", "type": "AND", "label": "AND_1", "x": 240, "y": 260},
            {"id": "and2", "type": "AND", "label": "AND_2", "x": 440, "y": 270},
            {"id": "or1", "type": "OR", "label": "OR_CARRY", "x": 620, "y": 280},
            {"id": "out_sum", "type": "OUTPUT", "label": "SUM", "x": 660, "y": 150},
            {"id": "out_cout", "type": "OUTPUT", "label": "Cout", "x": 780, "y": 280}
        ],
        "connections": [
            {"id": "fa_1", "fromNode": "in_a", "fromPort": "out", "toNode": "xor1", "toPort": "in1"},
            {"id": "fa_2", "fromNode": "in_b", "fromPort": "out", "toNode": "xor1", "toPort": "in2"},
            {"id": "fa_3", "fromNode": "xor1", "fromPort": "out", "toNode": "xor2", "toPort": "in1"},
            {"id": "fa_4", "fromNode": "in_cin", "fromPort": "out", "toNode": "xor2", "toPort": "in2"},
            {"id": "fa_5", "fromNode": "xor2", "fromPort": "out", "toNode": "out_sum", "toPort": "in"},
            {"id": "fa_6", "fromNode": "in_a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
            {"id": "fa_7", "fromNode": "in_b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
            {"id": "fa_8", "fromNode": "xor1", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
            {"id": "fa_9", "fromNode": "in_cin", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
            {"id": "fa_10", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
            {"id": "fa_11", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
            {"id": "fa_12", "fromNode": "or1", "fromPort": "out", "toNode": "out_cout", "toPort": "in"}
        ]
    },
    {
        "id": "ex_multilevel",
        "name": "Multi-Level Logic Circuit",
        "description": "Multi-stage logic evaluating (A AND B) OR C.",
        "nodes": [
            {"id": "in_a", "type": "INPUT", "label": "A", "state": 1, "x": 100, "y": 120},
            {"id": "in_b", "type": "INPUT", "label": "B", "state": 1, "x": 100, "y": 220},
            {"id": "in_c", "type": "INPUT", "label": "C", "state": 0, "x": 100, "y": 320},
            {"id": "gate_and", "type": "AND", "label": "X", "x": 320, "y": 160},
            {"id": "gate_or", "type": "OR", "label": "Y", "x": 520, "y": 240},
            {"id": "out_out", "type": "OUTPUT", "label": "OUT", "x": 720, "y": 240}
        ],
        "connections": [
            {"id": "c1", "fromNode": "in_a", "fromPort": "out", "toNode": "gate_and", "toPort": "in1"},
            {"id": "c2", "fromNode": "in_b", "fromPort": "out", "toNode": "gate_and", "toPort": "in2"},
            {"id": "c3", "fromNode": "gate_and", "fromPort": "out", "toNode": "gate_or", "toPort": "in1"},
            {"id": "c4", "fromNode": "in_c", "fromPort": "out", "toNode": "gate_or", "toPort": "in2"},
            {"id": "c5", "fromNode": "gate_or", "fromPort": "out", "toNode": "out_out", "toPort": "in"}
        ]
    }
]

EDUCATIONAL_GATES = [
    {
        "type": "INPUT",
        "name": "Digital Input Source",
        "inputs": 0,
        "symbol": "IN",
        "expression": "A ∈ {0, 1}",
        "description": "Provides a controllable binary logic state (0 or 1) as a source signal for the circuit.",
        "behavior": "Toggleable constant signal source."
    },
    {
        "type": "OUTPUT",
        "name": "Digital Output Probe",
        "inputs": 1,
        "symbol": "OUT",
        "expression": "Y = In",
        "description": "Monitors and displays the final evaluated logic state computed by upstream gates.",
        "behavior": "Displays 0 (LOW) or 1 (HIGH)."
    },
    {
        "type": "AND",
        "name": "AND Gate",
        "inputs": 2,
        "symbol": "·",
        "expression": "Y = A · B",
        "description": "Yields HIGH (1) if and only if all inputs are HIGH (1). Otherwise, the output is LOW (0).",
        "behavior": "Conjunction. 1 only when all inputs are 1.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 0},
            {"A": 0, "B": 1, "OUT": 0},
            {"A": 1, "B": 0, "OUT": 0},
            {"A": 1, "B": 1, "OUT": 1}
        ]
    },
    {
        "type": "OR",
        "name": "OR Gate",
        "inputs": 2,
        "symbol": "+",
        "expression": "Y = A + B",
        "description": "Yields HIGH (1) if at least one input is HIGH (1). Output is 0 only when all inputs are 0.",
        "behavior": "Disjunction. 1 if any input is 1.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 0},
            {"A": 0, "B": 1, "OUT": 1},
            {"A": 1, "B": 0, "OUT": 1},
            {"A": 1, "B": 1, "OUT": 1}
        ]
    },
    {
        "type": "NOT",
        "name": "NOT Gate (Inverter)",
        "inputs": 1,
        "symbol": "¬ / '",
        "expression": "Y = A'",
        "description": "Inverts the incoming signal: LOW (0) becomes HIGH (1), and HIGH (1) becomes LOW (0).",
        "behavior": "Negation.",
        "truthTable": [
            {"A": 0, "OUT": 1},
            {"A": 1, "OUT": 0}
        ]
    },
    {
        "type": "NAND",
        "name": "NAND Gate",
        "inputs": 2,
        "symbol": "(·)'",
        "expression": "Y = (A · B)'",
        "description": "Universal logic gate. Output is LOW (0) only when all inputs are HIGH (1). Equivalent to NOT(AND).",
        "behavior": "Negated conjunction.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 1},
            {"A": 0, "B": 1, "OUT": 1},
            {"A": 1, "B": 0, "OUT": 1},
            {"A": 1, "B": 1, "OUT": 0}
        ]
    },
    {
        "type": "NOR",
        "name": "NOR Gate",
        "inputs": 2,
        "symbol": "(+)'",
        "expression": "Y = (A + B)'",
        "description": "Universal logic gate. Output is HIGH (1) only when all inputs are LOW (0). Equivalent to NOT(OR).",
        "behavior": "Negated disjunction.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 1},
            {"A": 0, "B": 1, "OUT": 0},
            {"A": 1, "B": 0, "OUT": 0},
            {"A": 1, "B": 1, "OUT": 0}
        ]
    },
    {
        "type": "XOR",
        "name": "XOR Gate (Exclusive OR)",
        "inputs": 2,
        "symbol": "⊕",
        "expression": "Y = A ⊕ B",
        "description": "Yields HIGH (1) if inputs differ. Output is 0 when inputs are identical.",
        "behavior": "Odd parity detector.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 0},
            {"A": 0, "B": 1, "OUT": 1},
            {"A": 1, "B": 0, "OUT": 1},
            {"A": 1, "B": 1, "OUT": 0}
        ]
    },
    {
        "type": "XNOR",
        "name": "XNOR Gate (Equivalence)",
        "inputs": 2,
        "symbol": "⊙",
        "expression": "Y = (A ⊕ B)'",
        "description": "Yields HIGH (1) if inputs are identical. Output is 0 when inputs differ.",
        "behavior": "Equality detector.",
        "truthTable": [
            {"A": 0, "B": 0, "OUT": 1},
            {"A": 0, "B": 1, "OUT": 0},
            {"A": 1, "B": 0, "OUT": 0},
            {"A": 1, "B": 1, "OUT": 1}
        ]
    }
]

CHALLENGES = [
    {
        "id": "chal_xor",
        "title": "Build an XOR Gate from Universal NAND Gates",
        "difficulty": "Medium",
        "description": "Implement the 2-input XOR logic function using only NAND gates.",
        "inputs": ["A", "B"],
        "expectedTruthTable": [
            {"A": 0, "B": 0, "OUT": 0},
            {"A": 0, "B": 1, "OUT": 1},
            {"A": 1, "B": 0, "OUT": 1},
            {"A": 1, "B": 1, "OUT": 0}
        ]
    },
    {
        "id": "chal_half_adder",
        "title": "Design a Half Adder",
        "difficulty": "Easy",
        "description": "Build a circuit with 2 inputs (A, B) and 2 outputs (SUM, CARRY) that adds two bits.",
        "inputs": ["A", "B"],
        "expectedTruthTable": [
            {"A": 0, "B": 0, "SUM": 0, "CARRY": 0},
            {"A": 0, "B": 1, "SUM": 1, "CARRY": 0},
            {"A": 1, "B": 0, "SUM": 1, "CARRY": 0},
            {"A": 1, "B": 1, "SUM": 0, "CARRY": 1}
        ]
    },
    {
        "id": "chal_majority",
        "title": "3-Input Majority Voter",
        "difficulty": "Medium",
        "description": "Design a circuit with 3 inputs (A, B, C) where OUT is 1 if at least two inputs are 1.",
        "inputs": ["A", "B", "C"],
        "expectedTruthTable": [
            {"A": 0, "B": 0, "C": 0, "OUT": 0},
            {"A": 0, "B": 0, "C": 1, "OUT": 0},
            {"A": 0, "B": 1, "C": 0, "OUT": 0},
            {"A": 0, "B": 1, "C": 1, "OUT": 1},
            {"A": 1, "B": 0, "C": 0, "OUT": 0},
            {"A": 1, "B": 0, "C": 1, "OUT": 1},
            {"A": 1, "B": 1, "C": 0, "OUT": 1},
            {"A": 1, "B": 1, "C": 1, "OUT": 1}
        ]
    }
]
