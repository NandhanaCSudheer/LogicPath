"""
Logic Engine for LogicPath
Digital Circuit Design, Simulation, Truth Tables,
Boolean Expression Generation, Optimization and Verification.

Supported components:
- INPUT
- OUTPUT
- AND
- OR
- NOT
- NAND
- NOR
- XOR
- XNOR
- HALF_ADDER
- FULL_ADDER
- MUX_2_1
- MUX_4_1
- DEMUX_1_2
- DEMUX_1_4
- DECODER_2_4
- DECODER_3_8
- ENCODER_4_2
- ENCODER_8_3
"""

from collections import deque, defaultdict
import itertools


# ============================================================
# SUPPORTED COMPONENTS
# ============================================================

SUPPORTED_GATES = {
    "INPUT",
    "OUTPUT",
    "AND",
    "OR",
    "NOT",
    "NAND",
    "NOR",
    "XOR",
    "XNOR",

    "HALF_ADDER",
    "FULL_ADDER",

    "MUX_2_1",
    "MUX_4_1",

    "DEMUX_1_2",
    "DEMUX_1_4",

    "DECODER_2_4",
    "DECODER_3_8",
    "DECODER_4_16",

    "ENCODER_4_2",
    "ENCODER_8_3",
}


# ============================================================
# PORT DEFINITIONS
# ============================================================

COMPONENT_PORTS = {
    "INPUT": {
        "inputs": [],
        "outputs": ["out"],
    },

    "OUTPUT": {
        "inputs": ["in"],
        "outputs": [],
    },

    "NOT": {
        "inputs": ["in"],
        "outputs": ["out"],
    },

    "AND": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    "OR": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    "NAND": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    "NOR": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    "XOR": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    "XNOR": {
        "inputs": ["in1", "in2"],
        "outputs": ["out"],
    },

    # ---------------- ADDERS ----------------

    "HALF_ADDER": {
        "inputs": ["A", "B"],
        "outputs": ["SUM", "CARRY"],
    },

    "FULL_ADDER": {
        "inputs": ["A", "B", "CIN"],
        "outputs": ["SUM", "COUT"],
    },

    # ---------------- MULTIPLEXERS ----------------

    "MUX_2_1": {
        "inputs": ["I0", "I1", "S"],
        "outputs": ["Y"],
    },

    "MUX_4_1": {
        "inputs": ["I0", "I1", "I2", "I3", "S0", "S1"],
        "outputs": ["Y"],
    },

    # ---------------- DEMULTIPLEXERS ----------------

    "DEMUX_1_2": {
        "inputs": ["D", "S"],
        "outputs": ["Y0", "Y1"],
    },

    "DEMUX_1_4": {
        "inputs": ["D", "S0", "S1"],
        "outputs": ["Y0", "Y1", "Y2", "Y3"],
    },

    # ---------------- DECODERS ----------------

    "DECODER_2_4": {
        "inputs": ["A", "B"],
        "outputs": ["Y0", "Y1", "Y2", "Y3"],
    },

     "DECODER_3_8": {
        "inputs": ["A", "B", "C"],
        "outputs": [
            "Y0",
            "Y1",
            "Y2",
            "Y3",
            "Y4",
            "Y5",
            "Y6",
            "Y7",
        ],
    },

    "DECODER_4_16": {
        "inputs": ["A", "B", "C", "D"],
        "outputs": [
            "Y0",
            "Y1",
            "Y2",
            "Y3",
            "Y4",
            "Y5",
            "Y6",
            "Y7",
            "Y8",
            "Y9",
            "Y10",
            "Y11",
            "Y12",
            "Y13",
            "Y14",
            "Y15",
        ],
    },

    # ---------------- ENCODERS ----------------

    "ENCODER_4_2": {
        "inputs": ["I0", "I1", "I2", "I3"],
        "outputs": ["A", "B"],
    },

    "ENCODER_8_3": {
        "inputs": [
            "I0",
            "I1",
            "I2",
            "I3",
            "I4",
            "I5",
            "I6",
            "I7",
        ],
        "outputs": ["A", "B", "C"],
    },
}


# ============================================================
# INPUT LIMITS
# ============================================================

VARIABLE_INPUT_GATES = {
    "AND",
    "OR",
    "NAND",
    "NOR",
    "XOR",
    "XNOR",
}

GATE_INPUT_LIMITS = {
    gate_type: {
        "min": 2,
        "max": 8,
    }
    for gate_type in VARIABLE_INPUT_GATES
}

for gate_type, spec in COMPONENT_PORTS.items():
    if gate_type not in GATE_INPUT_LIMITS:
        GATE_INPUT_LIMITS[gate_type] = {
            "min": len(spec["inputs"]),
            "max": len(spec["inputs"]),
        }

# ============================================================
# BASIC GATE EVALUATION
# ============================================================

def evaluate_gate(gate_type, inputs):
    """
    Evaluates normal single-output logic gates.
    """

    gate_type = str(gate_type).upper()

    inputs = [
        1 if int(v) else 0
        for v in (inputs or [])
    ]

    if gate_type == "INPUT":
        return inputs[0] if inputs else 0

    if gate_type == "OUTPUT":
        return inputs[0] if inputs else 0

    if gate_type == "NOT":
        return 0 if inputs[0] == 1 else 1

    if gate_type == "AND":
        return 1 if all(v == 1 for v in inputs) else 0

    if gate_type == "OR":
        return 1 if any(v == 1 for v in inputs) else 0

    if gate_type == "NAND":
        return 0 if all(v == 1 for v in inputs) else 1

    if gate_type == "NOR":
        return 0 if any(v == 1 for v in inputs) else 1

    if gate_type == "XOR":
        return sum(inputs) % 2

    if gate_type == "XNOR":
        return 1 if sum(inputs) % 2 == 0 else 0

    raise ValueError(
        f"Unsupported basic gate type: {gate_type}"
    )


# ============================================================
# COMBINATIONAL COMPONENT EVALUATION
# ============================================================

