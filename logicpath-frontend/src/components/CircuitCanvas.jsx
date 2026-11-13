import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/client";
import "../pages/Build.css";
import "./CircuitCanvas.css";

/* =========================================================
   CIRCUIT COMPONENT SPECIFICATIONS
   ========================================================= */

const GATE_SPECS = {
  INPUT: {
    label: "IN",
    inputs: 0,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    width: 85,
    height: 48,
    defaultName: "IN",
    category: "basic",
  },

  OUTPUT: {
    label: "OUT",
    inputs: 1,
    outputs: 0,
    inputPorts: ["in"],
    outputPorts: [],
    width: 85,
    height: 48,
    defaultName: "OUT",
    category: "basic",
  },

  NOT: {
    label: "NOT",
    inputs: 1,
    outputs: 1,
    inputPorts: ["in"],
    outputPorts: ["out"],
    width: 100,
    height: 56,
    defaultName: "NOT",
    category: "basic",
  },

  AND: {
    label: "AND",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 110,
    height: 60,
    defaultName: "AND",
    category: "basic",
  },

  OR: {
    label: "OR",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 110,
    height: 60,
    defaultName: "OR",
    category: "basic",
  },

  NAND: {
    label: "NAND",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 115,
    height: 60,
    defaultName: "NAND",
    category: "basic",
  },

  NOR: {
    label: "NOR",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 110,
    height: 60,
    defaultName: "NOR",
    category: "basic",
  },

  XOR: {
    label: "XOR",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 110,
    height: 60,
    defaultName: "XOR",
    category: "basic",
  },

  XNOR: {
    label: "XNOR",
    inputs: 2,
    minInputs: 2,
    maxInputs: 8,
    variableInputs: true,
    outputs: 1,
    inputPorts: ["in1", "in2"],
    outputPorts: ["out"],
    width: 115,
    height: 60,
    defaultName: "XNOR",
    category: "basic",
  },

  HALF_ADDER: {
    label: "HALF ADDER",
    inputs: 2,
    outputs: 2,
    inputPorts: ["A", "B"],
    outputPorts: ["SUM", "CARRY"],
    width: 145,
    height: 100,
    defaultName: "HALF ADDER",
    category: "combinational",
  },

  FULL_ADDER: {
    label: "FULL ADDER",
    inputs: 3,
    outputs: 2,
    inputPorts: ["A", "B", "CIN"],
    outputPorts: ["SUM", "COUT"],
    width: 145,
    height: 120,
    defaultName: "FULL ADDER",
    category: "combinational",
  },

  MUX_2_1: {
    label: "2:1 MUX",
    inputs: 3,
    outputs: 1,
    inputPorts: ["I0", "I1", "S"],
    outputPorts: ["Y"],
    width: 135,
    height: 100,
    defaultName: "2:1 MUX",
    category: "combinational",
  },

  MUX_4_1: {
    label: "4:1 MUX",
    inputs: 6,
    outputs: 1,
    inputPorts: ["I0", "I1", "I2", "I3", "S0", "S1"],
    outputPorts: ["Y"],
    width: 145,
    height: 150,
    defaultName: "4:1 MUX",
    category: "combinational",
  },

  DEMUX_1_2: {
    label: "1:2 DEMUX",
    inputs: 2,
    outputs: 2,
    inputPorts: ["D", "S"],
    outputPorts: ["Y0", "Y1"],
    width: 145,
    height: 100,
    defaultName: "1:2 DEMUX",
    category: "combinational",
  },

  DEMUX_1_4: {
    label: "1:4 DEMUX",
    inputs: 3,
    outputs: 4,
    inputPorts: ["D", "S0", "S1"],
    outputPorts: ["Y0", "Y1", "Y2", "Y3"],
    width: 155,
    height: 150,
    defaultName: "1:4 DEMUX",
    category: "combinational",
  },

  DECODER_2_4: {
    label: "2:4 DECODER",
    inputs: 2,
    outputs: 4,
    inputPorts: ["A", "B"],
    outputPorts: ["Y0", "Y1", "Y2", "Y3"],
    width: 150,
    height: 140,
    defaultName: "2:4 DECODER",
    category: "combinational",
  },

  DECODER_3_8: {
    label: "3:8 DECODER",
    inputs: 3,
    outputs: 8,
    inputPorts: ["A", "B", "C"],
    outputPorts: [
      "Y0",
      "Y1",
      "Y2",
      "Y3",
      "Y4",
      "Y5",
      "Y6",
      "Y7",
    ],
    width: 165,
    height: 220,
    defaultName: "3:8 DECODER",
    category: "combinational",
  },

  DECODER_4_16: {
    label: "4:16 DECODER",
    inputs: 4,
    outputs: 16,
    inputPorts: ["A", "B", "C", "D"],
    outputPorts: [
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
    width: 180,
    height: 360,
    defaultName: "4:16 DECODER",
    category: "combinational",
  },

  ENCODER_4_2: {
    label: "4:2 ENCODER",
    inputs: 4,
    outputs: 2,
    inputPorts: ["I0", "I1", "I2", "I3"],
    outputPorts: ["A", "B"],
    width: 150,
    height: 140,
    defaultName: "4:2 ENCODER",
    category: "combinational",
  },

  ENCODER_8_3: {
    label: "8:3 ENCODER",
    inputs: 8,
    outputs: 3,
    inputPorts: [
      "I0",
      "I1",
      "I2",
      "I3",
      "I4",
      "I5",
      "I6",
      "I7",
    ],
    outputPorts: ["A", "B", "C"],
    width: 165,
    height: 220,
    defaultName: "8:3 ENCODER",
    category: "combinational",
  },
};

/* =========================================================
   PALETTE GROUPS
   ========================================================= */

const BASIC_COMPONENTS = [
  "INPUT",
  "OUTPUT",
  "NOT",
  "AND",
  "OR",
  "NAND",
  "NOR",
  "XOR",
  "XNOR",
];

const COMBINATIONAL_COMPONENTS = [
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
];

/* =========================================================
   DISPLAY LABELS
   ========================================================= */

const DISPLAY_NAMES = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT",
  NOT: "NOT",
  AND: "AND",
  OR: "OR",
  NAND: "NAND",
  NOR: "NOR",
  XOR: "XOR",
  XNOR: "XNOR",
  HALF_ADDER: "HALF ADDER",
  FULL_ADDER: "FULL ADDER",
  MUX_2_1: "2:1 MUX",
  MUX_4_1: "4:1 MUX",
  DEMUX_1_2: "1:2 DEMUX",
  DEMUX_1_4: "1:4 DEMUX",
  DECODER_2_4: "2:4 DECODER",
  DECODER_3_8: "3:8 DECODER",
  DECODER_4_16: "4:16 DECODER",
  ENCODER_4_2: "4:2 ENCODER",
  ENCODER_8_3: "8:3 ENCODER",
};

