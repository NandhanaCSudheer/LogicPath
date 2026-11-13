import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./Build.css";

/* =========================================================
   COMPONENT SPECIFICATIONS
   ========================================================= */

const GATE_SPECS = {
  /* ================= BASIC ================= */

  INPUT: {
    label: "IN",
    inputs: 0,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 0,
    maxInputs: 0,
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
    minInputs: 1,
    maxInputs: 1,
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
    minInputs: 1,
    maxInputs: 1,
    width: 100,
    height: 56,
    defaultName: "NOT",
    category: "basic",
  },

  AND: {
    label: "AND",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 115,
    height: 90,
    defaultName: "AND",
    category: "basic",
    variableInputs: true,
  },

  OR: {
    label: "OR",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 115,
    height: 90,
    defaultName: "OR",
    category: "basic",
    variableInputs: true,
  },

  NAND: {
    label: "NAND",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 120,
    height: 90,
    defaultName: "NAND",
    category: "basic",
    variableInputs: true,
  },

  NOR: {
    label: "NOR",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 115,
    height: 90,
    defaultName: "NOR",
    category: "basic",
    variableInputs: true,
  },

  XOR: {
    label: "XOR",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 115,
    height: 90,
    defaultName: "XOR",
    category: "basic",
    variableInputs: true,
  },

  XNOR: {
    label: "XNOR",
    inputs: 2,
    outputs: 1,
    inputPorts: [],
    outputPorts: ["out"],
    minInputs: 2,
    maxInputs: 8,
    width: 120,
    height: 90,
    defaultName: "XNOR",
    category: "basic",
    variableInputs: true,
  },

  /* ================= ADDERS ================= */

  HALF_ADDER: {
    label: "HALF ADDER",
    inputs: 2,
    outputs: 2,
    inputPorts: ["A", "B"],
    outputPorts: ["SUM", "CARRY"],
    minInputs: 2,
    maxInputs: 2,
    width: 150,
    height: 110,
    defaultName: "HALF ADDER",
    category: "combinational",
  },

  FULL_ADDER: {
    label: "FULL ADDER",
    inputs: 3,
    outputs: 2,
    inputPorts: ["A", "B", "CIN"],
    outputPorts: ["SUM", "COUT"],
    minInputs: 3,
    maxInputs: 3,
    width: 150,
    height: 130,
    defaultName: "FULL ADDER",
    category: "combinational",
  },

  /* ================= MULTIPLEXERS ================= */

  MUX_2_1: {
    label: "2:1 MUX",
    inputs: 3,
    outputs: 1,
    inputPorts: ["I0", "I1", "S"],
    outputPorts: ["Y"],
    minInputs: 3,
    maxInputs: 3,
    width: 145,
    height: 115,
    defaultName: "2:1 MUX",
    category: "combinational",
  },

  MUX_4_1: {
    label: "4:1 MUX",
    inputs: 6,
    outputs: 1,
    inputPorts: [
      "I0",
      "I1",
      "I2",
      "I3",
      "S0",
      "S1",
    ],
    outputPorts: ["Y"],
    minInputs: 6,
    maxInputs: 6,
    width: 155,
    height: 170,
    defaultName: "4:1 MUX",
    category: "combinational",
  },

  /* ================= DEMULTIPLEXERS ================= */

  DEMUX_1_2: {
    label: "1:2 DEMUX",
    inputs: 2,
    outputs: 2,
    inputPorts: ["D", "S"],
    outputPorts: ["Y0", "Y1"],
    minInputs: 2,
    maxInputs: 2,
    width: 150,
    height: 115,
    defaultName: "1:2 DEMUX",
    category: "combinational",
  },

  DEMUX_1_4: {
    label: "1:4 DEMUX",
    inputs: 3,
    outputs: 4,
    inputPorts: ["D", "S0", "S1"],
    outputPorts: [
      "Y0",
      "Y1",
      "Y2",
      "Y3",
    ],
    minInputs: 3,
    maxInputs: 3,
    width: 160,
    height: 170,
    defaultName: "1:4 DEMUX",
    category: "combinational",
  },

  /* ================= DECODERS ================= */

  DECODER_2_4: {
    label: "2:4 DECODER",
    inputs: 2,
    outputs: 4,
    inputPorts: ["A", "B"],
    outputPorts: [
      "Y0",
      "Y1",
      "Y2",
      "Y3",
    ],
    minInputs: 2,
    maxInputs: 2,
    width: 160,
    height: 150,
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
    minInputs: 3,
    maxInputs: 3,
    width: 170,
    height: 250,
    defaultName: "3:8 DECODER",
    category: "combinational",
  },

  DECODER_4_16: {
    label: "4:16 DECODER",
    inputs: 4,
    outputs: 16,
    inputPorts: [
      "A",
      "B",
      "C",
      "D",
    ],
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
    minInputs: 4,
    maxInputs: 4,
    width: 185,
    height: 350,
    defaultName: "4:16 DECODER",
    category: "combinational",
  },

  /* ================= ENCODERS ================= */

  ENCODER_4_2: {
    label: "4:2 ENCODER",
    inputs: 4,
    outputs: 2,
    inputPorts: [
      "I0",
      "I1",
      "I2",
      "I3",
    ],
    outputPorts: ["A", "B"],
    minInputs: 4,
    maxInputs: 4,
    width: 160,
    height: 150,
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
    outputPorts: [
      "A",
      "B",
      "C",
    ],
    minInputs: 8,
    maxInputs: 8,
    width: 175,
    height: 250,
    defaultName: "8:3 ENCODER",
    category: "combinational",
  },
};

/* =========================================================
   PALETTE COMPONENTS
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

const COMPONENT_NAMES = {
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
   BUILD COMPONENT
   ========================================================= */