def evaluate_component(component_type, inputs):
    """
    Evaluates multi-input / multi-output combinational components.

    Returns:
        dict of output_port -> 0/1
    """

    component_type = str(component_type).upper()

    # Normalize all input values to 0/1
    values = {
        str(key).upper(): 1 if int(value) else 0
        for key, value in (inputs or {}).items()
    }

    # --------------------------------------------------------
    # HALF ADDER
    # --------------------------------------------------------

    if component_type == "HALF_ADDER":
        a = values.get("A", 0)
        b = values.get("B", 0)

        return {
            "SUM": a ^ b,
            "CARRY": a & b,
        }

    # --------------------------------------------------------
    # FULL ADDER
    # --------------------------------------------------------

    if component_type == "FULL_ADDER":
        a = values.get("A", 0)
        b = values.get("B", 0)
        cin = values.get("CIN", 0)

        total = a + b + cin

        return {
            "SUM": total % 2,
            "COUT": 1 if total >= 2 else 0,
        }

    # --------------------------------------------------------
    # 2:1 MUX
    # --------------------------------------------------------

    if component_type == "MUX_2_1":
        i0 = values.get("I0", 0)
        i1 = values.get("I1", 0)
        s = values.get("S", 0)

        return {
            "Y": i1 if s == 1 else i0
        }

    # --------------------------------------------------------
    # 4:1 MUX
    # --------------------------------------------------------

    if component_type == "MUX_4_1":
        i0 = values.get("I0", 0)
        i1 = values.get("I1", 0)
        i2 = values.get("I2", 0)
        i3 = values.get("I3", 0)

        s0 = values.get("S0", 0)
        s1 = values.get("S1", 0)

        select = (s1 << 1) | s0

        inputs_by_select = {
            0: i0,
            1: i1,
            2: i2,
            3: i3,
        }

        return {
            "Y": inputs_by_select[select]
        }

    # --------------------------------------------------------
    # 1:2 DEMUX
    # --------------------------------------------------------

    if component_type == "DEMUX_1_2":
        d = values.get("D", 0)
        s = values.get("S", 0)

        return {
            "Y0": d if s == 0 else 0,
            "Y1": d if s == 1 else 0,
        }

    # --------------------------------------------------------
    # 1:4 DEMUX
    # --------------------------------------------------------

    if component_type == "DEMUX_1_4":
        d = values.get("D", 0)
        s0 = values.get("S0", 0)
        s1 = values.get("S1", 0)

        select = (s1 << 1) | s0

        outputs = {
            "Y0": 0,
            "Y1": 0,
            "Y2": 0,
            "Y3": 0,
        }

        outputs[f"Y{select}"] = d

        return outputs

    # --------------------------------------------------------
    # 2:4 DECODER
    # --------------------------------------------------------

    if component_type == "DECODER_2_4":
        a = values.get("A", 0)
        b = values.get("B", 0)

        select = (a << 1) | b

        outputs = {
            "Y0": 0,
            "Y1": 0,
            "Y2": 0,
            "Y3": 0,
        }

        outputs[f"Y{select}"] = 1

        return outputs

    # --------------------------------------------------------
    # 3:8 DECODER
    # --------------------------------------------------------

    if component_type == "DECODER_3_8":
        a = values.get("A", 0)
        b = values.get("B", 0)
        c = values.get("C", 0)

        select = (a << 2) | (b << 1) | c

        outputs = {
            "Y0": 0,
            "Y1": 0,
            "Y2": 0,
            "Y3": 0,
            "Y4": 0,
            "Y5": 0,
            "Y6": 0,
            "Y7": 0,
        }

        outputs[f"Y{select}"] = 1

        return outputs


    # --------------------------------------------------------
    # 3:8 DECODER
    # --------------------------------------------------------

    if component_type == "DECODER_3_8":
        a = values.get("A", 0)
        b = values.get("B", 0)
        c = values.get("C", 0)

        select = (a << 2) | (b << 1) | c

        outputs = {
            "Y0": 0,
            "Y1": 0,
            "Y2": 0,
            "Y3": 0,
            "Y4": 0,
            "Y5": 0,
            "Y6": 0,
            "Y7": 0,
        }

        outputs[f"Y{select}"] = 1

        return outputs

    # --------------------------------------------------------
    # 4:2 ENCODER
    # --------------------------------------------------------

    if component_type == "ENCODER_4_2":
        active_inputs = [
            idx
            for idx in range(4)
            if values.get(f"I{idx}", 0) == 1
        ]

        # Valid encoder assumes one active input.
        if len(active_inputs) != 1:
            return {
                "A": 0,
                "B": 0,
            }

        index = active_inputs[0]

        # Binary representation:
        # 0 -> 00
        # 1 -> 01
        # 2 -> 10
        # 3 -> 11
        return {
            "A": (index >> 1) & 1,
            "B": index & 1,
        }

    # --------------------------------------------------------
    # 8:3 ENCODER
    # --------------------------------------------------------

    if component_type == "ENCODER_8_3":
        active_inputs = [
            idx
            for idx in range(8)
            if values.get(f"I{idx}", 0) == 1
        ]

        if len(active_inputs) != 1:
            return {
                "A": 0,
                "B": 0,
                "C": 0,
            }

        index = active_inputs[0]

        return {
            "A": (index >> 2) & 1,
            "B": (index >> 1) & 1,
            "C": index & 1,
        }

    raise ValueError(
        f"Unsupported combinational component: {component_type}"
    )


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_component_spec(node):
    """
    Returns the actual component specification.

    For variable-input basic gates, the input ports
    are taken from node["inputPorts"].

    Supported variable-input gates:
        AND, OR, NAND, NOR, XOR, XNOR

    Default for old circuits:
        in1, in2
    """

    node_type = str(
        node.get("type", "")
    ).upper()

    if node_type not in COMPONENT_PORTS:
        return {
            "inputs": [],
            "outputs": [],
        }

    base_spec = COMPONENT_PORTS[node_type]

    # --------------------------------------------------------
    # VARIABLE INPUT BASIC GATES
    # --------------------------------------------------------

    if node_type in VARIABLE_INPUT_GATES:

        configured_ports = node.get(
            "inputPorts"
        )

        valid_configured_ports = (
            isinstance(
                configured_ports,
                list
            )
            and len(configured_ports) >= 2
            and len(configured_ports) <= 8
            and all(
                str(port).lower().startswith("in")
                for port in configured_ports
            )
        )

        if valid_configured_ports:

            ports = []

            for port in configured_ports:
                port_name = str(port)

                if port_name not in ports:
                    ports.append(
                        port_name
                    )

            return {
                "inputs": ports,
                "outputs": ["out"],
            }

        # Compatibility with old circuits
        return {
            "inputs": [
                "in1",
                "in2",
            ],
            "outputs": ["out"],
        }

    return {
        "inputs": list(
            base_spec["inputs"]
        ),
        "outputs": list(
            base_spec["outputs"]
        ),
    }


def source_port_value(node_values, node_id, port_name):
    """
    Gets the value produced by a node on a specific output port.

    Basic gates store:
        node_values[node_id] = 0/1

    Multi-output components store:
        node_values[node_id] = {
            "SUM": 1,
            "CARRY": 0
        }
    """

    value = node_values.get(node_id, 0)

    if isinstance(value, dict):
        return int(
            value.get(
                port_name,
                value.get(
                    str(port_name).upper(),
                    0
                )
            )
        )

    return int(value)


# ============================================================
# VALIDATION
# ============================================================

