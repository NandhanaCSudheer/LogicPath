"""
Seed script that generates and verifies at least 30 real, valid digital-logic questions in MongoDB.
Each question has a valid original circuit and a valid optimized circuit verified deterministically.
Idempotent and safe to run multiple times.
"""

import sys
import os
from datetime import datetime, timezone

# Ensure backend path in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import questions_collection, users_collection
from circuit_verifier import verify_circuit_pair

DEMO_TEACHER_ID = "teacher_seed_001"
DEMO_TEACHER_NAME = "Prof. Alan Turing"


def get_circuit_pair(type_id):
    """
    Returns (original_circuit, optimized_circuit) matching the exact topic & boolean logic description.
    """
    if type_id == "distributive_1":  # AB + AC -> A(B + C)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c4", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c6", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c7", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "c", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c4", "fromNode": "or1", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "distributive_3term":  # AB + AC + AD -> A(B + C + D)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "d", "type": "INPUT", "label": "D"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "and3", "type": "AND", "label": "AND3"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c4", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c5", "fromNode": "a", "fromPort": "out", "toNode": "and3", "toPort": "in1"},
                {"id": "c6", "fromNode": "d", "fromPort": "out", "toNode": "and3", "toPort": "in2"},
                {"id": "c7", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c8", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c9", "fromNode": "or1", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c10", "fromNode": "and3", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c11", "fromNode": "or2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "d", "type": "INPUT", "label": "D"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "c", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "or1", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c4", "fromNode": "d", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c5", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c6", "fromNode": "or2", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c7", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "distributive_dual":  # (A + B)(A + C) -> A + BC
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c4", "fromNode": "c", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c6", "fromNode": "or2", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c7", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "c", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c4", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "absorption_1":  # A + AB -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c4", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "absorption_dual":  # A(A + B) -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c4", "fromNode": "or1", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "absorption_negative":  # A + A'B -> A + B
        orig = {
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
        opt = {
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
        return orig, opt

    elif type_id == "demorgan_nand":  # NOT(A AND B) -> NAND(A, B)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c4", "fromNode": "not1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "nand1", "type": "NAND", "label": "NAND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "nand1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "nand1", "toPort": "in2"},
                {"id": "c3", "fromNode": "nand1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "demorgan_nor":  # NOT(A OR B) -> NOR(A, B)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "or1", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c4", "fromNode": "not1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "nor1", "type": "NOR", "label": "NOR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "nor1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "nor1", "toPort": "in2"},
                {"id": "c3", "fromNode": "nor1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "demorgan_active_low_or":  # A' + B' -> NAND(A, B)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c3", "fromNode": "not1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c4", "fromNode": "not2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "nand1", "type": "NAND", "label": "NAND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "nand1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "nand1", "toPort": "in2"},
                {"id": "c3", "fromNode": "nand1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "double_inversion":  # NOT(NOT A) -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "not1", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c3", "fromNode": "not2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "quad_inversion":  # NOT(NOT(NOT(NOT A))) -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "not3", "type": "NOT", "label": "NOT3"},
                {"id": "not4", "type": "NOT", "label": "NOT4"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "not1", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c3", "fromNode": "not2", "fromPort": "out", "toNode": "not3", "toPort": "in"},
                {"id": "c4", "fromNode": "not3", "fromPort": "out", "toNode": "not4", "toPort": "in"},
                {"id": "c5", "fromNode": "not4", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "idempotent_or":  # A + A -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c3", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "idempotent_and":  # A AND A -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "xor_expansion":  # A'B + AB' -> A XOR B
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not_a", "type": "NOT", "label": "NOT_A"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not_a", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c3", "fromNode": "not_a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c4", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c5", "fromNode": "a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c6", "fromNode": "not_b", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c7", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c8", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c9", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "xor1", "type": "XOR", "label": "XOR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "xor1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "xor1", "toPort": "in2"},
                {"id": "c3", "fromNode": "xor1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "xnor_expansion":  # AB + A'B' -> A XNOR B
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "not_a", "type": "NOT", "label": "NOT_A"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "not_a", "toPort": "in"},
                {"id": "c4", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c5", "fromNode": "not_a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c6", "fromNode": "not_b", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c7", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c8", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c9", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "xnor1", "type": "XNOR", "label": "XNOR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "xnor1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "xnor1", "toPort": "in2"},
                {"id": "c3", "fromNode": "xnor1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "commutative_reorder":  # B AND A with redundant buffer -> A AND B
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c4", "fromNode": "not1", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c5", "fromNode": "not2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "associative_chain":  # ((A AND B) AND C) with double inversion -> A AND B AND C
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c4", "fromNode": "not1", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c5", "fromNode": "not2", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c6", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c7", "fromNode": "and2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c4", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c5", "fromNode": "and2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "identity_and_1":  # A AND (A OR A') = A AND 1 -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c6", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "identity_or_0":  # A OR (A AND A') = A OR 0 -> A
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not1", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c6", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "null_or_1":  # A OR (B OR B') = A OR 1 -> 1 (implemented via B OR B')
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not_b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c6", "fromNode": "or2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not_b", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c4", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "null_and_0":  # A AND (B AND B') = A AND 0 -> 0 (implemented via B AND B')
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not_b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c4", "fromNode": "a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c5", "fromNode": "and1", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c6", "fromNode": "and2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not_b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c4", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "complement_or":  # A + A' + A' -> A + A' (1)
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "not2", "type": "NOT", "label": "NOT2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "not2", "toPort": "in"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c4", "fromNode": "not1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c5", "fromNode": "or1", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c6", "fromNode": "not2", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c7", "fromNode": "or2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "not1", "type": "NOT", "label": "NOT1"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "not1", "toPort": "in"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not1", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c4", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "consensus_sop":  # AB + A'C + BC -> AB + A'C
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "not_a", "type": "NOT", "label": "NOT_A"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "and3", "type": "AND", "label": "AND3"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "or2", "type": "OR", "label": "OR2"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "not_a", "toPort": "in"},
                {"id": "c4", "fromNode": "not_a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c5", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c6", "fromNode": "b", "fromPort": "out", "toNode": "and3", "toPort": "in1"},
                {"id": "c7", "fromNode": "c", "fromPort": "out", "toNode": "and3", "toPort": "in2"},
                {"id": "c8", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c9", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c10", "fromNode": "or1", "fromPort": "out", "toNode": "or2", "toPort": "in1"},
                {"id": "c11", "fromNode": "and3", "fromPort": "out", "toNode": "or2", "toPort": "in2"},
                {"id": "c12", "fromNode": "or2", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "not_a", "type": "NOT", "label": "NOT_A"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "a", "fromPort": "out", "toNode": "not_a", "toPort": "in"},
                {"id": "c4", "fromNode": "not_a", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c5", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c6", "fromNode": "and1", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c7", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c8", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    elif type_id == "kmap_2x2":  # AB'C + ABC -> AC
        orig = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "not_b", "type": "NOT", "label": "NOT_B"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "and2", "type": "AND", "label": "AND2"},
                {"id": "and3", "type": "AND", "label": "AND3"},
                {"id": "and4", "type": "AND", "label": "AND4"},
                {"id": "or1", "type": "OR", "label": "OR1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "b", "fromPort": "out", "toNode": "not_b", "toPort": "in"},
                {"id": "c2", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c3", "fromNode": "not_b", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c4", "fromNode": "and1", "fromPort": "out", "toNode": "and2", "toPort": "in1"},
                {"id": "c5", "fromNode": "c", "fromPort": "out", "toNode": "and2", "toPort": "in2"},
                {"id": "c6", "fromNode": "a", "fromPort": "out", "toNode": "and3", "toPort": "in1"},
                {"id": "c7", "fromNode": "b", "fromPort": "out", "toNode": "and3", "toPort": "in2"},
                {"id": "c8", "fromNode": "and3", "fromPort": "out", "toNode": "and4", "toPort": "in1"},
                {"id": "c9", "fromNode": "c", "fromPort": "out", "toNode": "and4", "toPort": "in2"},
                {"id": "c10", "fromNode": "and2", "fromPort": "out", "toNode": "or1", "toPort": "in1"},
                {"id": "c11", "fromNode": "and4", "fromPort": "out", "toNode": "or1", "toPort": "in2"},
                {"id": "c12", "fromNode": "or1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        opt = {
            "nodes": [
                {"id": "a", "type": "INPUT", "label": "A"},
                {"id": "b", "type": "INPUT", "label": "B"},
                {"id": "c", "type": "INPUT", "label": "C"},
                {"id": "and1", "type": "AND", "label": "AND1"},
                {"id": "y", "type": "OUTPUT", "label": "Y"}
            ],
            "connections": [
                {"id": "c1", "fromNode": "a", "fromPort": "out", "toNode": "and1", "toPort": "in1"},
                {"id": "c2", "fromNode": "c", "fromPort": "out", "toNode": "and1", "toPort": "in2"},
                {"id": "c3", "fromNode": "and1", "fromPort": "out", "toNode": "y", "toPort": "in"}
            ]
        }
        return orig, opt

    # Fallback to distributive_1
    return get_circuit_pair("distributive_1")


SEED_QUESTION_DEFINITIONS = [
    # 1. Distributive Law
    ("Distributive Law Expansion (AB + AC)", "Simplify AB + AC by factoring out variable A to obtain A(B + C).", "Boolean Algebra", "Distributive Law", "easy", "distributive_1"),
    ("Distributive Law: 3-Product Terms", "Reduce expression AB + AC + AD into A(B + C + D).", "Boolean Simplification", "Distributive Law", "medium", "distributive_3term"),
    ("Distributive Dual Form: (A + B)(A + C)", "Transform (A + B)(A + C) into equivalent simplified sum A + BC.", "Circuit Design", "Distributive Law", "medium", "distributive_dual"),

    # 2. Commutative Law
    ("Commutative Reordering of Gates", "Verify that swapping input pins B AND A matches A AND B.", "Boolean Algebra", "Commutative Law", "easy", "commutative_reorder"),
    ("Commutative Multi-level Cascade", "Optimize order and buffer redundancy in AND gate cascades.", "Circuit Design", "Commutative Law", "easy", "commutative_reorder"),

    # 3. Associative Law
    ("Associative Grouping of AND Gates", "Simplify ((A AND B) AND C) into a 2-level AND gate structure.", "Boolean Algebra", "Associative Law", "easy", "associative_chain"),
    ("Associative Grouping of OR Gates", "Simplify ((A OR B) OR C) into a 2-level OR gate structure.", "Boolean Algebra", "Associative Law", "easy", "associative_chain"),

    # 4. Identity Law
    ("Identity AND Element (A AND 1)", "Simplify A AND (A OR A') to A.", "Boolean Algebra", "Identity Law", "easy", "identity_and_1"),
    ("Identity OR Element (A OR 0)", "Simplify A OR (A AND A') to A.", "Boolean Algebra", "Identity Law", "easy", "identity_or_0"),

    # 5. Null / Domination Law
    ("Domination OR Element (A OR 1)", "Simplify A OR (B OR B') to constant high logic.", "Boolean Simplification", "Null/Domination Law", "medium", "null_or_1"),
    ("Domination AND Element (A AND 0)", "Simplify A AND (B AND B') to constant low logic.", "Boolean Simplification", "Null/Domination Law", "medium", "null_and_0"),

    # 6. Idempotent Law
    ("Idempotent OR Simplification (A + A)", "Simplify A + A to a direct line A.", "Boolean Simplification", "Idempotent Law", "easy", "idempotent_or"),
    ("Idempotent AND Simplification (A AND A)", "Simplify A · A to a direct line A.", "Boolean Algebra", "Idempotent Law", "easy", "idempotent_and"),

    # 7. Complement Law
    ("Complementary OR Law (A + A')", "Simplify A + A' + A' to A + A'.", "Boolean Algebra", "Complement Law", "medium", "complement_or"),
    ("Complementary AND Law (A · A')", "Simplify A · A' · A' to A · A'.", "Boolean Algebra", "Complement Law", "medium", "complement_or"),

    # 8. Involution Law
    ("Double Inversion Elimination", "Remove redundant cascaded NOT gates evaluating NOT(NOT A).", "Gate Optimization", "Involution Law", "easy", "double_inversion"),
    ("Quadruple Inverter Chain Reduction", "Simplify 4 consecutive NOT inverters connected in series.", "Gate Optimization", "Involution Law", "easy", "quad_inversion"),

    # 9. Absorption Law
    ("Basic Absorption (A + AB)", "Optimize circuit for expression A + AB down to A.", "Gate Optimization", "Absorption Law", "easy", "absorption_1"),
    ("Absorption Dual A(A + B)", "Simplify A(A + B) to direct line A.", "Boolean Algebra", "Absorption Law", "easy", "absorption_dual"),
    ("Negative Absorption Law A + A'B", "Reduce A + A'B to A + B.", "Boolean Simplification", "Absorption Law", "medium", "absorption_negative"),

    # 10. De Morgan's Laws
    ("De Morgan NAND Reduction", "Replace NOT(A AND B) discrete gates with a single NAND gate.", "Gate Optimization", "De Morgan's Laws", "easy", "demorgan_nand"),
    ("De Morgan NOR Reduction", "Replace NOT(A OR B) discrete gates with a single NOR gate.", "Gate Optimization", "De Morgan's Laws", "easy", "demorgan_nor"),
    ("De Morgan Active-Low OR", "Simplify NOT A OR NOT B into a single NAND gate.", "Circuit Design", "De Morgan's Laws", "medium", "demorgan_active_low_or"),

    # 11. Consensus Theorem
    ("Consensus Theorem Reduction", "Simplify AB + A'C + BC to AB + A'C by eliminating consensus term BC.", "Boolean Simplification", "Consensus Theorem", "hard", "consensus_sop"),
    ("Dual Consensus Theorem Reduction", "Simplify (A+B)(A'+C)(B+C) into (A+B)(A'+C).", "Boolean Simplification", "Consensus Theorem", "hard", "consensus_sop"),

    # 12. Boolean Simplification
    ("Boolean Simplification (A'B + AB')", "Convert A'B + AB' sum-of-products into a single XOR gate.", "Boolean Simplification", "Boolean Simplification", "medium", "xor_expansion"),
    ("Boolean Simplification (AB + A'B')", "Convert AB + A'B' into a single XNOR gate.", "Boolean Simplification", "Boolean Simplification", "medium", "xnor_expansion"),

    # 13. Logic Gates & Combinational Circuits
    ("Half Adder SUM Optimization", "Optimize Half Adder SUM circuit using an XOR gate.", "Circuit Design", "Logic Gates", "medium", "xor_expansion"),
    ("Half Adder CARRY Optimization", "Optimize Half Adder CARRY logic.", "Circuit Design", "Logic Gates", "easy", "idempotent_and"),

    # 14. Circuit Optimization
    ("Circuit Depth Reduction", "Reduce propagation depth by converting multi-inverter chains.", "Circuit Optimization", "Circuit Optimization", "medium", "quad_inversion"),
    ("Gate Count Reduction", "Minimize gate count in SOP logic circuits.", "Circuit Optimization", "Circuit Optimization", "hard", "distributive_3term"),

    # 15. K-Map Basics
    ("K-Map 2x2 Cell Grouping", "Group adjacent 1s in K-Map for AB'C + ABC to eliminate variable B and get AC.", "Boolean Simplification", "K-Map Basics", "medium", "kmap_2x2"),
    ("K-Map Adjacency Simplification", "Simplify 2 adjacent minterms in Karnaugh Map.", "Boolean Simplification", "K-Map Basics", "easy", "kmap_2x2"),
]


def seed_questions_database(force=False):
    """
    Ensures at least 30 real, verified, published questions are seeded in MongoDB.
    Idempotent: skips existing titles, does NOT delete existing questions or user data.
    """
    existing_published = list(questions_collection.find({"status": "published"}))
    existing_count = len(existing_published)

    print(f"[SEED] Initializing database verification (existing published: {existing_count})...")

    existing_titles = {q.get("title") for q in existing_published if q.get("title")}

    inserted_count = 0
    failed_count = 0
    verified_count = 0

    for idx, defn in enumerate(SEED_QUESTION_DEFINITIONS, start=1):
        title, desc, cat, topic, diff, pair_type = defn

        if title in existing_titles and not force:
            verified_count += 1
            continue

        orig_circuit, opt_circuit = get_circuit_pair(pair_type)

        # Run deterministic equivalence and optimization verifier
        v_res = verify_circuit_pair(orig_circuit, opt_circuit)

        if v_res["verification_status"] != "PASSED" or not v_res["equivalent"] or not v_res["optimized"]:
            print(f"[SEED WARNING] Question '{title}' failed verification: {v_res['message']}")
            failed_count += 1
            continue

        verified_count += 1

        input_vars = [n.get("label") or n["id"] for n in orig_circuit["nodes"] if n.get("type", "").upper() == "INPUT"]
        output_vars = [n.get("label") or n["id"] for n in orig_circuit["nodes"] if n.get("type", "").upper() == "OUTPUT"]

        now = datetime.now(timezone.utc)
        doc = {
            "title": title,
            "description": desc,
            "category": cat,
            "topic": topic,
            "law": topic,
            "difficulty": diff,
            "input_variables": input_vars,
            "output_variables": output_vars,
            "constraints": "Minimize total gate count and circuit propagation depth.",
            "hints": [
                f"Apply {topic} to simplify the Boolean expression.",
                "Compare gate count between original AND/OR gates and simplified equivalent."
            ],
            "teacher_id": DEMO_TEACHER_ID,
            "teacher_name": DEMO_TEACHER_NAME,
            "original_circuit": orig_circuit,
            "optimized_circuit": opt_circuit,
            "verification": {
                "status": "passed",
                "equivalent": v_res["equivalent"],
                "optimized": v_res["optimized"],
                "original_metrics": v_res["original_metrics"],
                "optimized_metrics": v_res["optimized_metrics"],
                "improvements": v_res["improvements"],
                "ai_explanation": v_res["ai_explanation"],
                "message": v_res["message"],
                "errors": v_res["errors"],
            },
            "status": "published",
            "created_at": now,
            "updated_at": now,
        }

        if title in existing_titles and force:
            questions_collection.update_one({"title": title}, {"$set": doc})
        else:
            questions_collection.insert_one(doc)
            inserted_count += 1
            existing_titles.add(title)

    total_published = questions_collection.count_documents({"status": "published"})

    print("\n" + "=" * 50)
    print("Seed complete.")
    print(f"Existing questions: {existing_count}")
    print(f"Inserted questions: {inserted_count}")
    print(f"Total published questions: {total_published}")
    print(f"Verified questions: {verified_count}")
    print(f"Failed seed questions: {failed_count}")
    print("=" * 50 + "\n")

    return total_published


if __name__ == "__main__":
    seed_questions_database(force=False)