/* =========================================================
   COMPONENT
   ========================================================= */

export function CircuitCanvas({
  nodes = [],
  connections = [],
  onChange,
  readOnly = false,
  height = "480px",
  showPalette = true,
  title = "Circuit Canvas",
  toolbarActions = null,
}) {
  const canvasRef = useRef(null);

  const [localNodes, setLocalNodes] = useState(nodes);
  const [localConns, setLocalConns] = useState(connections);

  const [simResults, setSimResults] = useState(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedConnId, setSelectedConnId] = useState(null);

  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0,
  });

  const [pendingWire, setPendingWire] = useState(null);

  /* =======================================================
     SYNC PROPS
     ======================================================= */

  useEffect(() => {
    setLocalNodes(Array.isArray(nodes) ? nodes : []);
  }, [nodes]);

  useEffect(() => {
    setLocalConns(Array.isArray(connections) ? connections : []);
  }, [connections]);

  /* =======================================================
     NOTIFY PARENT
     ======================================================= */

  const notifyChange = useCallback(
    (newNodes, newConns) => {
      if (onChange) {
        onChange(newNodes, newConns);
      }
    },
    [onChange]
  );

  /* =======================================================
     LIVE SIMULATION
     ======================================================= */

  const runLiveSimulation = useCallback(
    async (currentNodes, currentConns) => {
      if (
        !Array.isArray(currentNodes) ||
        currentNodes.length === 0
      ) {
        setSimResults(null);
        return;
      }

      try {
        const inVals = {};

        currentNodes
          .filter(
            (node) =>
              String(node.type).toUpperCase() === "INPUT"
          )
          .forEach((node) => {
            inVals[node.id] = node.state ?? 0;
          });

        const res = await api.simulateCircuit({
          nodes: currentNodes,
          connections: currentConns,
          input_values: inVals,
        });

        if (res?.success) {
          setSimResults(res);
        } else {
          setSimResults(null);
        }
      } catch (error) {
        console.warn(
          "Live simulation unavailable:",
          error
        );
        setSimResults(null);
      }
    },
    []
  );

  useEffect(() => {
    runLiveSimulation(localNodes, localConns);
  }, [localNodes, localConns, runLiveSimulation]);

  /* =======================================================
     HELPERS
     ======================================================= */

  const getSpec = (node) => {
    return GATE_SPECS[node?.type] || GATE_SPECS.AND;
  };

  const getInputPorts = (node) => {
    const spec = getSpec(node);

    if (
      spec.variableInputs &&
      Array.isArray(node?.inputPorts) &&
      node.inputPorts.length >= 2
    ) {
      return node.inputPorts;
    }

    return spec.inputPorts || [];
  };

  const getOutputPorts = (node) => {
    const spec = getSpec(node);
    return spec.outputPorts || [];
  };

  const getPortList = (node, isOutput) => {
    return isOutput
      ? getOutputPorts(node)
      : getInputPorts(node);
  };

  const getNodeDisplayName = (type) => {
    return DISPLAY_NAMES[type] || type;
  };

  const getNodeHeight = (node) => {
    const spec = getSpec(node);

    const inputCount = getInputPorts(node).length;
    const outputCount = getOutputPorts(node).length;

    const requiredHeight =
      Math.max(inputCount, outputCount) * 22 + 30;

    return Math.max(spec.height || 60, requiredHeight);
  };

  /* =======================================================
     SIGNAL VALUE
     ======================================================= */

  const getSignalValue = (
    node,
    portName = "out",
    isOutput = true
  ) => {
    if (!simResults) {
      return null;
    }

    if (isOutput) {
      const matchingConnection = localConns.find(
        (conn) =>
          conn.fromNode === node.id &&
          conn.fromPort === portName
      );

      if (
        matchingConnection &&
        simResults.wire_values
      ) {
        const wireValue =
          simResults.wire_values[
            matchingConnection.id
          ];

        if (wireValue === 0 || wireValue === 1) {
          return wireValue;
        }
      }
    }

    const nodeValue =
      simResults?.node_values?.[node.id];

    if (nodeValue === 0 || nodeValue === 1) {
      return nodeValue;
    }

    if (
      nodeValue &&
      typeof nodeValue === "object"
    ) {
      const value =
        nodeValue[portName] ??
        nodeValue[String(portName).toLowerCase()];

      if (value === 0 || value === 1) {
        return value;
      }
    }

    const outputValue =
      simResults?.output_values?.[node.id];

    if (outputValue === 0 || outputValue === 1) {
      return outputValue;
    }

    if (
      outputValue &&
      typeof outputValue === "object"
    ) {
      const value =
        outputValue[portName] ??
        outputValue[String(portName).toLowerCase()];

      if (value === 0 || value === 1) {
        return value;
      }
    }

    return null;
  };

  /* =======================================================
     ADD COMPONENT
     ======================================================= */

  const addGate = (type) => {
    if (readOnly) {
      return;
    }

    const spec =
      GATE_SPECS[type] || GATE_SPECS.AND;

    const sameTypeCount =
      localNodes.filter(
        (node) => node.type === type
      ).length + 1;

    let label;

    if (type === "INPUT") {
      const inputCount =
        localNodes.filter(
          (node) => node.type === "INPUT"
        ).length;

      label = String.fromCharCode(
        65 + (inputCount % 26)
      );
    } else if (type === "OUTPUT") {
      label =
        sameTypeCount === 1
          ? "OUT"
          : `OUT ${sameTypeCount}`;
    } else {
      label =
        sameTypeCount === 1
          ? spec.defaultName
          : `${spec.defaultName} ${sameTypeCount}`;
    }

    const spawnX =
      40 + (localNodes.length % 4) * 110;

    const spawnY =
      40 + (localNodes.length % 3) * 100;

    let initialInputPorts =
      spec.inputPorts || [];

    let initialInputCount =
      spec.inputs || initialInputPorts.length;

    if (spec.variableInputs) {
      initialInputCount = 2;

      initialInputPorts = Array.from(
        { length: initialInputCount },
        (_, index) => `in${index + 1}`
      );
    }

    const newNode = {
      id: `node_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      type,
      label,
      state: 0,
      x: spawnX,
      y: spawnY,
      inputCount: initialInputCount,
      inputPorts: initialInputPorts,
      outputPorts: spec.outputPorts || [],
    };

    const nextNodes = [
      ...localNodes,
      newNode,
    ];

    setLocalNodes(nextNodes);
    setSelectedNodeId(newNode.id);
    setSelectedConnId(null);

    notifyChange(nextNodes, localConns);
  };

  /* =======================================================
     CHANGE VARIABLE GATE INPUT COUNT
     ======================================================= */

  const changeGateInputCount = (
    nodeId,
    delta
  ) => {
    if (readOnly) {
      return;
    }

    const targetNode = localNodes.find(
      (node) => node.id === nodeId
    );

    if (!targetNode) {
      return;
    }

    const spec = getSpec(targetNode);

    if (!spec.variableInputs) {
      return;
    }

    const currentCount =
      Array.isArray(targetNode.inputPorts)
        ? targetNode.inputPorts.length
        : 2;

    const minInputs = spec.minInputs || 2;
    const maxInputs = spec.maxInputs || 8;

    const nextCount = Math.max(
      minInputs,
      Math.min(
        maxInputs,
        currentCount + delta
      )
    );

    if (nextCount === currentCount) {
      return;
    }

    const nextPorts = Array.from(
      { length: nextCount },
      (_, index) => `in${index + 1}`
    );

    const nextNodes = localNodes.map(
      (node) =>
        node.id === nodeId
          ? {
              ...node,
              inputCount: nextCount,
              inputPorts: nextPorts,
            }
          : node
    );

    const oldPorts =
      Array.isArray(targetNode.inputPorts)
        ? targetNode.inputPorts
        : ["in1", "in2"];

    const removedPorts = oldPorts.filter(
      (port) => !nextPorts.includes(port)
    );

    const nextConns = localConns.filter(
      (connection) =>
        !(
          connection.toNode === nodeId &&
          removedPorts.includes(
            connection.toPort
          )
        )
    );

    setLocalNodes(nextNodes);
    setLocalConns(nextConns);

    notifyChange(
      nextNodes,
      nextConns
    );
  };

  /* =======================================================
     DELETE
     ======================================================= */

  const deleteSelected = () => {
    if (readOnly) {
      return;
    }

    if (selectedNodeId) {
      const nextNodes = localNodes.filter(
        (node) => node.id !== selectedNodeId
      );

      const nextConns = localConns.filter(
        (conn) =>
          conn.fromNode !== selectedNodeId &&
          conn.toNode !== selectedNodeId
      );

      setLocalNodes(nextNodes);
      setLocalConns(nextConns);
      setSelectedNodeId(null);
      setSelectedConnId(null);

      notifyChange(
        nextNodes,
        nextConns
      );

      return;
    }

    if (selectedConnId) {
      const nextConns = localConns.filter(
        (conn) => conn.id !== selectedConnId
      );

      setLocalConns(nextConns);
      setSelectedConnId(null);

      notifyChange(
        localNodes,
        nextConns
      );
    }
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const clearCanvas = () => {
    if (readOnly) {
      return;
    }

    if (
      window.confirm(
        "Clear this circuit canvas?"
      )
    ) {
      setLocalNodes([]);
      setLocalConns([]);
      setSelectedNodeId(null);
      setSelectedConnId(null);
      setPendingWire(null);
      setSimResults(null);

      notifyChange([], []);
    }
  };

  /* =======================================================
     TOGGLE INPUT STATE
     ======================================================= */

  const toggleInputState = (
    nodeId,
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const nextNodes = localNodes.map(
      (node) =>
        node.id === nodeId
          ? {
              ...node,
              state:
                node.state === 1
                  ? 0
                  : 1,
            }
          : node
    );

    setLocalNodes(nextNodes);

    notifyChange(
      nextNodes,
      localConns
    );
  };

  /* =======================================================
     DRAG NODE
     ======================================================= */

  const handleNodeMouseDown = (
    node,
    event
  ) => {
    if (
      event.button !== 0 ||
      readOnly
    ) {
      return;
    }

    /*
      IMPORTANT:
      Never start dragging when the user is
      interacting with a connection port.
    */
    if (
      event.target.closest &&
      event.target.closest(".port-circle")
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setSelectedNodeId(node.id);
    setSelectedConnId(null);

    const canvasRect =
      canvasRef.current?.getBoundingClientRect();

    if (!canvasRect) {
      return;
    }

    setDraggingNodeId(node.id);

    setDragOffset({
      x:
        event.clientX -
        canvasRect.left -
        node.x,
      y:
        event.clientY -
        canvasRect.top -
        node.y,
    });
  };

  /* =======================================================
     CANVAS MOVE
     ======================================================= */

  const handleCanvasMouseMove = (
    event
  ) => {
    if (readOnly) {
      return;
    }

    const canvasRect =
      canvasRef.current?.getBoundingClientRect();

    if (!canvasRect) {
      return;
    }

    const mouseX =
      event.clientX -
      canvasRect.left;

    const mouseY =
      event.clientY -
      canvasRect.top;

    if (draggingNodeId) {
      const newX = Math.max(
        10,
        Math.min(
          canvasRect.width - 200,
          mouseX - dragOffset.x
        )
      );

      const newY = Math.max(
        10,
        Math.min(
          canvasRect.height - 250,
          mouseY - dragOffset.y
        )
      );

      const updated =
        localNodes.map(
          (node) =>
            node.id === draggingNodeId
              ? {
                  ...node,
                  x: newX,
                  y: newY,
                }
              : node
        );

      setLocalNodes(updated);
    }

    if (pendingWire) {
      setPendingWire(
        (previous) => ({
          ...previous,
          currentX: mouseX,
          currentY: mouseY,
        })
      );
    }
  };

  /* =======================================================
     CANVAS MOUSE UP
     ======================================================= */

  const handleCanvasMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);

      notifyChange(
        localNodes,
        localConns
      );
    }
  };

  /* =======================================================
     PORT POSITION
     ======================================================= */

  const getPortPosition = (
    node,
    portName,
    isOutput
  ) => {
    const spec = getSpec(node);

    const ports = getPortList(
      node,
      isOutput
    );

    const portIndex = Math.max(
      0,
      ports.indexOf(portName)
    );

    const portCount = Math.max(
      1,
      ports.length
    );

    const nodeHeight =
      getNodeHeight(node);

    const verticalPadding =
      Math.min(
        18,
        nodeHeight * 0.12
      );

    let y;

    if (portCount === 1) {
      y =
        node.y +
        nodeHeight / 2;
    } else {
      const availableHeight =
        nodeHeight -
        verticalPadding * 2;

      const step =
        availableHeight /
        (portCount - 1);

      y =
        node.y +
        verticalPadding +
        step * portIndex;
    }

    return {
      x: isOutput
        ? node.x + spec.width
        : node.x,
      y,
    };
  };

  /* =======================================================
     PORT MOUSE DOWN
     ======================================================= */

  const handlePortMouseDown = (
    node,
    portName,
    isOutput,
    event
  ) => {
    if (readOnly) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    /*
      OUTPUT PORT:
      Start a new wire.
    */
    if (isOutput) {
      const position =
        getPortPosition(
          node,
          portName,
          true
        );

      setSelectedNodeId(
        node.id
      );

      setSelectedConnId(
        null
      );

      setPendingWire({
        fromNode: node.id,
        fromPort: portName,
        startX: position.x,
        startY: position.y,
        currentX: position.x,
        currentY: position.y,
      });

      return;
    }

    /*
      INPUT PORT:
      If a wire is already being drawn,
      complete it.
    */
    if (pendingWire) {
      completeConnection(
        node,
        portName
      );
    }
  };

  /* =======================================================
     PORT MOUSE UP
     ======================================================= */

  const handlePortMouseUp = (
    node,
    portName,
    isOutput,
    event
  ) => {
    if (readOnly) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (
      !isOutput &&
      pendingWire
    ) {
      completeConnection(
        node,
        portName
      );
    }
  };

  /* =======================================================
     COMPLETE CONNECTION
     ======================================================= */

  const completeConnection = (
    targetNode,
    targetPort
  ) => {
    if (!pendingWire) {
      return;
    }

    const sourceNode =
      localNodes.find(
        (node) =>
          node.id ===
          pendingWire.fromNode
      );

    if (
      !sourceNode ||
      sourceNode.id ===
        targetNode.id
    ) {
      setPendingWire(null);
      return;
    }

    const sourcePorts =
      getOutputPorts(
        sourceNode
      );

    if (
      !sourcePorts.includes(
        pendingWire.fromPort
      )
    ) {
      setPendingWire(null);
      return;
    }

    const targetPorts =
      getInputPorts(
        targetNode
      );

    if (
      !targetPorts.includes(
        targetPort
      )
    ) {
      setPendingWire(null);
      return;
    }

    const occupied =
      localConns.find(
        (connection) =>
          connection.toNode ===
            targetNode.id &&
          connection.toPort ===
            targetPort
      );

    if (occupied) {
      setPendingWire(null);
      return;
    }

    if (
      pendingWire.fromNode ===
      targetNode.id
    ) {
      setPendingWire(null);
      return;
    }

    const newConnection = {
      id: `conn_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      fromNode:
        sourceNode.id,
      fromPort:
        pendingWire.fromPort,
      toNode:
        targetNode.id,
      toPort:
        targetPort,
    };

    const nextConnections = [
      ...localConns,
      newConnection,
    ];

    setLocalConns(
      nextConnections
    );

    setPendingWire(null);
    setSelectedConnId(null);

    notifyChange(
      localNodes,
      nextConnections
    );
  };

  /* =======================================================
     CANVAS CLICK
     ======================================================= */

  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    setSelectedConnId(null);

    if (pendingWire) {
      setPendingWire(null);
    }
  };

  /* =======================================================
     DELETE KEY
     ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (
          event.key === "Delete" ||
          event.key === "Backspace"
        ) &&
        !event.target.matches(
          "input, textarea, button"
        )
      ) {
        deleteSelected();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    selectedNodeId,
    selectedConnId,
    localNodes,
    localConns,
  ]);

  /* =======================================================
     RENDER PORT
     ======================================================= */

  const renderPort = (
    node,
    portName,
    isOutput,
    index,
    total
  ) => {
    const spec = getSpec(node);

    const signalValue =
      getSignalValue(
        node,
        portName,
        isOutput
      );

    const isHigh =
      signalValue === 1;

    const labelStyle = {
      position: "absolute",
      top: "50%",
      transform:
        "translateY(-50%)",
      fontSize: "8px",
      fontWeight: "700",
      color: "#dbeafe",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      ...(isOutput
        ? {
            right:
              spec.width + 10,
          }
        : {
            left:
              spec.width + 10,
          }),
    };

    return (
      <div
        key={`${node.id}-${portName}-${isOutput}`}
        className="port-wrapper"
        style={{
          position: "absolute",

          top:
            total <= 1
              ? "50%"
              : `${
                  18 +
                  (index /
                    Math.max(
                      1,
                      total - 1
                    )) *
                    64
                }%`,

          [isOutput
            ? "right"
            : "left"]: "-7px",

          transform:
            "translateY(-50%)",

          display: "flex",
          alignItems: "center",

          flexDirection:
            isOutput
              ? "row-reverse"
              : "row",

          zIndex: 100,

          /*
            IMPORTANT:
            The wrapper itself must receive
            mouse events.
          */
          pointerEvents:
            readOnly
              ? "none"
              : "auto",
        }}
      >
        <div
          className={`port-circle ${
            isOutput
              ? "out-port"
              : "in-port"
          } ${
            isHigh
              ? "signal-port-high"
              : ""
          }`}
          title={`${
            isOutput
              ? "Output"
              : "Input"
          }: ${portName}`}
          onMouseDown={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();

            handlePortMouseDown(
              node,
              portName,
              isOutput,
              event
            );
          }}
          onMouseUp={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();

            handlePortMouseUp(
              node,
              portName,
              isOutput,
              event
            );
          }}
          onClick={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          style={{
            width: "12px",
            height: "12px",
            minWidth: "12px",
            minHeight: "12px",

            cursor: readOnly
              ? "default"
              : "crosshair",

            boxSizing:
              "border-box",

            /*
              IMPORTANT:
              Explicitly enable pointer events
              on the actual port.
            */
            pointerEvents:
              readOnly
                ? "none"
                : "auto",

            position:
              "relative",

            zIndex: 101,
          }}
        />

        {spec.category ===
          "combinational" && (
          <span
            style={labelStyle}
          >
            {portName}
          </span>
        )}
      </div>
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className="circuit-canvas-wrapper"
      style={{
        height,
      }}
    >
      {/* =================================================
          PALETTE
          ================================================= */}

      {showPalette &&
        !readOnly && (
          <aside className="circuit-canvas-palette">
            <div className="palette-title">
              BASIC GATES
            </div>

            <div className="palette-grid">
              {BASIC_COMPONENTS.map(
                (type) => (
                  <button
                    key={type}
                    className="palette-gate-btn"
                    onClick={() =>
                      addGate(type)
                    }
                    type="button"
                    title={`Add ${getNodeDisplayName(
                      type
                    )}`}
                  >
                    {getNodeDisplayName(
                      type
                    )}
                  </button>
                )
              )}
            </div>

            <div
              className="palette-title"
              style={{
                marginTop:
                  "14px",
              }}
            >
              COMBINATIONAL
            </div>

            <div className="palette-grid">
              {COMBINATIONAL_COMPONENTS.map(
                (type) => (
                  <button
                    key={type}
                    className="palette-gate-btn"
                    onClick={() =>
                      addGate(type)
                    }
                    type="button"
                    title={`Add ${getNodeDisplayName(
                      type
                    )}`}
                  >
                    {getNodeDisplayName(
                      type
                    )}
                  </button>
                )
              )}
            </div>
          </aside>
        )}

      {/* =================================================
          BODY
          ================================================= */}

      <div className="circuit-canvas-body">
        <div className="canvas-header-bar">
          <div className="canvas-header-title">
            <span>{title}</span>

            {readOnly && (
              <span className="readonly-badge">
                READ ONLY
                {" "}
                (Interactive
                Inputs)
              </span>
            )}
          </div>

          <div className="canvas-header-controls">
            {toolbarActions}

            {!readOnly && (
              <>
                {selectedNodeId ||
                selectedConnId ? (
                  <button
                    type="button"
                    className="mini-tb-btn delete"
                    onClick={
                      deleteSelected
                    }
                  >
                    🗑 Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mini-tb-btn"
                    onClick={
                      clearCanvas
                    }
                  >
                    ✕ Clear
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* =================================================
            CANVAS
            ================================================= */}

        <div
          className="circuit-canvas embedded-canvas"
          ref={canvasRef}
          onMouseMove={
            handleCanvasMouseMove
          }
          onMouseUp={
            handleCanvasMouseUp
          }
          onMouseLeave={() => {
            if (draggingNodeId) {
              setDraggingNodeId(
                null
              );
            }
          }}
          onClick={
            handleCanvasClick
          }
          style={{
            position: "relative",
            overflow: "auto",
          }}
        >
          {/* =================================================
              SVG WIRE LAYER
              ================================================= */}

          <svg
            className="wires-svg-layer"
            style={{
              position:
                "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents:
                "none",
              overflow:
                "visible",
            }}
          >
            <defs>
              <filter
                id="glow-high-embed"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodColor="#00e5ff"
                  floodOpacity="0.8"
                />
              </filter>
            </defs>

            {/* EXISTING CONNECTIONS */}

            {localConns.map(
              (connection) => {
                const sourceNode =
                  localNodes.find(
                    (node) =>
                      node.id ===
                      connection.fromNode
                  );

                const targetNode =
                  localNodes.find(
                    (node) =>
                      node.id ===
                      connection.toNode
                  );

                if (
                  !sourceNode ||
                  !targetNode
                ) {
                  return null;
                }

                const start =
                  getPortPosition(
                    sourceNode,
                    connection.fromPort,
                    true
                  );

                const end =
                  getPortPosition(
                    targetNode,
                    connection.toPort,
                    false
                  );

                const wireValue =
                  simResults
                    ?.wire_values?.[
                    connection.id
                  ];

                const sourceSignal =
                  getSignalValue(
                    sourceNode,
                    connection.fromPort,
                    true
                  );

                const signalValue =
                  wireValue ??
                  sourceSignal ??
                  0;

                const isHigh =
                  signalValue === 1;

                const isSelected =
                  selectedConnId ===
                  connection.id;

                const dx =
                  Math.max(
                    40,
                    Math.abs(
                      end.x -
                        start.x
                    ) * 0.5
                  );

                const pathD = `
                  M ${start.x} ${start.y}
                  C ${start.x + dx} ${start.y},
                    ${end.x - dx} ${end.y},
                    ${end.x} ${end.y}
                `;

                return (
                  <g
                    key={
                      connection.id
                    }
                    style={{
                      pointerEvents:
                        "all",
                      cursor:
                        readOnly
                          ? "default"
                          : "pointer",
                    }}
                    className={`wire-group ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={(
                      event
                    ) => {
                      if (
                        readOnly
                      ) {
                        return;
                      }

                      event.stopPropagation();

                      setSelectedConnId(
                        connection.id
                      );

                      setSelectedNodeId(
                        null
                      );
                    }}
                  >
                    <path
                      d={pathD}
                      className="wire-hitbox"
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                    />

                    <path
                      d={pathD}
                      className={`wire-line ${
                        isHigh
                          ? "signal-high"
                          : "signal-low"
                      } ${
                        isSelected
                          ? "wire-selected"
                          : ""
                      }`}
                      fill="none"
                      filter={
                        isHigh
                          ? "url(#glow-high-embed)"
                          : undefined
                      }
                    />
                  </g>
                );
              }
            )}

            {/* PENDING WIRE */}

            {pendingWire && (
              <path
                d={`
                  M ${pendingWire.startX}
                    ${pendingWire.startY}
                  L ${pendingWire.currentX}
                    ${pendingWire.currentY}
                `}
                className="wire-pending"
                fill="none"
              />
            )}
          </svg>

          {/* =================================================
              NODES
              ================================================= */}

          {localNodes.map(
            (node) => {
              const spec =
                getSpec(node);

              const isSelected =
                selectedNodeId ===
                node.id;

              const mainNodeValue =
                simResults
                  ?.node_values?.[
                  node.id
                ];

              const isSimpleSignal =
                mainNodeValue === 1 ||
                mainNodeValue === 0;

              const nodeIsHigh =
                isSimpleSignal &&
                mainNodeValue === 1;

              const inputPorts =
                getInputPorts(node);

              const outputPorts =
                getOutputPorts(node);

              const nodeHeight =
                getNodeHeight(node);

              return (
                <div
                  key={node.id}
                  className={`
                    canvas-node-card
                    node-${String(
                      node.type
                    ).toLowerCase()}
                    ${
                      isSelected
                        ? "node-selected"
                        : ""
                    }
                    ${
                      nodeIsHigh
                        ? "is-high"
                        : "is-low"
                    }
                  `}
                  style={{
                    position:
                      "absolute",
                    left:
                      `${node.x}px`,
                    top:
                      `${node.y}px`,
                    width:
                      `${spec.width}px`,
                    height:
                      `${nodeHeight}px`,
                    boxSizing:
                      "border-box",

                    zIndex:
                      isSelected
                        ? 15
                        : 5,

                    userSelect:
                      "none",
                  }}
                  onMouseDown={(
                    event
                  ) => {
                    /*
                      IMPORTANT:
                      Do not drag the node when
                      clicking a connection port.
                    */
                    if (
                      event.target.closest &&
                      event.target.closest(
                        ".port-circle"
                      )
                    ) {
                      return;
                    }

                    handleNodeMouseDown(
                      node,
                      event
                    );
                  }}
                >
                  {/* =======================================
                      INPUT PORTS
                      ======================================= */}

                  {inputPorts.length >
                    0 && (
                    <div
                      className="node-ports-in"
                      style={{
                        position:
                          "absolute",
                        inset: 0,

                        /*
                          FIX:
                          This layer must allow
                          pointer events.
                        */
                        pointerEvents:
                          readOnly
                            ? "none"
                            : "auto",

                        zIndex: 20,
                      }}
                    >
                      {inputPorts.map(
                        (
                          portName,
                          index
                        ) =>
                          renderPort(
                            node,
                            portName,
                            false,
                            index,
                            inputPorts.length
                          )
                      )}
                    </div>
                  )}

                  {/* =======================================
                      NODE BODY
                      ======================================= */}

                  <div
                    className="node-body-content"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexDirection:
                        "column",
                      gap: "5px",
                      position:
                        "relative",

                      /*
                        Keep body below
                        connection ports.
                      */
                      zIndex: 2,

                      padding: "8px",
                      boxSizing:
                        "border-box",
                    }}
                  >
                    <span
                      className="node-label-txt"
                      style={{
                        fontSize:
                          node.type ===
                            "DECODER_3_8" ||
                          node.type ===
                            "DECODER_4_16" ||
                          node.type ===
                            "ENCODER_8_3"
                            ? "10px"
                            : "12px",
                        fontWeight:
                          "700",
                        textAlign:
                          "center",
                        lineHeight:
                          "1.1",
                        maxWidth:
                          "90%",
                      }}
                    >
                      {node.label ||
                        getNodeDisplayName(
                          node.type
                        )}
                    </span>

                    {/* VARIABLE INPUT CONTROL */}

                    {spec.variableInputs &&
                      isSelected &&
                      !readOnly && (
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap: "4px",
                            marginTop:
                              "2px",
                            zIndex: 5,
                          }}
                          onMouseDown={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                          onClick={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                        >
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              changeGateInputCount(
                                node.id,
                                -1
                              );
                            }}
                            disabled={
                              inputPorts.length <=
                              (spec.minInputs ||
                                2)
                            }
                            style={{
                              width:
                                "22px",
                              height:
                                "20px",
                              padding: 0,
                              cursor:
                                inputPorts.length <=
                                (spec.minInputs ||
                                  2)
                                  ? "not-allowed"
                                  : "pointer",
                              fontWeight:
                                "700",
                            }}
                          >
                            −
                          </button>

                          <span
                            style={{
                              fontSize:
                                "9px",
                              fontWeight:
                                "700",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              inputPorts.length
                            }{" "}
                            INPUTS
                          </span>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              changeGateInputCount(
                                node.id,
                                1
                              );
                            }}
                            disabled={
                              inputPorts.length >=
                              (spec.maxInputs ||
                                8)
                            }
                            style={{
                              width:
                                "22px",
                              height:
                                "20px",
                              padding: 0,
                              cursor:
                                inputPorts.length >=
                                (spec.maxInputs ||
                                  8)
                                  ? "not-allowed"
                                  : "pointer",
                              fontWeight:
                                "700",
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}

                    {/* INPUT STATE */}

                    {node.type ===
                      "INPUT" && (
                      <button
                        type="button"
                        className={`node-toggle-state ${
                          node.state ===
                          1
                            ? "val-1"
                            : "val-0"
                        }`}
                        onClick={(
                          event
                        ) =>
                          toggleInputState(
                            node.id,
                            event
                          )
                        }
                        title="Click to toggle input state (0 / 1)"
                      >
                        {node.state ===
                        1
                          ? "1"
                          : "0"}
                      </button>
                    )}

                    {/* OUTPUT STATE */}

                    {node.type ===
                      "OUTPUT" && (
                      <span
                        className={`node-output-badge ${
                          nodeIsHigh
                            ? "high"
                            : "low"
                        }`}
                      >
                        {isSimpleSignal
                          ? mainNodeValue
                          : 0}
                      </span>
                    )}

                    {/* MULTI OUTPUT PREVIEW */}

                    {outputPorts.length >
                      1 && (
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "3px",
                          flexWrap:
                            "wrap",
                          justifyContent:
                            "center",
                          maxWidth:
                            "92%",
                          maxHeight:
                            nodeHeight -
                            55,
                          overflow:
                            "hidden",
                        }}
                      >
                        {outputPorts.map(
                          (
                            portName
                          ) => {
                            const value =
                              getSignalValue(
                                node,
                                portName,
                                true
                              );

                            return (
                              <span
                                key={
                                  portName
                                }
                                style={{
                                  fontSize:
                                    "8px",
                                  fontWeight:
                                    "700",
                                  padding:
                                    "2px 4px",
                                  borderRadius:
                                    "4px",
                                  background:
                                    value ===
                                    1
                                      ? "rgba(34,211,238,0.25)"
                                      : "rgba(148,163,184,0.15)",
                                  color:
                                    value ===
                                    1
                                      ? "#67e8f9"
                                      : "#cbd5e1",
                                }}
                              >
                                {portName}:
                                {value ??
                                  0}
                              </span>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* =======================================
                      OUTPUT PORTS
                      ======================================= */}

                  {outputPorts.length >
                    0 && (
                    <div
                      className="node-ports-out"
                      style={{
                        position:
                          "absolute",
                        inset: 0,

                        /*
                          FIX:
                          Output ports must
                          receive pointer events.
                        */
                        pointerEvents:
                          readOnly
                            ? "none"
                            : "auto",

                        zIndex: 20,
                      }}
                    >
                      {outputPorts.map(
                        (
                          portName,
                          index
                        ) =>
                          renderPort(
                            node,
                            portName,
                            true,
                            index,
                            outputPorts.length
                          )
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default CircuitCanvas;