def validate_circuit(nodes, connections):
    """
    Validates:
    - Supported component types
    - Source/target nodes
    - Valid ports
    - Input port occupancy
    - Missing input ports
    - Duplicate connections
    - Cycles
    """

    errors = []
    warnings = []

    if not isinstance(nodes, list):
        return (
            False,
            ["Nodes must be a list."],
            []
        )

    if not isinstance(connections, list):
        return (
            False,
            ["Connections must be a list."],
            []
        )

    if not nodes:
        errors.append(
            "Circuit contains no components."
        )
        return False, errors, warnings

    node_map = {
        node["id"]: node
        for node in nodes
        if isinstance(node, dict)
        and node.get("id")
    }

    if len(node_map) != len(nodes):
        errors.append(
            "Every circuit component must have a unique id."
        )

    # --------------------------------------------------------
    # TYPE VALIDATION
    # --------------------------------------------------------

    for node in nodes:
        node_id = node.get("id")
        node_type = str(
            node.get("type", "")
        ).upper()

        label = (
            node.get("label")
            or node_id
            or "Unknown"
        )

        if node_type not in SUPPORTED_GATES:
            errors.append(
                f"Component '{label}' ({node_id}) "
                f"has unsupported type '{node_type}'."
            )

    # --------------------------------------------------------
    # CONNECTION VALIDATION
    # --------------------------------------------------------

    seen_connections = set()

    incoming_by_node = defaultdict(list)
    incoming_by_port = defaultdict(list)
    outgoing_by_node = defaultdict(list)

    graph = defaultdict(list)

    for conn in connections:

        src = conn.get("fromNode")
        dst = conn.get("toNode")

        src_port = (
            conn.get("fromPort")
            or "out"
        )

        dst_port = (
            conn.get("toPort")
            or "in"
        )

        if not src or not dst:
            errors.append(
                "Malformed connection missing source or target."
            )
            continue

        if src not in node_map:
            errors.append(
                f"Connection references nonexistent "
                f"source node '{src}'."
            )
            continue

        if dst not in node_map:
            errors.append(
                f"Connection references nonexistent "
                f"target node '{dst}'."
            )
            continue

        if src == dst:
            errors.append(
                f"Self-connection detected on "
                f"node '{src}'."
            )
            continue

        src_node = node_map[src]
        dst_node = node_map[dst]

        src_type = str(
            src_node.get("type", "")
        ).upper()

        dst_type = str(
            dst_node.get("type", "")
        ).upper()

        src_spec = get_component_spec(
            src_node
        )

        dst_spec = get_component_spec(
            dst_node
        )

        # ----------------------------------------------------
        # SOURCE PORT
        # ----------------------------------------------------

        if src_port not in src_spec["outputs"]:
            errors.append(
                f"Invalid output port '{src_port}' "
                f"on {src_type} '{src_node.get('label') or src}'."
            )

        # ----------------------------------------------------
        # TARGET PORT
        # ----------------------------------------------------

        if dst_port not in dst_spec["inputs"]:
            errors.append(
                f"Invalid input port '{dst_port}' "
                f"on {dst_type} '{dst_node.get('label') or dst}'."
            )

        # OUTPUT cannot feed another component
        if src_type == "OUTPUT":
            errors.append(
                f"OUTPUT node "
                f"'{src_node.get('label') or src}' "
                f"cannot be used as a source."
            )

        # INPUT cannot receive a connection
        if dst_type == "INPUT":
            errors.append(
                f"INPUT node "
                f"'{dst_node.get('label') or dst}' "
                f"cannot receive input connections."
            )

        connection_key = (
            src,
            src_port,
            dst,
            dst_port,
        )

        if connection_key in seen_connections:
            warnings.append(
                f"Duplicate connection from "
                f"{src_node.get('label') or src} "
                f"to "
                f"{dst_node.get('label') or dst}."
            )
            continue

        seen_connections.add(
            connection_key
        )

        incoming_by_node[dst].append(conn)

        incoming_by_port[
            (dst, dst_port)
        ].append(conn)

        outgoing_by_node[src].append(conn)

        graph[src].append(dst)

    # --------------------------------------------------------
    # CHECK REQUIRED INPUT PORTS
    # --------------------------------------------------------

    for node in nodes:

        node_id = node.get("id")

        node_type = str(
            node.get("type", "")
        ).upper()

        label = (
            node.get("label")
            or node_id
            or "Unknown"
        )

        if node_type not in SUPPORTED_GATES:
            continue

        required_ports = get_component_spec(
            node
        )["inputs"]
        for required_port in required_ports:

            connections_for_port = incoming_by_port.get(
                (node_id, required_port),
                []
            )

            if len(connections_for_port) == 0:
                errors.append(
                    f"{node_type} '{label}' "
                    f"is missing required input port "
                    f"'{required_port}'."
                )

            elif len(connections_for_port) > 1:
                errors.append(
                    f"Input port '{required_port}' "
                    f"on {node_type} '{label}' "
                    f"has multiple connections."
                )

        # Output warning
        output_ports = get_component_spec(
            node
        )["outputs"]

        if (
            node_type != "OUTPUT"
            and len(
                outgoing_by_node.get(
                    node_id,
                    []
                )
            ) == 0
        ):
            warnings.append(
                f"Component '{label}' "
                f"has no connected output."
            )

    # --------------------------------------------------------
    # CYCLE DETECTION
    # --------------------------------------------------------

    indegree = {
        node["id"]: 0
        for node in nodes
        if node.get("id")
    }

    for src in graph:
        for dst in graph[src]:
            indegree[dst] = (
                indegree.get(dst, 0) + 1
            )

    queue = deque(
        [
            node_id
            for node_id, degree
            in indegree.items()
            if degree == 0
        ]
    )

    visited_count = 0

    while queue:

        current = queue.popleft()
        visited_count += 1

        for next_node in graph[current]:

            indegree[next_node] -= 1

            if indegree[next_node] == 0:
                queue.append(next_node)

    if visited_count < len(node_map):

        cyclic_nodes = [
            node_map[node_id].get("label")
            or node_id
            for node_id, degree
            in indegree.items()
            if degree > 0
        ]

        errors.append(
            "Combinational loop / cycle detected "
            "involving: "
            + ", ".join(cyclic_nodes)
        )

    return (
        len(errors) == 0,
        errors,
        warnings
    )


# ============================================================
# TOPOLOGICAL SORT
# ============================================================

def topological_sort(nodes, connections):
    """
    Returns node IDs in topological evaluation order.
    """

    node_map = {
        node["id"]: node
        for node in nodes
    }

    graph = defaultdict(list)

    indegree = {
        node["id"]: 0
        for node in nodes
    }

    for conn in connections:

        src = conn.get("fromNode")
        dst = conn.get("toNode")

        if (
            src in node_map
            and dst in node_map
        ):
            graph[src].append(dst)
            indegree[dst] += 1

    queue = deque(
        [
            node_id
            for node_id, degree
            in indegree.items()
            if degree == 0
        ]
    )

    order = []

    while queue:

        current = queue.popleft()

        order.append(current)

        for next_node in graph[current]:

            indegree[next_node] -= 1

            if indegree[next_node] == 0:
                queue.append(next_node)

    if len(order) < len(nodes):
        raise ValueError(
            "Cannot perform topological sort "
            "on circuit with cycles."
        )

    return order


# ============================================================
# SIMULATION
# ============================================================