function Build() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);

  /* =======================================================
     CIRCUIT STATE
     ======================================================= */

  const [circuitId, setCircuitId] =
    useState(null);

  const [circuitName, setCircuitName] =
    useState("My Logic Circuit");

  const [circuitDescription, setCircuitDescription] =
    useState("");

  const [nodes, setNodes] =
    useState([]);

  const [connections, setConnections] =
    useState([]);

  /* =======================================================
     SIMULATION / VALIDATION
     ======================================================= */

  const [simResults, setSimResults] =
    useState(null);

  const [validationState, setValidationState] =
    useState({
      valid: true,
      message: "",
    });

  const [booleanExpr, setBooleanExpr] =
    useState(null);

  /* =======================================================
     UI INTERACTION
     ======================================================= */

  const [selectedNodeId, setSelectedNodeId] =
    useState(null);

  const [selectedConnId, setSelectedConnId] =
    useState(null);

  const [draggingNodeId, setDraggingNodeId] =
    useState(null);

  const [dragOffset, setDragOffset] =
    useState({
      x: 0,
      y: 0,
    });

  const [pendingWire, setPendingWire] =
    useState(null);

  const [selectedGateInfo, setSelectedGateInfo] =
    useState(null);

  /* =======================================================
     MODALS
     ======================================================= */

  const [showTruthTableModal, setShowTruthTableModal] =
    useState(false);

  const [truthTableData, setTruthTableData] =
    useState(null);

  const [showOptimizeModal, setShowOptimizeModal] =
    useState(false);

  const [optimizationData, setOptimizationData] =
    useState(null);

  const [showSaveModal, setShowSaveModal] =
    useState(false);

  const [showLoadModal, setShowLoadModal] =
    useState(false);

  const [savedCircuitsList, setSavedCircuitsList] =
    useState([]);

  const [examplePresets, setExamplePresets] =
    useState([]);

  const [actionMessage, setActionMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* =======================================================
     HELPERS
     ======================================================= */

  const getSpec = useCallback(
    (nodeOrType) => {
      const type =
        typeof nodeOrType === "string"
          ? nodeOrType
          : nodeOrType?.type;

      return (
        GATE_SPECS[type] ||
        GATE_SPECS.AND
      );
    },
    []
  );

  const getNodeInputPorts =
    useCallback(
      (node) => {
        const spec =
          getSpec(node);

        if (
          spec.variableInputs
        ) {
          if (
            Array.isArray(
              node?.inputPorts
            ) &&
            node.inputPorts.length >
              0
          ) {
            return node.inputPorts;
          }

          return Array.from(
            {
              length:
                spec.minInputs,
            },
            (_, index) =>
              `in${index + 1}`
          );
        }

        return Array.isArray(
          node?.inputPorts
        )
          ? node.inputPorts
          : spec.inputPorts || [];
      },
      [getSpec]
    );

  const getNodeOutputPorts =
    useCallback(
      (node) => {
        const spec =
          getSpec(node);

        return Array.isArray(
          node?.outputPorts
        )
          ? node.outputPorts
          : spec.outputPorts || [];
      },
      [getSpec]
    );

  const getDynamicHeight =
    useCallback(
      (node) => {
        const spec =
          getSpec(node);

        const inputCount =
          getNodeInputPorts(
            node
          ).length;

        const outputCount =
          getNodeOutputPorts(
            node
          ).length;

        const largestPortCount =
          Math.max(
            inputCount,
            outputCount
          );

        return Math.max(
          spec.height,
          30 +
            largestPortCount *
              20
        );
      },
      [
        getSpec,
        getNodeInputPorts,
        getNodeOutputPorts,
      ]
    );

  /* =======================================================
     INITIALIZE CIRCUIT
     ======================================================= */

  useEffect(() => {
    const activeRaw =
      localStorage.getItem(
        "logicpath_active_circuit"
      );

    if (activeRaw) {
      try {
        const active =
          JSON.parse(
            activeRaw
          );

        if (
          active.nodes &&
          active.nodes.length > 0
        ) {
          loadCircuitState(
            active
          );

          return;
        }
      } catch {
        // Ignore malformed local data
      }
    }

    setNodes([]);
    setConnections([]);
  }, []);

  /* =======================================================
     EXAMPLES
     ======================================================= */

  useEffect(() => {
    api
      .getExamples()
      .then((res) => {
        if (
          Array.isArray(
            res?.examples
          )
        ) {
          setExamplePresets(
            res.examples
          );
        }
      })
      .catch(() => {});
  }, []);

  /* =======================================================
     PERSIST / SIMULATION
     ======================================================= */

  useEffect(() => {
    if (nodes.length > 0) {
      runLiveSimulation(
        nodes,
        connections
      );

      persistLocal(
        nodes,
        connections
      );
    }
  }, [
    nodes,
    connections,
  ]);

  const persistLocal = (
    currentNodes,
    currentConnections
  ) => {
    localStorage.setItem(
      "logicpathCircuit",
      JSON.stringify(
        currentNodes
      )
    );

    localStorage.setItem(
      "logicpath_active_circuit",
      JSON.stringify({
        id: circuitId,
        name: circuitName,
        description:
          circuitDescription,
        nodes: currentNodes,
        connections:
          currentConnections,
      })
    );
  };

  const loadCircuitState = (
    circuitObj
  ) => {
    setCircuitId(
      circuitObj?.id || null
    );

    setCircuitName(
      circuitObj?.name ||
        "Untitled Circuit"
    );

    setCircuitDescription(
      circuitObj?.description ||
        ""
    );

    const loadedNodes =
      Array.isArray(
        circuitObj?.nodes
      )
        ? circuitObj.nodes.map(
            (node) => {
              const spec =
                GATE_SPECS[
                  node.type
                ];

              let inputPorts =
                node.inputPorts;

              if (
                (!Array.isArray(
                  inputPorts
                ) ||
                  inputPorts.length ===
                    0) &&
                spec?.variableInputs
              ) {
                inputPorts =
                  Array.from(
                    {
                      length:
                        spec.minInputs,
                    },
                    (_, index) =>
                      `in${index + 1}`
                  );
              }

              if (
                !Array.isArray(
                  inputPorts
                )
              ) {
                inputPorts =
                  spec?.inputPorts ||
                  [];
              }

              return {
                ...node,
                inputPorts,
                outputPorts:
                  Array.isArray(
                    node.outputPorts
                  )
                    ? node.outputPorts
                    : spec?.outputPorts ||
                      [],
                inputCount:
                  inputPorts.length,
              };
            }
          )
        : [];

    setNodes(
      loadedNodes
    );

    setConnections(
      Array.isArray(
        circuitObj?.connections
      )
        ? circuitObj.connections
        : []
    );

    setSelectedNodeId(
      null
    );

    setSelectedConnId(
      null
    );

    setSelectedGateInfo(
      null
    );

    setPendingWire(
      null
    );
  };

  /* =======================================================
     LIVE SIMULATION
     ======================================================= */

  const runLiveSimulation =
    useCallback(
      async (
        currentNodes,
        currentConnections
      ) => {
        try {
          const inputValues = {};

          currentNodes
            .filter(
              (node) =>
                String(
                  node.type
                ).toUpperCase() ===
                "INPUT"
            )
            .forEach(
              (node) => {
                inputValues[
                  node.id
                ] =
                  node.state ??
                  0;
              }
            );

          const response =
            await api.simulateCircuit(
              {
                nodes:
                  currentNodes,
                connections:
                  currentConnections,
                input_values:
                  inputValues,
              }
            );

          if (
            response?.success
          ) {
            setSimResults(
              response
            );

            setValidationState({
              valid: true,
              message:
                "Circuit active & simulated",
            });

            api
              .generateBooleanExpression(
                {
                  nodes:
                    currentNodes,
                  connections:
                    currentConnections,
                }
              )
              .then(
                (
                  expressionResponse
                ) => {
                  if (
                    expressionResponse?.success
                  ) {
                    setBooleanExpr(
                      expressionResponse.expressions
                    );
                  }
                }
              )
              .catch(() => {});
          } else {
            setSimResults(
              null
            );

            setValidationState({
              valid: false,
              message:
                response?.errors?.[0] ||
                "Circuit incomplete",
            });
          }
        } catch {
          setSimResults(
            null
          );
        }
      },
      []
    );

  /* =======================================================
     ADD COMPONENT
     ======================================================= */

  const addGate = (type) => {
    const spec =
      GATE_SPECS[type] ||
      GATE_SPECS.AND;

    const sameTypeCount =
      nodes.filter(
        (node) =>
          node.type === type
      ).length + 1;

    let label;

    if (type === "INPUT") {
      const count =
        nodes.filter(
          (node) =>
            node.type ===
            "INPUT"
        ).length;

      label =
        String.fromCharCode(
          65 +
            (count % 26)
        );
    } else if (
      type === "OUTPUT"
    ) {
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
      180 +
      (nodes.length % 4) *
        90;

    const spawnY =
      70 +
      (nodes.length % 3) *
        120;

    let inputPorts;

    if (
      spec.variableInputs
    ) {
      inputPorts =
        Array.from(
          {
            length:
              spec.minInputs,
          },
          (_, index) =>
            `in${index + 1}`
        );
    } else {
      inputPorts = [
        ...(spec.inputPorts ||
          []),
      ];
    }

    const outputPorts = [
      ...(spec.outputPorts ||
        []),
    ];

    const newNode = {
      id: `node_${Date.now()}_${Math.random()
        .toString(36)
        .substring(
          2,
          7
        )}`,

      type,

      label,

      state: 0,

      x: spawnX,
      y: spawnY,

      inputPorts,

      outputPorts,

      inputCount:
        inputPorts.length,
    };

    setNodes(
      (previousNodes) => [
        ...previousNodes,
        newNode,
      ]
    );

    setSelectedNodeId(
      newNode.id
    );

    setSelectedGateInfo(
      type
    );

    setSelectedConnId(
      null
    );

    setActionMessage(
      `Added ${
        COMPONENT_NAMES[type] ||
        type
      }.`
    );

    setTimeout(
      () =>
        setActionMessage(""),
      2500
    );
  };

  /* =======================================================
     CHANGE VARIABLE GATE INPUT COUNT
     ======================================================= */

  const changeGateInputCount = (
    nodeId,
    delta
  ) => {
    const selectedNode =
      nodes.find(
        (node) =>
          node.id === nodeId
      );

    if (!selectedNode) {
      return;
    }

    const spec =
      getSpec(
        selectedNode
      );

    if (
      !spec.variableInputs
    ) {
      return;
    }

    const currentPorts =
      getNodeInputPorts(
        selectedNode
      );

    const currentCount =
      currentPorts.length;

    const newCount =
      Math.max(
        spec.minInputs,
        Math.min(
          spec.maxInputs,
          currentCount +
            delta
        )
      );

    if (
      newCount ===
      currentCount
    ) {
      return;
    }

    const newInputPorts =
      Array.from(
        {
          length:
            newCount,
        },
        (_, index) =>
          `in${index + 1}`
      );

    /* Remove wires connected to
       input ports that no longer exist. */
    if (
      newCount <
      currentCount
    ) {
      setConnections(
        (
          previousConnections
        ) =>
          previousConnections.filter(
            (connection) =>
              connection.toNode !==
                nodeId ||
              newInputPorts.includes(
                connection.toPort
              )
          )
      );
    }

    setNodes(
      (previousNodes) =>
        previousNodes.map(
          (node) =>
            node.id === nodeId
              ? {
                  ...node,
                  inputPorts:
                    newInputPorts,
                  inputCount:
                    newCount,
                }
              : node
        )
    );

    setActionMessage(
      `Input count: ${newCount}`
    );

    setTimeout(
      () =>
        setActionMessage(""),
      1800
    );
  };

  /* =======================================================
     DELETE
     ======================================================= */

  const deleteSelected = () => {
    if (selectedNodeId) {
      setNodes(
        (previousNodes) =>
          previousNodes.filter(
            (node) =>
              node.id !==
              selectedNodeId
          )
      );

      setConnections(
        (previousConnections) =>
          previousConnections.filter(
            (connection) =>
              connection.fromNode !==
                selectedNodeId &&
              connection.toNode !==
                selectedNodeId
          )
      );

      setSelectedNodeId(
        null
      );

      setSelectedGateInfo(
        null
      );

      setActionMessage(
        "Component deleted."
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2000
      );

      return;
    }

    if (selectedConnId) {
      setConnections(
        (previousConnections) =>
          previousConnections.filter(
            (connection) =>
              connection.id !==
              selectedConnId
          )
      );

      setSelectedConnId(
        null
      );

      setActionMessage(
        "Connection removed."
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2000
      );
    }
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const clearCircuit = () => {
    if (
      nodes.length === 0
    ) {
      return;
    }

    if (
      window.confirm(
        "Clear all components and connections?"
      )
    ) {
      setNodes([]);
      setConnections([]);

      setSelectedNodeId(
        null
      );

      setSelectedConnId(
        null
      );

      setSelectedGateInfo(
        null
      );

      setPendingWire(
        null
      );

      setSimResults(null);

      setBooleanExpr(
        null
      );

      setValidationState({
        valid: true,
        message:
          "Canvas cleared",
      });

      setActionMessage(
        "Circuit cleared."
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2000
      );
    }
  };

  /* =======================================================
     INPUT TOGGLE
     ======================================================= */

  const toggleInputState = (
    nodeId,
    event
  ) => {
    event.stopPropagation();

    setNodes(
      (previousNodes) =>
        previousNodes.map(
          (node) =>
            node.id === nodeId
              ? {
                  ...node,
                  state:
                    node.state ===
                    1
                      ? 0
                      : 1,
                }
              : node
        )
    );
  };

  /* =======================================================
     NODE DRAGGING
     ======================================================= */

const handleNodeMouseDown = (
  node,
  event
) => {
  if (
    event.button !== 0
  ) {
    return;
  }

  /* Do NOT start dragging when clicking
     the variable-input controls. */
  if (
    event.target.closest(
      ".variable-input-control"
    )
  ) {
    return;
  }

  event.stopPropagation();

  setSelectedNodeId(
    node.id
  );

  setSelectedConnId(
    null
  );

  setSelectedGateInfo(
    node.type
  );

  const canvasRect =
    canvasRef.current?.getBoundingClientRect();

  if (!canvasRect) {
    return;
  }

  setDraggingNodeId(
    node.id
  );

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

  const handleCanvasMouseMove = (
    event
  ) => {
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

    if (
      draggingNodeId
    ) {
      const draggingNode =
        nodes.find(
          (node) =>
            node.id ===
            draggingNodeId
        );

      const draggingSpec =
        getSpec(
          draggingNode
        );

      const draggingHeight =
        draggingNode
          ? getDynamicHeight(
              draggingNode
            )
          : draggingSpec.height;

      const newX =
        Math.max(
          10,
          Math.min(
            canvasRect.width -
              draggingSpec.width -
              10,
            mouseX -
              dragOffset.x
          )
        );

      const newY =
        Math.max(
          10,
          Math.min(
            canvasRect.height -
              draggingHeight -
              10,
            mouseY -
              dragOffset.y
          )
        );

      setNodes(
        (previousNodes) =>
          previousNodes.map(
            (node) =>
              node.id ===
              draggingNodeId
                ? {
                    ...node,
                    x: newX,
                    y: newY,
                  }
                : node
          )
      );
    }

    if (pendingWire) {
      setPendingWire(
        (previous) => ({
          ...previous,

          currentX:
            mouseX,

          currentY:
            mouseY,
        })
      );
    }
  };

  const handleCanvasMouseUp =
    () => {
      setDraggingNodeId(
        null
      );
    };

  /* =======================================================
     PORT POSITION
     ======================================================= */

  const getPortPosition = (
    node,
    portName,
    isOutput
  ) => {
    const spec =
      getSpec(node);

    const inputPorts =
      getNodeInputPorts(
        node
      );

    const outputPorts =
      getNodeOutputPorts(
        node
      );

    const ports = isOutput
      ? outputPorts
      : inputPorts;

    const index = Math.max(
      0,
      ports.indexOf(
        portName
      )
    );

    const count =
      Math.max(
        1,
        ports.length
      );

    const dynamicHeight =
      getDynamicHeight(
        node
      );

    let y;

    if (count === 1) {
      y =
        node.y +
        dynamicHeight / 2;
    } else {
      const padding = 14;

      const usableHeight =
        dynamicHeight -
        padding * 2;

      y =
        node.y +
        padding +
        (index /
          (count - 1)) *
          usableHeight;
    }

    return {
      x: isOutput
        ? node.x +
          spec.width
        : node.x,

      y,
    };
  };

  /* =======================================================
     START / COMPLETE WIRE
     ======================================================= */

  const handlePortMouseDown = (
    node,
    portName,
    isOutput,
    event
  ) => {
    event.stopPropagation();

    if (isOutput) {
      const position =
        getPortPosition(
          node,
          portName,
          true
        );

      setPendingWire({
        fromNode:
          node.id,

        fromPort:
          portName,

        startX:
          position.x,

        startY:
          position.y,

        currentX:
          position.x,

        currentY:
          position.y,
      });
    } else if (
      pendingWire
    ) {
      completeConnection(
        node,
        portName
      );
    }
  };

  const handlePortMouseUp = (
    node,
    portName,
    isOutput,
    event
  ) => {
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

  const completeConnection = (
    targetNode,
    targetPort
  ) => {
    if (
      !pendingWire
    ) {
      return;
    }

    const sourceNode =
      nodes.find(
        (node) =>
          node.id ===
          pendingWire.fromNode
      );

    if (!sourceNode) {
      setPendingWire(
        null
      );
      return;
    }

    if (
      sourceNode.id ===
      targetNode.id
    ) {
      setPendingWire(
        null
      );

      setActionMessage(
        "Cannot connect a component to itself."
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2500
      );

      return;
    }

    const targetInputPorts =
      getNodeInputPorts(
        targetNode
      );

    if (
      !targetInputPorts.includes(
        targetPort
      )
    ) {
      setPendingWire(
        null
      );

      setActionMessage(
        `Invalid input port: ${targetPort}`
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2500
      );

      return;
    }

    const sourceOutputPorts =
      getNodeOutputPorts(
        sourceNode
      );

    if (
      !sourceOutputPorts.includes(
        pendingWire.fromPort
      )
    ) {
      setPendingWire(
        null
      );

      setActionMessage(
        `Invalid output port: ${pendingWire.fromPort}`
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2500
      );

      return;
    }

    const occupied =
      connections.find(
        (connection) =>
          connection.toNode ===
            targetNode.id &&
          connection.toPort ===
            targetPort
      );

    if (occupied) {
      setPendingWire(
        null
      );

      setActionMessage(
        `Port ${String(
          targetPort
        ).toUpperCase()} is already connected.`
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2500
      );

      return;
    }

    const connection = {
      id: `conn_${Date.now()}_${Math.random()
        .toString(36)
        .substring(
          2,
          7
        )}`,

      fromNode:
        sourceNode.id,

      fromPort:
        pendingWire.fromPort,

      toNode:
        targetNode.id,

      toPort:
        targetPort,
    };

    setConnections(
      (previousConnections) => [
        ...previousConnections,
        connection,
      ]
    );

    setPendingWire(
      null
    );

    setActionMessage(
      `Connected ${sourceNode.label} → ${targetNode.label}.`
    );

    setTimeout(
      () =>
        setActionMessage(""),
      2000
    );
  };

  /* =======================================================
     CANVAS CLICK
     ======================================================= */

  const handleCanvasClick =
    () => {
      setSelectedNodeId(
        null
      );

      setSelectedConnId(
        null
      );

      if (pendingWire) {
        setPendingWire(
          null
        );
      }
    };

  /* =======================================================
     VALIDATE
     ======================================================= */

  const handleValidate =
    async () => {
      try {
        const response =
          await api.validateCircuit(
            {
              nodes,
              connections,
            }
          );

        if (
          response?.success
        ) {
          setValidationState({
            valid: true,
            message:
              "✓ Circuit is logically valid!",
          });

          setActionMessage(
            "✓ Circuit is logically valid!"
          );
        } else {
          const firstError =
            response?.errors?.[0] ||
            "Circuit validation failed.";

          setValidationState({
            valid: false,
            message:
              firstError,
          });

          setActionMessage(
            firstError
          );
        }
      } catch (
        error
      ) {
        setActionMessage(
          "Validation error: " +
            (
              error?.message ||
              "Unknown error"
            )
        );
      }
    };

  /* =======================================================
     TRUTH TABLE
     ======================================================= */

  const handleOpenTruthTable =
    async () => {
      try {
        const response =
          await api.generateTruthTable(
            {
              nodes,
              connections,
            }
          );

        if (
          response?.success
        ) {
          setTruthTableData(
            response
          );

          setShowTruthTableModal(
            true
          );
        } else {
          setActionMessage(
            response?.errors?.[0] ||
              "Unable to generate truth table."
          );

          setTimeout(
            () =>
              setActionMessage(""),
            3000
          );
        }
      } catch (
        error
      ) {
        setActionMessage(
          "Error: " +
            (
              error?.message ||
              "Unknown error"
            )
        );
      }
    };

  /* =======================================================
     OPTIMIZATION
     ======================================================= */

  const handleOpenOptimize =
    async () => {
      try {
        const response =
          await api.optimizeCircuit(
            {
              nodes,
              connections,
            }
          );

        if (
          response?.success
        ) {
          setOptimizationData(
            response
          );

          setShowOptimizeModal(
            true
          );
        } else {
          setActionMessage(
            response?.message ||
              "Optimization error."
          );

          setTimeout(
            () =>
              setActionMessage(""),
            3000
          );
        }
      } catch (
        error
      ) {
        setActionMessage(
          "Optimization failed: " +
            (
              error?.message ||
              "Unknown error"
            )
        );
      }
    };

  const handleApplyOptimizedCircuit =
    () => {
      if (
        optimizationData?.optimized_circuit
      ) {
        loadCircuitState({
          ...optimizationData.optimized_circuit,
          id: null,
          name: circuitName,
          description:
            circuitDescription,
        });

        setShowOptimizeModal(
          false
        );

        setActionMessage(
          "Applied simplified circuit to canvas!"
        );

        setTimeout(
          () =>
            setActionMessage(""),
          3000
        );
      }
    };

  /* =======================================================
     SAVE
     ======================================================= */

  const handleSaveCircuit =
    async () => {
      if (
        !circuitName.trim()
      ) {
        alert(
          "Please provide a circuit name"
        );
        return;
      }

      setIsSaving(true);

      try {
        const payload = {
          name:
            circuitName.trim(),

          description:
            circuitDescription.trim(),

          nodes,

          connections,
        };

        if (
          circuitId &&
          circuitId !==
            "local_1" &&
          String(
            circuitId
          ).length >= 12
        ) {
          await api.updateCircuit(
            circuitId,
            payload
          );

          setActionMessage(
            "✓ Circuit updated in cloud database!"
          );
        } else {
          const created =
            await api.createCircuit(
              payload
            );

          setCircuitId(
            created.circuit_id
          );

          setActionMessage(
            "✓ Circuit saved to cloud database!"
          );
        }

        setShowSaveModal(
          false
        );

        setTimeout(
          () =>
            setActionMessage(""),
          3500
        );
      } catch (
        error
      ) {
        alert(
          "Save failed: " +
            (
              error?.message ||
              "Unknown error"
            )
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };

  /* =======================================================
     LOAD
     ======================================================= */

  const handleOpenLoadModal =
    async () => {
      try {
        const response =
          await api.listCircuits();

        if (
          Array.isArray(
            response?.circuits
          )
        ) {
          setSavedCircuitsList(
            response.circuits
          );
        }
      } catch {
        setSavedCircuitsList(
          []
        );
      }

      setShowLoadModal(
        true
      );
    };

  const handleSelectToLoad =
    (circuit) => {
      loadCircuitState(
        circuit
      );

      setShowLoadModal(
        false
      );

      setActionMessage(
        `Loaded "${circuit.name}".`
      );

      setTimeout(
        () =>
          setActionMessage(""),
        2500
      );
    };

  /* =======================================================
     SIMULATE PAGE
     ======================================================= */

  const handleSimulatePageNav =
    () => {
      localStorage.setItem(
        "logicpathCircuit",
        JSON.stringify(
          nodes
        )
      );

      localStorage.setItem(
        "logicpath_active_circuit",
        JSON.stringify({
          id: circuitId,
          name: circuitName,
          description:
            circuitDescription,
          nodes,
          connections,
        })
      );

      navigate(
        "/simulate"
      );
    };

  /* =======================================================
     DELETE KEY
     ======================================================= */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          (
            event.key ===
              "Delete" ||
            event.key ===
              "Backspace"
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
    nodes,
    connections,
  ]);

  /* =======================================================
     PORT SIGNAL VALUE
     ======================================================= */

  const getConnectionSignalValue =
    (connection) => {
      const wireValue =
        simResults
          ?.wire_values?.[
          connection.id
        ];

      if (
        wireValue === 0 ||
        wireValue === 1
      ) {
        return wireValue;
      }

      const sourceNode =
        nodes.find(
          (node) =>
            node.id ===
            connection.fromNode
        );

      if (!sourceNode) {
        return 0;
      }

      const nodeValue =
        simResults
          ?.node_values?.[
          sourceNode.id
        ];

      if (
        nodeValue === 0 ||
        nodeValue === 1
      ) {
        return nodeValue;
      }

      if (
        nodeValue &&
        typeof nodeValue ===
          "object"
      ) {
        const portValue =
          nodeValue[
            connection.fromPort
          ];

        return portValue ===
          1
          ? 1
          : 0;
      }

      return 0;
    };

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="builder-page">
      <Navbar />

      <div className="builder-content">
        {/* =================================================
            LEFT PALETTE
            ================================================= */}

        <aside className="gate-sidebar">
          <h3>GATES</h3>

          <div
            className="sidebar-section-title"
            style={{
              marginBottom:
                "8px",
              fontSize:
                "11px",
              fontWeight:
                "800",
              letterSpacing:
                "0.8px",
            }}
          >
            BASIC GATES
          </div>

          {BASIC_COMPONENTS.map(
            (type) => (
              <button
                key={type}
                onClick={() =>
                  addGate(type)
                }
                title={`Add ${COMPONENT_NAMES[type]}`}
              >
                {
                  COMPONENT_NAMES[
                    type
                  ]
                }
              </button>
            )
          )}

          <div className="sidebar-divider"></div>

          <div
            className="sidebar-section-title"
            style={{
              marginBottom:
                "8px",
              fontSize:
                "11px",
              fontWeight:
                "800",
              letterSpacing:
                "0.8px",
            }}
          >
            COMBINATIONAL CIRCUITS
          </div>

          {COMBINATIONAL_COMPONENTS.map(
            (type) => (
              <button
                key={type}
                onClick={() =>
                  addGate(type)
                }
                title={`Add ${COMPONENT_NAMES[type]}`}
              >
                {
                  COMPONENT_NAMES[
                    type
                  ]
                }
              </button>
            )
          )}

          <div className="sidebar-divider"></div>

          {/* =================================================
              COMPONENT INFO
              ================================================= */}

          <div className="gate-doc-preview">
            <h4>
              COMPONENT INFO
            </h4>

            {selectedGateInfo ? (
              <div className="doc-content">
                <span className="doc-title">
                  {
                    COMPONENT_NAMES[
                      selectedGateInfo
                    ] ||
                    selectedGateInfo
                  }
                </span>

                <p>
                  {
                    GATE_SPECS[
                      selectedGateInfo
                    ]?.variableInputs
                      ? "Variable-input logic gate (2–8 inputs)"
                      : GATE_SPECS[
                          selectedGateInfo
                        ]?.category ===
                        "combinational"
                      ? "Combinational circuit component"
                      : GATE_SPECS[
                          selectedGateInfo
                        ]?.inputs === 0
                      ? "Interactive signal source (0/1)"
                      : "Single-input logic component"
                  }
                </p>

                {selectedGateInfo &&
                  GATE_SPECS[
                    selectedGateInfo
                  ]?.category ===
                    "combinational" && (
                    <>
                      <p>
                        <strong>
                          Inputs:
                        </strong>{" "}
                        {getNodeInputPorts(
                          nodes.find(
                            (node) =>
                              node.id ===
                              selectedNodeId
                          ) || {
                            type:
                              selectedGateInfo,
                          }
                        ).join(
                          ", "
                        )}
                      </p>

                      <p>
                        <strong>
                          Outputs:
                        </strong>{" "}
                        {getNodeOutputPorts(
                          nodes.find(
                            (node) =>
                              node.id ===
                              selectedNodeId
                          ) || {
                            type:
                              selectedGateInfo,
                          }
                        ).join(
                          ", "
                        )}
                      </p>
                    </>
                  )}

                {/* SIDEBAR VARIABLE INPUT CONTROL */}

                {GATE_SPECS[
                  selectedGateInfo
                ]?.variableInputs &&
                  selectedNodeId && (
                    <div
                      style={{
                        marginTop:
                          "10px",
                      }}
                    >
                      <strong>
                        Inputs:{" "}
                        {
                          getNodeInputPorts(
                            nodes.find(
                              (node) =>
                                node.id ===
                                selectedNodeId
                            ) || {}
                          ).length
                        }
                      </strong>

                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "6px",
                          marginTop:
                            "8px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            changeGateInputCount(
                              selectedNodeId,
                              -1
                            )
                          }
                          disabled={
                            getNodeInputPorts(
                              nodes.find(
                                (node) =>
                                  node.id ===
                                  selectedNodeId
                              ) || {}
                            ).length <=
                            GATE_SPECS[
                              selectedGateInfo
                            ].minInputs
                          }
                        >
                          − Input
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            changeGateInputCount(
                              selectedNodeId,
                              1
                            )
                          }
                          disabled={
                            getNodeInputPorts(
                              nodes.find(
                                (node) =>
                                  node.id ===
                                  selectedNodeId
                              ) || {}
                            ).length >=
                            GATE_SPECS[
                              selectedGateInfo
                            ].maxInputs
                          }
                        >
                          + Input
                        </button>
                      </div>

                      <small
                        style={{
                          display:
                            "block",
                          marginTop:
                            "5px",
                          opacity:
                            0.7,
                        }}
                      >
                        Minimum: 2 |
                        Maximum: 8
                      </small>
                    </div>
                  )}

                <button
                  className="doc-learn-btn"
                  onClick={() =>
                    navigate(
                      "/learn"
                    )
                  }
                >
                  View Spec in Learn →
                </button>
              </div>
            ) : (
              <p className="doc-hint">
                Click a component on
                the canvas to inspect
                its parameters.
              </p>
            )}
          </div>
        </aside>

        {/* =================================================
            CIRCUIT AREA
            ================================================= */}

        <main className="circuit-area">
          {/* TOOLBAR */}

          <div className="builder-actions-toolbar">
            <div className="circuit-metadata-tag">
              <span className="circuit-title-display">
                {circuitName}
              </span>

              <span
                className={`status-pill ${
                  validationState.valid
                    ? "valid"
                    : "invalid"
                }`}
              >
                {validationState.valid
                  ? "● Ready"
                  : "● Incomplete"}
              </span>
            </div>

            <div className="builder-buttons-group">
              <button
                className="tb-btn"
                onClick={
                  handleOpenLoadModal
                }
              >
                📁 Load
              </button>

              <button
                className="tb-btn"
                onClick={() =>
                  setShowSaveModal(
                    true
                  )
                }
              >
                💾 Save
              </button>

              <button
                className="tb-btn"
                onClick={
                  handleOpenTruthTable
                }
              >
                📊 Truth Table
              </button>

              <button
                className="tb-btn"
                onClick={
                  handleOpenOptimize
                }
              >
                ⚡ Optimize
              </button>

              <button
                className="tb-btn validate-btn"
                onClick={
                  handleValidate
                }
              >
                ✓ Validate
              </button>

              <button
                className="tb-btn simulate-btn"
                onClick={
                  handleSimulatePageNav
                }
              >
                ▶ Simulate Mode
              </button>

              {selectedNodeId ||
              selectedConnId ? (
                <button
                  className="tb-btn delete-btn"
                  onClick={
                    deleteSelected
                  }
                >
                  🗑 Delete
                </button>
              ) : (
                <button
                  className="tb-btn clear-btn"
                  onClick={
                    clearCircuit
                  }
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* MESSAGE */}

          {actionMessage && (
            <div className="builder-message-bar">
              {actionMessage}
            </div>
          )}

          {/* =================================================
              CANVAS
              ================================================= */}

          <div
            className="circuit-canvas"
            ref={canvasRef}
            onMouseMove={
              handleCanvasMouseMove
            }
            onMouseUp={
              handleCanvasMouseUp
            }
            onClick={
              handleCanvasClick
            }
            style={{
              position:
                "relative",
            }}
          >
            {/* SVG WIRES */}

            <svg
              className="wires-svg-layer"
              style={{
                position:
                  "absolute",
                inset: 0,
                width:
                  "100%",
                height:
                  "100%",
                overflow:
                  "visible",
                pointerEvents:
                  "none",
              }}
            >
              <defs>
                <filter
                  id="glow-high"
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

              {connections.map(
                (
                  connection
                ) => {
                  const sourceNode =
                    nodes.find(
                      (node) =>
                        node.id ===
                        connection.fromNode
                    );

                  const targetNode =
                    nodes.find(
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

                  const signalValue =
                    getConnectionSignalValue(
                      connection
                    );

                  const isHigh =
                    signalValue ===
                    1;

                  const isSelected =
                    selectedConnId ===
                    connection.id;

                  const dx =
                    Math.max(
                      40,
                      Math.abs(
                        end.x -
                          start.x
                      ) *
                        0.5
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
                      className={`wire-group ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        setSelectedConnId(
                          connection.id
                        );

                        setSelectedNodeId(
                          null
                        );

                        setSelectedGateInfo(
                          null
                        );
                      }}
                      style={{
                        cursor:
                          "pointer",
                        pointerEvents:
                          "all",
                      }}
                    >
                      <path
                        d={pathD}
                        className="wire-hitbox"
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
                        filter={
                          isHigh
                            ? "url(#glow-high)"
                            : undefined
                        }
                      />
                    </g>
                  );
                }
              )}

              {pendingWire && (
                <path
                  d={`M ${pendingWire.startX} ${pendingWire.startY} L ${pendingWire.currentX} ${pendingWire.currentY}`}
                  className="wire-pending"
                />
              )}
            </svg>

            {/* =================================================
                NODES
                ================================================= */}

            {nodes.map(
              (node) => {
                const spec =
                  getSpec(node);

                const dynamicHeight =
                  getDynamicHeight(
                    node
                  );

                const isSelected =
                  selectedNodeId ===
                  node.id;

                const nodeValue =
                  simResults
                    ?.node_values?.[
                    node.id
                  ];

                const isSimpleValue =
                  nodeValue ===
                    0 ||
                  nodeValue ===
                    1;

                const isHigh =
                  isSimpleValue &&
                  nodeValue ===
                    1;

                const inputPorts =
                  getNodeInputPorts(
                    node
                  );

                const outputPorts =
                  getNodeOutputPorts(
                    node
                  );

                return (
                  <div
                    key={node.id}
                    className={`canvas-node-card node-${String(
                      node.type
                    ).toLowerCase()} ${
                      isSelected
                        ? "node-selected"
                        : ""
                    } ${
                      isHigh
                        ? "is-high"
                        : "is-low"
                    }`}
                    style={{
                      position:
                        "absolute",

                      left: `${node.x}px`,

                      top: `${node.y}px`,

                      width: `${spec.width}px`,

                      height: `${dynamicHeight}px`,

                      boxSizing:
                        "border-box",

                      zIndex:
                        isSelected
                          ? 15
                          : 5,

                      userSelect:
                        "none",
                    }}
                    onMouseDown={(event) => {
                          handleNodeMouseDown(node, event);
}}
                    
                  >
                    {/* =================================================
                        INPUT PORTS
                        ================================================= */}

                    {inputPorts.length >
                      0 && (
                      <div
                        className="node-ports-in"
                        style={{
                          position:
                            "absolute",
                          inset: 0,
                          pointerEvents:
                            "none",
                        }}
                      >
                        {inputPorts.map(
                          (
                            portName,
                            index
                          ) => {
                            const count =
                              inputPorts.length;

                            const topPercent =
                              count ===
                              1
                                ? 50
                                : 12 +
                                  (index /
                                    (count -
                                      1)) *
                                    76;

                            return (
                              <div
                                key={
                                  portName
                                }
                                style={{
                                  position:
                                    "absolute",
                                  left:
                                    "-6px",
                                  top:
                                    `${topPercent}%`,
                                  transform:
                                    "translateY(-50%)",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  pointerEvents:
                                    "auto",
                                  zIndex:
                                    20,
                                }}
                              >
                                <div
                                  className="port-circle in-port"
                                  title={`Input ${portName}`}
                                  onMouseDown={(
                                    event
                                  ) =>
                                    handlePortMouseDown(
                                      node,
                                      portName,
                                      false,
                                      event
                                    )
                                  }
                                  onMouseUp={(
                                    event
                                  ) =>
                                    handlePortMouseUp(
                                      node,
                                      portName,
                                      false,
                                      event
                                    )
                                  }
                                  style={{
                                    width:
                                      "12px",
                                    height:
                                      "12px",
                                  }}
                                />

                                {spec.category ===
                                  "combinational" && (
                                  <span
                                    style={{
                                      marginLeft:
                                        "7px",

                                      fontSize:
                                        "8px",

                                      fontWeight:
                                        "700",

                                      color:
                                        "#dbeafe",

                                      whiteSpace:
                                        "nowrap",

                                      pointerEvents:
                                        "none",
                                    }}
                                  >
                                    {
                                      portName
                                    }
                                  </span>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {/* =================================================
                        NODE BODY
                        ================================================= */}

                    <div
                      className="node-body"
                      style={{
                        position:
                          "relative",

                        width:
                          "100%",

                        height:
                          "100%",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        flexDirection:
                          "column",

                        gap:
                          "4px",

                        padding:
                          "8px",

                        boxSizing:
                          "border-box",

                        zIndex: 2,
                      }}
                    >
                      {/* NODE TYPE */}

                      <span className="node-type-label">
                        {
                          COMPONENT_NAMES[
                            node.type
                          ] ||
                          node.type
                        }
                      </span>

                      {/* CUSTOM LABEL */}

                      <span className="node-custom-label">
                        {node.label}
                      </span>

{/* =================================================
    VARIABLE INPUT + / - CONTROL
    ================================================= */}

{spec.variableInputs && isSelected && (
  <div
    className="variable-input-control"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      marginTop: "6px",
      padding: "4px 6px",
      borderRadius: "6px",
      background: "rgba(15, 23, 42, 0.96)",
      border: "1px solid rgba(56, 189, 248, 0.6)",
      position: "relative",
      zIndex: 1000,
      pointerEvents: "auto",
    }}
    onMouseDown={(event) => {
      event.stopPropagation();
    }}
    onPointerDown={(event) => {
      event.stopPropagation();
    }}
    onClick={(event) => {
      event.stopPropagation();
    }}
  >
    <button
      type="button"
      className="variable-input-button"
      disabled={
        inputPorts.length <= (spec.minInputs || 2)
      }
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();

        if (
          inputPorts.length >
          (spec.minInputs || 2)
        ) {
          changeGateInputCount(node.id, -1);
        }
      }}
      style={{
        width: "26px",
        height: "26px",
        border: "none",
        borderRadius: "5px",
        cursor:
          inputPorts.length <= (spec.minInputs || 2)
            ? "not-allowed"
            : "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        pointerEvents: "auto",
      }}
    >
      −
    </button>

    <span
      style={{
        minWidth: "70px",
        textAlign: "center",
        fontSize: "11px",
        fontWeight: "700",
        color: "#ffffff",
        userSelect: "none",
      }}
    >
      {inputPorts.length} INPUTS
    </span>

    <button
      type="button"
      className="variable-input-button"
      disabled={
        inputPorts.length >= (spec.maxInputs || 8)
      }
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();

        if (
          inputPorts.length <
          (spec.maxInputs || 8)
        ) {
          changeGateInputCount(node.id, 1);
        }
      }}
      style={{
        width: "26px",
        height: "26px",
        border: "none",
        borderRadius: "5px",
        cursor:
          inputPorts.length >= (spec.maxInputs || 8)
            ? "not-allowed"
            : "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        pointerEvents: "auto",
      }}
    >
      +
    </button>
  </div>
)}

                      {/* =================================================
                          INPUT
                          ================================================= */}

                      {node.type ===
                        "INPUT" && (
                        <button
                          type="button"
                          className={`input-toggle-badge ${
                            node.state ===
                            1
                              ? "high"
                              : "low"
                          }`}
                          onClick={(
                            event
                          ) =>
                            toggleInputState(
                              node.id,
                              event
                            )
                          }
                          title="Click to toggle binary state"
                        >
                          {node.state ===
                          1
                            ? "1"
                            : "0"}
                        </button>
                      )}

                      {/* =================================================
                          OUTPUT
                          ================================================= */}

                      {node.type ===
                        "OUTPUT" && (
                        <span
                          className={`output-badge ${
                            isHigh
                              ? "high"
                              : "low"
                          }`}
                        >
                          {
                            isSimpleValue
                              ? nodeValue
                              : 0
                          }
                        </span>
                      )}

                      {/* =================================================
                          MULTI OUTPUT PREVIEW
                          ================================================= */}

                      {outputPorts.length >
                        1 && (
                        <div
                          style={{
                            display:
                              "flex",

                            flexWrap:
                              "wrap",

                            justifyContent:
                              "center",

                            gap:
                              "3px",

                            maxWidth:
                              "92%",

                            maxHeight:
                              Math.max(
                                30,
                                dynamicHeight -
                                  70
                              ),

                            overflow:
                              "hidden",
                          }}
                        >
                          {outputPorts.map(
                            (
                              portName
                            ) => {
                              let value =
                                simResults
                                  ?.node_values?.[
                                  node.id
                                ];

                              if (
                                value &&
                                typeof value ===
                                  "object"
                              ) {
                                value =
                                  value[
                                    portName
                                  ];
                              }

                              if (
                                value !==
                                  0 &&
                                value !==
                                  1
                              ) {
                                value = 0;
                              }

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
                                  {
                                    portName
                                  }
                                  :
                                  {value}
                                </span>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        OUTPUT PORTS
                        ================================================= */}

                    {outputPorts.length >
                      0 && (
                      <div
                        className="node-ports-out"
                        style={{
                          position:
                            "absolute",

                          inset: 0,

                          pointerEvents:
                            "none",
                        }}
                      >
                        {outputPorts.map(
                          (
                            portName,
                            index
                          ) => {
                            const count =
                              outputPorts.length;

                            const topPercent =
                              count ===
                              1
                                ? 50
                                : 12 +
                                  (index /
                                    (count -
                                      1)) *
                                    76;

                            return (
                              <div
                                key={
                                  portName
                                }
                                style={{
                                  position:
                                    "absolute",

                                  right:
                                    "-6px",

                                  top:
                                    `${topPercent}%`,

                                  transform:
                                    "translateY(-50%)",

                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  pointerEvents:
                                    "auto",

                                  zIndex:
                                    20,
                                }}
                              >
                                {spec.category ===
                                  "combinational" && (
                                  <span
                                    style={{
                                      position:
                                        "absolute",

                                      right:
                                        "18px",

                                      fontSize:
                                        "8px",

                                      fontWeight:
                                        "700",

                                      color:
                                        "#dbeafe",

                                      whiteSpace:
                                        "nowrap",

                                      pointerEvents:
                                        "none",
                                    }}
                                  >
                                    {
                                      portName
                                    }
                                  </span>
                                )}

                                <div
                                  className="port-circle out-port"
                                  title={`Output ${portName}`}
                                  onMouseDown={(
                                    event
                                  ) =>
                                    handlePortMouseDown(
                                      node,
                                      portName,
                                      true,
                                      event
                                    )
                                  }
                                  style={{
                                    width:
                                      "12px",

                                    height:
                                      "12px",
                                  }}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* FOOTER HELP */}

          <div className="canvas-footer-help">
            <span>
              💡 <b>Wire:</b> Click
              an output port, then
              click an input port.
            </span>

            <span>
              💡 <b>Drag:</b> Move
              components around the
              canvas.
            </span>

            <span>
              💡 <b>Input:</b> Click
              0/1 on INPUT nodes.
            </span>

            <span>
              💡 <b>Variable Gates:</b>{" "}
              Select AND/OR/NAND/NOR/
              XOR/XNOR and use
              the − / + buttons on
              the selected gate.
            </span>

            <span>
              💡 <b>Delete:</b> Select
              component/wire and press
              Delete.
            </span>
          </div>
        </main>
      </div>

      {/* =========================================================
          TRUTH TABLE MODAL
          ========================================================= */}

      {showTruthTableModal &&
        truthTableData && (
          <div
            className="builder-modal-overlay"
            onClick={() =>
              setShowTruthTableModal(
                false
              )
            }
          >
            <div
              className="builder-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <h3>
                  Dynamic Truth Table (
                  {truthTableData.rows
                    ?.length ||
                    0}{" "}
                  States)
                </h3>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowTruthTableModal(
                      false
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <p className="modal-sub">
                Generated automatically
                from the current circuit
                across all 2
                <sup>
                  {truthTableData
                    .input_headers
                    ?.length ||
                    0}
                </sup>{" "}
                input combinations.
              </p>

              <div className="table-wrapper">
                <table className="truth-table-view">
                  <thead>
                    <tr>
                      {truthTableData.input_headers?.map(
                        (header) => (
                          <th
                            key={
                              header
                            }
                            className="th-in"
                          >
                            {
                              header
                            }
                          </th>
                        )
                      )}

                      {truthTableData.output_headers?.map(
                        (header) => (
                          <th
                            key={
                              header
                            }
                            className="th-out"
                          >
                            {
                              header
                            }
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {truthTableData.rows?.map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            rowIndex
                          }
                        >
                          {truthTableData.input_headers?.map(
                            (header) => (
                              <td
                                key={
                                  header
                                }
                                className="td-in"
                              >
                                {
                                  row[
                                    header
                                  ]
                                }
                              </td>
                            )
                          )}

                          {truthTableData.output_headers?.map(
                            (header) => (
                              <td
                                key={
                                  header
                                }
                                className={`td-out ${
                                  row[
                                    header
                                  ] ===
                                  1
                                    ? "val-high"
                                    : "val-low"
                                }`}
                              >
                                {
                                  row[
                                    header
                                  ]
                                }
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button
                  className="primary-btn"
                  onClick={() =>
                    setShowTruthTableModal(
                      false
                    )
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =========================================================
          OPTIMIZATION MODAL
          ========================================================= */}

      {showOptimizeModal &&
        optimizationData && (
          <div
            className="builder-modal-overlay"
            onClick={() =>
              setShowOptimizeModal(
                false
              )
            }
          >
            <div
              className="builder-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <h3>
                  Boolean Circuit
                  Optimization
                </h3>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowOptimizeModal(
                      false
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <div
                className={`opt-banner ${
                  optimizationData.can_optimize
                    ? "success"
                    : "neutral"
                }`}
              >
                {
                  optimizationData.message
                }
              </div>

              <div className="opt-expr-comparison">
                <div className="expr-box">
                  <span className="expr-label">
                    ORIGINAL EXPRESSION
                  </span>

                  <code className="expr-text">
                    {
                      optimizationData.original_expression ||
                      "None"
                    }
                  </code>
                </div>

                <div className="expr-arrow">
                  →
                </div>

                <div className="expr-box">
                  <span className="expr-label">
                    MINIMAL SIMPLIFIED
                    FORM
                  </span>

                  <code className="expr-text highlight">
                    {
                      optimizationData.simplified_expression ||
                      "None"
                    }
                  </code>
                </div>
              </div>

              <div className="opt-metrics-grid">
                <div className="metric-compare-card">
                  <span className="m-title">
                    Gate Count
                  </span>

                  <div className="m-values">
                    <span className="m-orig">
                      {
                        optimizationData
                          .original_metrics
                          ?.gate_count
                      }
                    </span>

                    <span>
                      →
                    </span>

                    <span className="m-opt">
                      {
                        optimizationData
                          .optimized_metrics
                          ?.gate_count
                      }
                    </span>
                  </div>
                </div>

                <div className="metric-compare-card">
                  <span className="m-title">
                    Connections
                  </span>

                  <div className="m-values">
                    <span className="m-orig">
                      {
                        optimizationData
                          .original_metrics
                          ?.connection_count
                      }
                    </span>

                    <span>
                      →
                    </span>

                    <span className="m-opt">
                      {
                        optimizationData
                          .optimized_metrics
                          ?.connection_count
                      }
                    </span>
                  </div>
                </div>

                <div className="metric-compare-card">
                  <span className="m-title">
                    Circuit Depth
                  </span>

                  <div className="m-values">
                    <span className="m-orig">
                      {
                        optimizationData
                          .original_metrics
                          ?.circuit_depth
                      }
                    </span>

                    <span>
                      →
                    </span>

                    <span className="m-opt">
                      {
                        optimizationData
                          .optimized_metrics
                          ?.circuit_depth
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="opt-steps-list">
                <h4>
                  Derivation &
                  Simplification Steps
                </h4>

                <ul>
                  {optimizationData.explanation_steps?.map(
                    (
                      step,
                      index
                    ) => (
                      <li
                        key={
                          index
                        }
                      >
                        {step}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="modal-footer">
                {optimizationData.can_optimize && (
                  <button
                    className="primary-btn"
                    onClick={
                      handleApplyOptimizedCircuit
                    }
                  >
                    Apply Optimized
                    Circuit to Canvas
                  </button>
                )}

                <button
                  className="secondary-btn"
                  onClick={() =>
                    setShowOptimizeModal(
                      false
                    )
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =========================================================
          SAVE MODAL
          ========================================================= */}

      {showSaveModal && (
        <div
          className="builder-modal-overlay"
          onClick={() =>
            setShowSaveModal(
              false
            )
          }
        >
          <div
            className="builder-modal-card small"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h3>
                Save Circuit to
                Cloud Database
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setShowSaveModal(
                    false
                  )
                }
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>
                Circuit Name
              </label>

              <input
                type="text"
                value={
                  circuitName
                }
                onChange={(
                  event
                ) =>
                  setCircuitName(
                    event.target
                      .value
                  )
                }
                placeholder="e.g. 4-bit Adder"
              />
            </div>

            <div className="form-group">
              <label>
                Description
                (optional)
              </label>

              <textarea
                value={
                  circuitDescription
                }
                onChange={(
                  event
                ) =>
                  setCircuitDescription(
                    event.target
                      .value
                  )
                }
                placeholder="Notes about the circuit..."
                rows={3}
              />
            </div>

            <div className="modal-footer">
              <button
                className="primary-btn"
                onClick={
                  handleSaveCircuit
                }
                disabled={
                  isSaving
                }
              >
                {isSaving
                  ? "Saving..."
                  : "Save Circuit"}
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setShowSaveModal(
                    false
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LOAD MODAL
          ========================================================= */}

      {showLoadModal && (
        <div
          className="builder-modal-overlay"
          onClick={() =>
            setShowLoadModal(
              false
            )
          }
        >
          <div
            className="builder-modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h3>
                Load Circuit
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setShowLoadModal(
                    false
                  )
                }
              >
                ✕
              </button>
            </div>

            <div className="load-modal-sections">
              {/* USER CIRCUITS */}

              <div className="load-section">
                <h4>
                  Your Cloud
                  Circuits
                </h4>

                {savedCircuitsList.length ===
                0 ? (
                  <p className="load-empty">
                    No saved circuits
                    found in cloud
                    database.
                  </p>
                ) : (
                  <div className="load-items-list">
                    {savedCircuitsList.map(
                      (circuit) => (
                        <div
                          key={
                            circuit.id
                          }
                          className="load-item"
                          onClick={() =>
                            handleSelectToLoad(
                              circuit
                            )
                          }
                        >
                          <div>
                            <strong>
                              {
                                circuit.name
                              }
                            </strong>

                            <span className="load-meta">
                              (
                              {
                                circuit
                                  .nodes
                                  ?.length ||
                                0
                              }{" "}
                              nodes)
                            </span>
                          </div>

                          <button className="card-action-btn edit">
                            Load
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* PRESETS */}

              <div className="load-section">
                <h4>
                  Standard
                  Presets
                </h4>

                <div className="load-items-list">
                  {examplePresets.map(
                    (preset) => (
                      <div
                        key={
                          preset.id
                        }
                        className="load-item"
                        onClick={() =>
                          handleSelectToLoad(
                            preset
                          )
                        }
                      >
                        <div>
                          <strong>
                            {
                              preset.name
                            }
                          </strong>

                          <p className="load-desc">
                            {
                              preset.description
                            }
                          </p>
                        </div>

                        <button className="card-action-btn edit">
                          Load
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() =>
                  setShowLoadModal(
                    false
                  )
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Build;