def simulate_circuit(
    nodes,
    connections,
    input_values=None
):
    """
    Simulates the entire circuit.
    """

    is_valid, errors, warnings = (
        validate_circuit(
            nodes,
            connections
        )
    )

    if not is_valid:
        return {
            "success": False,
            "errors": errors,
            "warnings": warnings,
            "node_values": {},
            "wire_values": {},
            "output_values": {},
            "evaluation_order": [],
        }

    try:
        eval_order = topological_sort(
            nodes,
            connections
        )
    except ValueError as exc:
        return {
            "success": False,
            "errors": [str(exc)],
            "warnings": warnings,
            "node_values": {},
            "wire_values": {},
            "output_values": {},
            "evaluation_order": [],
        }

    node_map = {
        node["id"]: node
        for node in nodes
    }

    node_values = {}
    wire_values = {}
    output_values = {}

    input_values = input_values or {}

    # Target node -> connection list
    incoming = defaultdict(list)

    for conn in connections:

        dst = conn.get("toNode")

        if dst:
            incoming[dst].append(conn)

    # --------------------------------------------------------
    # EVALUATE NODES
    # --------------------------------------------------------

    for node_id in eval_order:

        node = node_map[node_id]

        node_type = str(
            node.get("type", "")
        ).upper()

        label = (
            node.get("label")
            or node_id
        )

        # ====================================================
        # INPUT
        # ====================================================

        if node_type == "INPUT":

            if node_id in input_values:
                value = input_values[node_id]

            elif label in input_values:
                value = input_values[label]

            else:
                value = node.get(
                    "state",
                    0
                )

            node_values[node_id] = (
                1 if int(value) else 0
            )

        # ====================================================
        # OUTPUT
        # ====================================================

        elif node_type == "OUTPUT":

            inc = incoming.get(
                node_id,
                []
            )

            if not inc:
                node_values[node_id] = 0
                output_values[label] = 0
                output_values[node_id] = 0
                continue

            conn = inc[0]

            src_id = conn.get(
                "fromNode"
            )

            src_port = conn.get(
                "fromPort",
                "out"
            )

            value = source_port_value(
                node_values,
                src_id,
                src_port
            )

            wire_id = (
                conn.get("id")
                or f"{src_id}->{node_id}"
            )

            wire_values[wire_id] = value

            node_values[node_id] = value

            output_values[label] = value
            output_values[node_id] = value

        # ====================================================
        # BASIC GATES
        # ====================================================

        elif node_type in {
            "AND",
            "OR",
            "NOT",
            "NAND",
            "NOR",
            "XOR",
            "XNOR",
        }:

            input_ports = get_component_spec(
                node
            )["inputs"]

            port_values = {}

            for conn in incoming.get(
                node_id,
                []
            ):

                src_id = conn.get(
                    "fromNode"
                )

                src_port = conn.get(
                    "fromPort",
                    "out"
                )

                dst_port = conn.get(
                    "toPort",
                    "in"
                )

                value = source_port_value(
                    node_values,
                    src_id,
                    src_port
                )

                port_values[
                    dst_port
                ] = value

                wire_id = (
                    conn.get("id")
                    or f"{src_id}->{node_id}"
                )

                wire_values[
                    wire_id
                ] = value

            ordered_inputs = [
                port_values.get(
                    port,
                    0
                )
                for port in input_ports
            ]

            node_values[node_id] = (
                evaluate_gate(
                    node_type,
                    ordered_inputs
                )
            )

        # ====================================================
        # MULTI-OUTPUT COMPONENTS
        # ====================================================

        else:

            port_values = {}

            for conn in incoming.get(
                node_id,
                []
            ):

                src_id = conn.get(
                    "fromNode"
                )

                src_port = conn.get(
                    "fromPort",
                    "out"
                )

                dst_port = conn.get(
                    "toPort"
                )

                value = source_port_value(
                    node_values,
                    src_id,
                    src_port
                )

                port_values[
                    dst_port
                ] = value

                wire_id = (
                    conn.get("id")
                    or f"{src_id}->{node_id}"
                )

                wire_values[
                    wire_id
                ] = value

            node_values[node_id] = (
                evaluate_component(
                    node_type,
                    port_values
                )
            )

    return {
        "success": True,
        "errors": [],
        "warnings": warnings,
        "node_values": node_values,
        "wire_values": wire_values,
        "output_values": output_values,
        "evaluation_order": eval_order,
    }


# ============================================================
# TRUTH TABLE
# ============================================================

def generate_truth_table(
    nodes,
    connections
):
    """
    Generates all 2^N input combinations.
    """

    is_valid, errors, warnings = (
        validate_circuit(
            nodes,
            connections
        )
    )

    if not is_valid:
        return {
            "success": False,
            "errors": errors,
            "warnings": warnings,
            "input_headers": [],
            "output_headers": [],
            "rows": [],
        }

    input_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "INPUT"
    ]

    output_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "OUTPUT"
    ]

    if not input_nodes:
        return {
            "success": False,
            "errors": [
                "Circuit requires at least "
                "one INPUT node."
            ],
            "warnings": warnings,
            "input_headers": [],
            "output_headers": [],
            "rows": [],
        }

    if len(input_nodes) > 8:
        return {
            "success": False,
            "errors": [
                f"Circuit has "
                f"{len(input_nodes)} inputs. "
                f"Truth tables are capped "
                f"at 8 inputs."
            ],
            "warnings": warnings,
            "input_headers": [],
            "output_headers": [],
            "rows": [],
        }

    input_nodes.sort(
        key=lambda node:
        node.get("label")
        or node.get("id")
    )

    output_nodes.sort(
        key=lambda node:
        node.get("label")
        or node.get("id")
    )

    input_headers = [
        node.get("label")
        or node.get("id")
        for node in input_nodes
    ]

    output_headers = [
        node.get("label")
        or node.get("id")
        for node in output_nodes
    ]

    rows = []

    for combination in itertools.product(
        [0, 1],
        repeat=len(input_nodes)
    ):

        current_inputs = {
            input_nodes[index]["id"]:
            combination[index]
            for index in range(
                len(input_nodes)
            )
        }

        simulation = simulate_circuit(
            nodes,
            connections,
            current_inputs
        )

        if not simulation["success"]:
            return {
                "success": False,
                "errors": simulation["errors"],
                "warnings": warnings,
                "input_headers": input_headers,
                "output_headers": output_headers,
                "rows": [],
            }

        row = {}

        for index, header in enumerate(
            input_headers
        ):
            row[header] = (
                combination[index]
            )

        for output_node in output_nodes:

            output_id = output_node["id"]

            output_label = (
                output_node.get("label")
                or output_id
            )

            row[output_label] = (
                simulation[
                    "node_values"
                ].get(
                    output_id,
                    0
                )
            )

        rows.append(row)

    return {
        "success": True,
        "errors": [],
        "warnings": warnings,
        "input_headers": input_headers,
        "output_headers": output_headers,
        "rows": rows,
    }


# ============================================================
# BOOLEAN EXPRESSION
# ============================================================

def generate_boolean_expression(
    nodes,
    connections
):
    """
    Generates Boolean expressions recursively.

    Supports:
    - Basic gates
    - Adders
    - MUX / DEMUX
    - Decoder
    - Encoder
    """

    is_valid, errors, _ = (
        validate_circuit(
            nodes,
            connections
        )
    )

    if not is_valid:
        return {
            "success": False,
            "expressions": {},
            "errors": errors,
        }

    node_map = {
        node["id"]: node
        for node in nodes
    }

    incoming = defaultdict(list)

    for conn in connections:

        incoming[
            conn.get("toNode")
        ].append(conn)

    visiting = set()
    cache = {}

    def expr_for_input_connection(conn):
        return build_expr(
            conn.get("fromNode"),
            conn.get("fromPort", "out")
        )

    def build_expr(
        node_id,
        requested_port="out"
    ):

        cache_key = (
            node_id,
            requested_port
        )

        if cache_key in cache:
            return cache[
                cache_key
            ]

        if node_id in visiting:
            return {
                "verbose": "CYCLE",
                "standard": "CYCLE",
            }

        node = node_map.get(node_id)

        if not node:
            return {
                "verbose": "0",
                "standard": "0",
            }

        node_type = str(
            node.get("type", "")
        ).upper()

        label = (
            node.get("label")
            or node_id
        )

        # ----------------------------------------------------
        # INPUT
        # ----------------------------------------------------

        if node_type == "INPUT":

            result = {
                "verbose": label,
                "standard": label,
            }

            cache[cache_key] = result

            return result

        visiting.add(node_id)

        incoming_connections = (
            incoming.get(
                node_id,
                []
            )
        )

        # ----------------------------------------------------
        # OUTPUT
        # ----------------------------------------------------

        if node_type == "OUTPUT":

            if not incoming_connections:
                result = {
                    "verbose": "0",
                    "standard": "0",
                }

            else:

                source_conn = (
                    incoming_connections[0]
                )

                result = build_expr(
                    source_conn.get(
                        "fromNode"
                    ),
                    source_conn.get(
                        "fromPort",
                        "out"
                    )
                )

            visiting.remove(node_id)

            cache[cache_key] = result

            return result

        # ----------------------------------------------------
        # BUILD INPUT EXPRESSIONS BY PORT
        # ----------------------------------------------------

        port_expr = {}

        for conn in incoming_connections:

            target_port = conn.get(
                "toPort"
            )

            port_expr[
                target_port
            ] = expr_for_input_connection(
                conn
            )

        # Helper
        def v(port):
            return port_expr.get(
                port,
                {
                    "verbose": "0",
                    "standard": "0",
                }
            )

        # ----------------------------------------------------
        # BASIC GATES
        # ----------------------------------------------------

        if node_type == "NOT":

            a = v("in")

            result = {
                "verbose":
                    f"NOT({a['verbose']})",

                "standard":
                    f"({a['standard']})'",
            }

        elif node_type in {
            "AND",
            "OR",
            "NAND",
            "NOR",
            "XOR",
            "XNOR",
        }:

            input_ports = get_component_spec(
                node
            )["inputs"]

            expressions = [
                v(port)
                for port in input_ports
            ]

            verbose_values = [
                item["verbose"]
                for item in expressions
            ]

            standard_values = [
                item["standard"]
                for item in expressions
            ]

            if node_type == "AND":

                result = {
                    "verbose":
                        "("
                        + " AND ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " · ".join(
                            standard_values
                        )
                        + ")",
                }

            elif node_type == "OR":

                result = {
                    "verbose":
                        "("
                        + " OR ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " + ".join(
                            standard_values
                        )
                        + ")",
                }

            elif node_type == "NAND":

                result = {
                    "verbose":
                        "NOT("
                        + " AND ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " · ".join(
                            standard_values
                        )
                        + ")'",
                }

            elif node_type == "NOR":

                result = {
                    "verbose":
                        "NOT("
                        + " OR ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " + ".join(
                            standard_values
                        )
                        + ")'",
                }

            elif node_type == "XOR":

                result = {
                    "verbose":
                        "("
                        + " XOR ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " ⊕ ".join(
                            standard_values
                        )
                        + ")",
                }

            else:  # XNOR

                result = {
                    "verbose":
                        "("
                        + " XNOR ".join(
                            verbose_values
                        )
                        + ")",

                    "standard":
                        "("
                        + " ⊙ ".join(
                            standard_values
                        )
                        + ")",
                }

        # ----------------------------------------------------
        # HALF ADDER
        # ----------------------------------------------------

        elif node_type == "HALF_ADDER":

            a = v("A")
            b = v("B")

            if requested_port == "SUM":

                result = {
                    "verbose":
                        f"({a['verbose']} XOR {b['verbose']})",

                    "standard":
                        f"({a['standard']} ⊕ {b['standard']})",
                }

            else:

                result = {
                    "verbose":
                        f"({a['verbose']} AND {b['verbose']})",

                    "standard":
                        f"({a['standard']} · {b['standard']})",
                }

        # ----------------------------------------------------
        # FULL ADDER
        # ----------------------------------------------------

        elif node_type == "FULL_ADDER":

            a = v("A")
            b = v("B")
            cin = v("CIN")

            if requested_port == "SUM":

                result = {
                    "verbose":
                        f"({a['verbose']} XOR "
                        f"{b['verbose']} XOR "
                        f"{cin['verbose']})",

                    "standard":
                        f"({a['standard']} ⊕ "
                        f"{b['standard']} ⊕ "
                        f"{cin['standard']})",
                }

            else:

                result = {
                    "verbose":
                        f"(({a['verbose']} AND {b['verbose']}) "
                        f"OR ({a['verbose']} AND {cin['verbose']}) "
                        f"OR ({b['verbose']} AND {cin['verbose']}))",

                    "standard":
                        f"(({a['standard']} · {b['standard']}) + "
                        f"({a['standard']} · {cin['standard']}) + "
                        f"({b['standard']} · {cin['standard']}))",
                }

        # ----------------------------------------------------
        # 2:1 MUX
        # ----------------------------------------------------

        elif node_type == "MUX_2_1":

            i0 = v("I0")
            i1 = v("I1")
            s = v("S")

            result = {
                "verbose":
                    f"((NOT {s['verbose']} AND {i0['verbose']}) "
                    f"OR ({s['verbose']} AND {i1['verbose']}))",

                "standard":
                    f"({s['standard']}' · {i0['standard']} + "
                    f"{s['standard']} · {i1['standard']})",
            }

        # ----------------------------------------------------
        # 4:1 MUX
        # ----------------------------------------------------

        elif node_type == "MUX_4_1":

            i0 = v("I0")
            i1 = v("I1")
            i2 = v("I2")
            i3 = v("I3")

            s0 = v("S0")
            s1 = v("S1")

            result = {
                "verbose":
                    "4:1 MUX output",

                "standard":
                    "("
                    f"{s1['standard']}' · {s0['standard']}' · {i0['standard']} + "
                    f"{s1['standard']}' · {s0['standard']} · {i1['standard']} + "
                    f"{s1['standard']} · {s0['standard']}' · {i2['standard']} + "
                    f"{s1['standard']} · {s0['standard']} · {i3['standard']}"
                    ")",
            }

        # ----------------------------------------------------
        # 1:2 DEMUX
        # ----------------------------------------------------

        elif node_type == "DEMUX_1_2":

            d = v("D")
            s = v("S")

            if requested_port == "Y0":

                result = {
                    "verbose":
                        f"({d['verbose']} AND NOT {s['verbose']})",

                    "standard":
                        f"({d['standard']} · {s['standard']}')",
                }

            else:

                result = {
                    "verbose":
                        f"({d['verbose']} AND {s['verbose']})",

                    "standard":
                        f"({d['standard']} · {s['standard']})",
                }

        # ----------------------------------------------------
        # 1:4 DEMUX
        # ----------------------------------------------------

        elif node_type == "DEMUX_1_4":

            d = v("D")
            s0 = v("S0")
            s1 = v("S1")

            index = {
                "Y0": f"{s1['standard']}' · {s0['standard']}'",
                "Y1": f"{s1['standard']}' · {s0['standard']}",
                "Y2": f"{s1['standard']} · {s0['standard']}'",
                "Y3": f"{s1['standard']} · {s0['standard']}",
            }.get(
                requested_port,
                "0"
            )

            result = {
                "verbose":
                    f"({d['verbose']} AND {requested_port})",

                "standard":
                    f"({d['standard']} · {index})",
            }

        # ----------------------------------------------------
        # DECODER
        # ----------------------------------------------------

        elif node_type in {
            "DECODER_2_4",
            "DECODER_3_8",
            "DECODER_4_16",
        }:

            inputs = COMPONENT_PORTS[
                node_type
            ]["inputs"]

            literals = []

            output_number = int(
                requested_port[1:]
            )

            for bit_index, port in enumerate(
                inputs
            ):

                bit_position = (
                    len(inputs)
                    - 1
                    - bit_index
                )

                bit_value = (
                    output_number
                    >> bit_position
                ) & 1

                expression = v(
                    port
                )

                if bit_value == 1:

                    literals.append(
                        expression[
                            "standard"
                        ]
                    )

                else:

                    literals.append(
                        f"{expression['standard']}'"
                    )

            result = {
                "verbose":
                    "Decoder output",

                "standard":
                    "("
                    + " · ".join(literals)
                    + ")",
            }

        # ----------------------------------------------------
        # ENCODER
        # ----------------------------------------------------

        elif node_type in {
            "ENCODER_4_2",
            "ENCODER_8_3",
        }:

            output_bit = (
                ["A", "B"].index(
                    requested_port
                )
                if node_type
                == "ENCODER_4_2"
                else ["A", "B", "C"].index(
                    requested_port
                )
            )

            terms = []

            count = (
                4
                if node_type
                == "ENCODER_4_2"
                else 8
            )

            for index in range(count):

                bit_count = (
                    2
                    if node_type
                    == "ENCODER_4_2"
                    else 3
                )

                bit = (
                    index
                    >> (
                        bit_count
                        - 1
                        - output_bit
                    )
                ) & 1

                if bit == 1:

                    input_port = f"I{index}"

                    terms.append(
                        v(input_port)[
                            "standard"
                        ]
                    )

            result = {
                "verbose":
                    f"{node_type} {requested_port}",

                "standard":
                    " + ".join(terms)
                    if terms
                    else "0",
            }

        else:

            result = {
                "verbose": label,
                "standard": label,
            }

        visiting.remove(node_id)

        cache[cache_key] = result

        return result

    output_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "OUTPUT"
    ]

    results = {}

    for output_node in output_nodes:

        output_label = (
            output_node.get("label")
            or output_node["id"]
        )

        output_connection = (
            incoming.get(
                output_node["id"],
                []
            )
        )

        if output_connection:

            connection = (
                output_connection[0]
            )

            results[
                output_label
            ] = build_expr(
                connection.get(
                    "fromNode"
                ),
                connection.get(
                    "fromPort",
                    "out"
                )
            )

        else:

            results[
                output_label
            ] = {
                "verbose": "0",
                "standard": "0",
            }

    return {
        "success": True,
        "expressions": results,
        "errors": [],
    }


# ============================================================
# QUINE-MCCLUSKEY
# ============================================================

def quine_mccluskey(
    num_vars,
    minterms,
    var_names
):
    """
    Minimal Sum-of-Products expression.
    """

    if not minterms:
        return "0", []

    if len(minterms) == (
        1 << num_vars
    ):
        return "1", []

    groups = defaultdict(set)

    for minterm in minterms:

        binary = format(
            minterm,
            f"0{num_vars}b"
        )

        groups[
            binary.count("1")
        ].add(binary)

    prime_implicants = set()
    current_groups = groups

    while current_groups:

        next_groups = defaultdict(set)
        combined = set()

        sorted_keys = sorted(
            current_groups.keys()
        )

        for i in range(
            len(sorted_keys) - 1
        ):

            k1 = sorted_keys[i]
            k2 = sorted_keys[i + 1]

            if k2 - k1 != 1:
                continue

            for term1 in current_groups[k1]:

                for term2 in current_groups[k2]:

                    diff_index = -1
                    valid = True

                    for bit_index in range(
                        num_vars
                    ):

                        if (
                            term1[bit_index]
                            != term2[bit_index]
                        ):

                            if diff_index == -1:
                                diff_index = (
                                    bit_index
                                )
                            else:
                                valid = False
                                break

                    if (
                        valid
                        and diff_index != -1
                    ):

                        merged = (
                            term1[:diff_index]
                            + "-"
                            + term1[
                                diff_index + 1:
                            ]
                        )

                        next_groups[k1].add(
                            merged
                        )

                        combined.add(term1)
                        combined.add(term2)

        for group in current_groups.values():

            for term in group:

                if term not in combined:
                    prime_implicants.add(
                        term
                    )

        current_groups = next_groups

    if not prime_implicants:
        return "0", []

    terms = []

    for prime in sorted(
        prime_implicants
    ):

        literals = []

        for index, bit in enumerate(
            prime
        ):

            if bit == "1":
                literals.append(
                    var_names[index]
                )

            elif bit == "0":
                literals.append(
                    f"{var_names[index]}'"
                )

        if literals:
            terms.append(
                " · ".join(literals)
            )
        else:
            terms.append("1")

    expression = (
        " + ".join(terms)
        if terms
        else "0"
    )

    return (
        expression,
        sorted(prime_implicants)
    )


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(
    nodes,
    connections
):
    """
    Calculates circuit metrics.

    gate_count counts every non-INPUT / non-OUTPUT
    logic component as one component.
    """

    logic_components = {
        node["id"]
        for node in nodes
        if str(
            node.get("type", "")
        ).upper()
        not in {
            "INPUT",
            "OUTPUT",
        }
    }

    input_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "INPUT"
    ]

    output_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "OUTPUT"
    ]

    graph = defaultdict(list)

    for conn in connections:

        src = conn.get("fromNode")
        dst = conn.get("toNode")

        if src and dst:
            graph[src].append(dst)

    levels = {
        node["id"]: 0
        for node in nodes
    }

    depth = 0

    try:

        order = topological_sort(
            nodes,
            connections
        )

        for current in order:

            current_node = next(
                (
                    node
                    for node in nodes
                    if node["id"]
                    == current
                ),
                None
            )

            current_type = (
                str(
                    current_node.get(
                        "type",
                        ""
                    )
                ).upper()
                if current_node
                else ""
            )

            weight = (
                1
                if current_type
                not in {
                    "INPUT",
                    "OUTPUT",
                }
                else 0
            )

            for target in graph[
                current
            ]:

                levels[target] = max(
                    levels.get(
                        target,
                        0
                    ),
                    levels[current]
                    + weight
                )

        depth = (
            max(levels.values())
            if levels
            else 0
        )

    except Exception:
        depth = 0

    return {
        "gate_count": len(
            logic_components
        ),

        "connection_count":
            len(connections),

        "circuit_depth":
            depth,

        "input_count":
            len(input_nodes),

        "output_count":
            len(output_nodes),
    }


# ============================================================
# OPTIMIZATION
# ============================================================

def optimize_circuit(
    nodes,
    connections
):
    """
    Performs Boolean minimization using the
    generated truth table.
    """

    is_valid, errors, _ = (
        validate_circuit(
            nodes,
            connections
        )
    )

    if not is_valid:
        return {
            "success": False,
            "can_optimize": False,
            "message":
                "Circuit is invalid: "
                + "; ".join(errors),

            "original_metrics":
                calculate_metrics(
                    nodes,
                    connections
                ),
        }

    input_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "INPUT"
    ]

    output_nodes = [
        node
        for node in nodes
        if str(
            node.get("type", "")
        ).upper() == "OUTPUT"
    ]

    if not input_nodes or not output_nodes:
        return {
            "success": False,
            "can_optimize": False,
            "message":
                "Circuit must contain at least "
                "one INPUT and one OUTPUT.",
            "original_metrics":
                calculate_metrics(
                    nodes,
                    connections
                ),
        }

    expression_result = (
        generate_boolean_expression(
            nodes,
            connections
        )
    )

    first_output = output_nodes[0]

    first_output_label = (
        first_output.get("label")
        or first_output["id"]
    )

    original_expression = (
        expression_result
        .get("expressions", {})
        .get(
            first_output_label,
            {}
        )
        .get(
            "standard",
            ""
        )
    )

    truth_table = generate_truth_table(
        nodes,
        connections
    )

    if not truth_table["success"]:
        return {
            "success": False,
            "can_optimize": False,
            "message":
                "Could not generate truth table "
                "for optimization.",
        }

    variables = truth_table[
        "input_headers"
    ]

    num_variables = len(
        variables
    )

    minterms = []

    for row_index, row in enumerate(
        truth_table["rows"]
    ):

        if row.get(
            first_output_label,
            0
        ) == 1:

            minterms.append(
                row_index
            )

    simplified_expression, prime_implicants = (
        quine_mccluskey(
            num_variables,
            minterms,
            variables
        )
    )

    original_metrics = (
        calculate_metrics(
            nodes,
            connections
        )
    )

    steps = [
        (
            f"Evaluated the circuit across "
            f"{len(truth_table['rows'])} "
            f"input combinations."
        ),
        (
            f"Found {len(minterms)} "
            f"true states for output "
            f"'{first_output_label}'."
        ),
        (
            "Applied Quine-McCluskey "
            "Boolean minimization."
        ),
    ]

    # --------------------------------------------------------
    # BUILD OPTIMIZED GRAPH
    # --------------------------------------------------------

    optimized_nodes = []
    optimized_connections = []

    input_id_map = {}

    for index, variable in enumerate(
        variables
    ):

        optimized_id = (
            f"opt_in_{variable}"
        )

        input_id_map[
            variable
        ] = optimized_id

        optimized_nodes.append({
            "id":
                optimized_id,

            "type":
                "INPUT",

            "label":
                variable,

            "x":
                80,

            "y":
                100 + index * 80,

            "state":
                0,

            "inputPorts":
                [],

            "outputPorts":
                ["out"],
        })

    output_id = "opt_out_1"

    optimized_nodes.append({
        "id":
            output_id,

        "type":
            "OUTPUT",

        "label":
            first_output_label,

        "x":
            760,

        "y":
            200,

        "state":
            0,

        "inputPorts":
            ["in"],

        "outputPorts":
            [],
    })

    connection_counter = 0

    # --------------------------------------------------------
    # CONSTANT 0
    # --------------------------------------------------------

    if simplified_expression == "0":

        # Implement constant zero as:
        # A AND NOT(A)

        variable = variables[0]

        input_id = input_id_map[
            variable
        ]

        not_id = "opt_const_not"
        and_id = "opt_const_and"

        optimized_nodes.append({
            "id": not_id,
            "type": "NOT",
            "label": "NOT",
            "x": 280,
            "y": 180,
            "inputPorts": ["in"],
            "outputPorts": ["out"],
        })

        optimized_nodes.append({
            "id": and_id,
            "type": "AND",
            "label": "AND",
            "x": 480,
            "y": 200,
            "inputPorts": [
                "in1",
                "in2",
            ],
            "outputPorts": ["out"],
        })

        optimized_connections.extend([
            {
                "id": "opt_c1",
                "fromNode": input_id,
                "fromPort": "out",
                "toNode": not_id,
                "toPort": "in",
            },
            {
                "id": "opt_c2",
                "fromNode": input_id,
                "fromPort": "out",
                "toNode": and_id,
                "toPort": "in1",
            },
            {
                "id": "opt_c3",
                "fromNode": not_id,
                "fromPort": "out",
                "toNode": and_id,
                "toPort": "in2",
            },
            {
                "id": "opt_c4",
                "fromNode": and_id,
                "fromPort": "out",
                "toNode": output_id,
                "toPort": "in",
            },
        ])

        steps.append(
            "The output is always 0."
        )

    # --------------------------------------------------------
    # CONSTANT 1
    # --------------------------------------------------------

    elif simplified_expression == "1":

        variable = variables[0]

        input_id = input_id_map[
            variable
        ]

        not_id = "opt_const_not"
        or_id = "opt_const_or"

        optimized_nodes.append({
            "id": not_id,
            "type": "NOT",
            "label": "NOT",
            "x": 280,
            "y": 180,
            "inputPorts": ["in"],
            "outputPorts": ["out"],
        })

        optimized_nodes.append({
            "id": or_id,
            "type": "OR",
            "label": "OR",
            "x": 480,
            "y": 200,
            "inputPorts": [
                "in1",
                "in2",
            ],
            "outputPorts": ["out"],
        })

        optimized_connections.extend([
            {
                "id": "opt_c1",
                "fromNode": input_id,
                "fromPort": "out",
                "toNode": not_id,
                "toPort": "in",
            },
            {
                "id": "opt_c2",
                "fromNode": input_id,
                "fromPort": "out",
                "toNode": or_id,
                "toPort": "in1",
            },
            {
                "id": "opt_c3",
                "fromNode": not_id,
                "fromPort": "out",
                "toNode": or_id,
                "toPort": "in2",
            },
            {
                "id": "opt_c4",
                "fromNode": or_id,
                "fromPort": "out",
                "toNode": output_id,
                "toPort": "in",
            },
        ])

        steps.append(
            "The output is always 1."
        )

    # --------------------------------------------------------
    # NORMAL SOP
    # --------------------------------------------------------

    else:

        or_sources = []

        not_gate_map = {}

        gate_y = 100

        # -------------------------
        # NOT GATES
        # -------------------------

        for prime in prime_implicants:

            for index, bit in enumerate(
                prime
            ):

                variable = variables[
                    index
                ]

                if (
                    bit == "0"
                    and variable
                    not in not_gate_map
                ):

                    not_id = (
                        f"opt_not_{variable}"
                    )

                    not_gate_map[
                        variable
                    ] = not_id

                    optimized_nodes.append({
                        "id":
                            not_id,

                        "type":
                            "NOT",

                        "label":
                            f"NOT({variable})",

                        "x":
                            220,

                        "y":
                            80 + len(
                                not_gate_map
                            ) * 70,

                        "inputPorts":
                            ["in"],

                        "outputPorts":
                            ["out"],
                    })

                    connection_counter += 1

                    optimized_connections.append({
                        "id":
                            f"opt_c_{connection_counter}",

                        "fromNode":
                            input_id_map[
                                variable
                            ],

                        "fromPort":
                            "out",

                        "toNode":
                            not_id,

                        "toPort":
                            "in",
                    })

        # -------------------------
        # PRODUCT TERMS
        # -------------------------

        for prime_index, prime in enumerate(
            prime_implicants
        ):

            literals = []

            for index, bit in enumerate(
                prime
            ):

                variable = variables[
                    index
                ]

                if bit == "1":

                    literals.append(
                        input_id_map[
                            variable
                        ]
                    )

                elif bit == "0":

                    literals.append(
                        not_gate_map[
                            variable
                        ]
                    )

            # Single literal
            if len(literals) == 1:

                or_sources.append(
                    literals[0]
                )

            # Two literals
            elif len(literals) == 2:

                and_id = (
                    f"opt_and_{prime_index}"
                )

                optimized_nodes.append({
                    "id":
                        and_id,

                    "type":
                        "AND",

                    "label":
                        "AND",

                    "x":
                        420,

                    "y":
                        gate_y,

                    "inputPorts":
                        [
                            "in1",
                            "in2",
                        ],

                    "outputPorts":
                        ["out"],
                })

                gate_y += 85

                for literal_index, source_id in enumerate(
                    literals
                ):

                    connection_counter += 1

                    optimized_connections.append({
                        "id":
                            f"opt_c_{connection_counter}",

                        "fromNode":
                            source_id,

                        "fromPort":
                            "out",

                        "toNode":
                            and_id,

                        "toPort":
                            (
                                "in1"
                                if literal_index == 0
                                else "in2"
                            ),
                    })

                or_sources.append(
                    and_id
                )

        # -------------------------
        # FINAL OR
        # -------------------------

        if len(or_sources) == 1:

            connection_counter += 1

            optimized_connections.append({
                "id":
                    f"opt_c_{connection_counter}",

                "fromNode":
                    or_sources[0],

                "fromPort":
                    "out",

                "toNode":
                    output_id,

                "toPort":
                    "in",
            })

        elif len(or_sources) >= 2:

            # Build OR tree using 2-input OR gates
            current_sources = list(
                or_sources
            )

            level = 0

            while len(
                current_sources
            ) > 1:

                next_sources = []

                index = 0

                while index < len(
                    current_sources
                ):

                    if (
                        index + 1
                        >= len(
                            current_sources
                        )
                    ):

                        next_sources.append(
                            current_sources[
                                index
                            ]
                        )

                        index += 1
                        continue

                    or_id = (
                        f"opt_or_{level}_{index}"
                    )

                    optimized_nodes.append({
                        "id":
                            or_id,

                        "type":
                            "OR",

                        "label":
                            "OR",

                        "x":
                            620,

                        "y":
                            150 + level * 100,

                        "inputPorts":
                            [
                                "in1",
                                "in2",
                            ],

                        "outputPorts":
                            ["out"],
                    })

                    connection_counter += 1

                    optimized_connections.append({
                        "id":
                            f"opt_c_{connection_counter}",

                        "fromNode":
                            current_sources[
                                index
                            ],

                        "fromPort":
                            "out",

                        "toNode":
                            or_id,

                        "toPort":
                            "in1",
                    })

                    connection_counter += 1

                    optimized_connections.append({
                        "id":
                            f"opt_c_{connection_counter}",

                        "fromNode":
                            current_sources[
                                index + 1
                            ],

                        "fromPort":
                            "out",

                        "toNode":
                            or_id,

                        "toPort":
                            "in2",
                    })

                    next_sources.append(
                        or_id
                    )

                    index += 2

                current_sources = (
                    next_sources
                )

                level += 1

            connection_counter += 1

            optimized_connections.append({
                "id":
                    f"opt_c_{connection_counter}",

                "fromNode":
                    current_sources[0],

                "fromPort":
                    "out",

                "toNode":
                    output_id,

                "toPort":
                    "in",
            })

    optimized_metrics = (
        calculate_metrics(
            optimized_nodes,
            optimized_connections
        )
    )

    improved = (
        optimized_metrics[
            "gate_count"
        ]
        <
        original_metrics[
            "gate_count"
        ]
        or
        optimized_metrics[
            "connection_count"
        ]
        <
        original_metrics[
            "connection_count"
        ]
        or
        optimized_metrics[
            "circuit_depth"
        ]
        <
        original_metrics[
            "circuit_depth"
        ]
    )

    if improved:

        difference = (
            original_metrics[
                "gate_count"
            ]
            -
            optimized_metrics[
                "gate_count"
            ]
        )

        message = (
            "Successfully simplified "
            f"the circuit: "
            f"{original_metrics['gate_count']} "
            f"components → "
            f"{optimized_metrics['gate_count']}."
        )

        steps.append(
            f"Component reduction: {difference}."
        )

    else:

        message = (
            "No further simplification "
            "was found."
        )

        steps.append(
            "The circuit is already minimal "
            "or canonical according to the "
            "current Boolean minimization."
        )

    return {
        "success": True,

        "can_optimize":
            improved,

        "message":
            message,

        "original_expression":
            original_expression
            or simplified_expression,

        "simplified_expression":
            simplified_expression,

        "explanation_steps":
            steps,

        "original_metrics":
            original_metrics,

        "optimized_metrics":
            optimized_metrics,

        "optimized_circuit": {
            "nodes":
                optimized_nodes,

            "connections":
                optimized_connections,
        },
    }