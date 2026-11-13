import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./Learn.css";

/* =========================================================
   COMBINATIONAL CIRCUIT DATA
   ========================================================= */

const combinationalCircuits = [
  {
    type: "HALF ADDER",
    name: "Half Adder",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 2,
    inputNames: ["A", "B"],
    outputNames: ["Sum", "Carry"],
    expression: "Sum = A ⊕ B    |    Carry = A · B",
    behavior:
      "Adds two single-bit binary numbers. The Sum represents the result bit and Carry represents the carry generated from the addition.",
    description:
      "A Half Adder is a combinational circuit that adds two binary inputs, A and B. It produces two outputs: Sum and Carry. It is called a half adder because it does not accept a carry input from a previous stage.",
    truthTable: [
      { A: 0, B: 0, Sum: 0, Carry: 0 },
      { A: 0, B: 1, Sum: 1, Carry: 0 },
      { A: 1, B: 0, Sum: 1, Carry: 0 },
      { A: 1, B: 1, Sum: 0, Carry: 1 },
    ],
  },

  {
    type: "FULL ADDER",
    name: "Full Adder",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 3,
    inputNames: ["A", "B", "Cin"],
    outputNames: ["Sum", "Carry"],
    expression: "Sum = A ⊕ B ⊕ Cin    |    Carry = AB + ACin + BCin",
    behavior:
      "Adds three single-bit inputs: A, B, and the carry input Cin. It produces a Sum bit and a Carry output.",
    description:
      "A Full Adder adds two binary bits along with a carry input from a previous addition. It is commonly used to build multi-bit binary adders.",
    truthTable: [
      { A: 0, B: 0, Cin: 0, Sum: 0, Carry: 0 },
      { A: 0, B: 0, Cin: 1, Sum: 1, Carry: 0 },
      { A: 0, B: 1, Cin: 0, Sum: 1, Carry: 0 },
      { A: 0, B: 1, Cin: 1, Sum: 0, Carry: 1 },
      { A: 1, B: 0, Cin: 0, Sum: 1, Carry: 0 },
      { A: 1, B: 0, Cin: 1, Sum: 0, Carry: 1 },
      { A: 1, B: 1, Cin: 0, Sum: 0, Carry: 1 },
      { A: 1, B: 1, Cin: 1, Sum: 1, Carry: 1 },
    ],
  },

  {
    type: "HALF SUBTRACTOR",
    name: "Half Subtractor",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 2,
    inputNames: ["A", "B"],
    outputNames: ["Difference", "Borrow"],
    expression: "Difference = A ⊕ B    |    Borrow = A' · B",
    behavior:
      "Subtracts one single-bit binary number B from A and produces Difference and Borrow outputs.",
    description:
      "A Half Subtractor performs subtraction of two binary bits. The Difference output represents the subtraction result, while Borrow indicates whether a borrow is required.",
    truthTable: [
      { A: 0, B: 0, Difference: 0, Borrow: 0 },
      { A: 0, B: 1, Difference: 1, Borrow: 1 },
      { A: 1, B: 0, Difference: 1, Borrow: 0 },
      { A: 1, B: 1, Difference: 0, Borrow: 0 },
    ],
  },

  {
    type: "FULL SUBTRACTOR",
    name: "Full Subtractor",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 3,
    inputNames: ["A", "B", "Bin"],
    outputNames: ["Difference", "Borrow"],
    expression: "Difference = A ⊕ B ⊕ Bin    |    Borrow = A'B + A'Bin + BBin",
    behavior:
      "Subtracts B and the borrow input Bin from A. It produces Difference and Borrow outputs.",
    description:
      "A Full Subtractor performs binary subtraction while considering a borrow from a previous lower-order bit. It is useful for constructing multi-bit binary subtractors.",
    truthTable: [
      { A: 0, B: 0, Bin: 0, Difference: 0, Borrow: 0 },
      { A: 0, B: 0, Bin: 1, Difference: 1, Borrow: 1 },
      { A: 0, B: 1, Bin: 0, Difference: 1, Borrow: 1 },
      { A: 0, B: 1, Bin: 1, Difference: 0, Borrow: 1 },
      { A: 1, B: 0, Bin: 0, Difference: 1, Borrow: 0 },
      { A: 1, B: 0, Bin: 1, Difference: 0, Borrow: 0 },
      { A: 1, B: 1, Bin: 0, Difference: 0, Borrow: 0 },
      { A: 1, B: 1, Bin: 1, Difference: 1, Borrow: 1 },
    ],
  },

  {
    type: "2:1 MUX",
    name: "2:1 Multiplexer",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 3,
    inputNames: ["I0", "I1", "S"],
    outputNames: ["Y"],
    expression: "Y = S'I0 + SI1",
    behavior:
      "Selects one of two input signals and sends the selected signal to the output.",
    description:
      "A 2:1 Multiplexer, or MUX, is a data selector. It has two data inputs, one select input, and one output. When S = 0, I0 is selected. When S = 1, I1 is selected.",
    truthTable: [
      { I0: 0, I1: 0, S: 0, Y: 0 },
      { I0: 0, I1: 1, S: 0, Y: 0 },
      { I0: 1, I1: 0, S: 0, Y: 1 },
      { I0: 1, I1: 1, S: 0, Y: 1 },
      { I0: 0, I1: 0, S: 1, Y: 0 },
      { I0: 0, I1: 1, S: 1, Y: 1 },
      { I0: 1, I1: 0, S: 1, Y: 0 },
      { I0: 1, I1: 1, S: 1, Y: 1 },
    ],
  },

  {
    type: "1:2 DEMUX",
    name: "1:2 Demultiplexer",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 2,
    inputNames: ["D", "S"],
    outputNames: ["Y0", "Y1"],
    expression: "Y0 = D·S'    |    Y1 = D·S",
    behavior:
      "Routes one input signal to one of two output lines according to the select input.",
    description:
      "A 1:2 Demultiplexer performs the opposite function of a multiplexer. It takes one data input and routes it to one of two outputs depending on the select signal.",
    truthTable: [
      { D: 0, S: 0, Y0: 0, Y1: 0 },
      { D: 0, S: 1, Y0: 0, Y1: 0 },
      { D: 1, S: 0, Y0: 1, Y1: 0 },
      { D: 1, S: 1, Y0: 0, Y1: 1 },
    ],
  },

  {
    type: "2:4 DECODER",
    name: "2-to-4 Decoder",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 2,
    inputNames: ["A", "B"],
    outputNames: ["Y0", "Y1", "Y2", "Y3"],
    expression:
      "Y0 = A'B'    |    Y1 = A'B    |    Y2 = AB'    |    Y3 = AB",
    behavior:
      "Converts a binary input combination into one active output line.",
    description:
      "A 2-to-4 Decoder has two binary inputs and four outputs. For every input combination, exactly one output line is activated.",
    truthTable: [
      { A: 0, B: 0, Y0: 1, Y1: 0, Y2: 0, Y3: 0 },
      { A: 0, B: 1, Y0: 0, Y1: 1, Y2: 0, Y3: 0 },
      { A: 1, B: 0, Y0: 0, Y1: 0, Y2: 1, Y3: 0 },
      { A: 1, B: 1, Y0: 0, Y1: 0, Y2: 0, Y3: 1 },
    ],
  },

  {
    type: "4:2 ENCODER",
    name: "4-to-2 Encoder",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 4,
    inputNames: ["D0", "D1", "D2", "D3"],
    outputNames: ["A", "B"],
    expression: "A = D2 + D3    |    B = D1 + D3",
    behavior:
      "Converts one active input line into its corresponding binary code.",
    description:
      "A 4-to-2 Encoder has four input lines and two output lines. When one input is active, the encoder produces the corresponding two-bit binary code.",
    truthTable: [
      { D0: 1, D1: 0, D2: 0, D3: 0, A: 0, B: 0 },
      { D0: 0, D1: 1, D2: 0, D3: 0, A: 0, B: 1 },
      { D0: 0, D1: 0, D2: 1, D3: 0, A: 1, B: 0 },
      { D0: 0, D1: 0, D2: 0, D3: 1, A: 1, B: 1 },
    ],
  },

  {
    type: "1-BIT COMPARATOR",
    name: "1-bit Comparator",
    category: "COMBINATIONAL CIRCUITS",
    inputs: 2,
    inputNames: ["A", "B"],
    outputNames: ["A>B", "A=B", "A<B"],
    expression: "A>B = AB'    |    A=B = A'B' + AB    |    A<B = A'B",
    behavior:
      "Compares two binary bits and indicates whether A is greater than, equal to, or less than B.",
    description:
      "A 1-bit Comparator compares two binary inputs. It produces three outputs representing the three possible relationships between A and B.",
    truthTable: [
      { A: 0, B: 0, "A>B": 0, "A=B": 1, "A<B": 0 },
      { A: 0, B: 1, "A>B": 0, "A=B": 0, "A<B": 1 },
      { A: 1, B: 0, "A>B": 1, "A=B": 0, "A<B": 0 },
      { A: 1, B: 1, "A>B": 0, "A=B": 1, "A<B": 0 },
    ],
  },
];

/* =========================================================
   COMPONENT
   ========================================================= */

function Learn() {
  const navigate = useNavigate();

  const [gates, setGates] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const [testInputs, setTestInputs] = useState({
    A: 1,
    B: 0,
    Cin: 0,
    Bin: 0,
    I0: 0,
    I1: 1,
    S: 0,
    D: 1,
    D0: 1,
    D1: 0,
    D2: 0,
    D3: 0,
  });

  /* =======================================================
     LOAD EXISTING LOGIC GATES
     ======================================================= */

  useEffect(() => {
    api
      .getGates()
      .then((res) => {
        if (res.gates) {
          setGates(res.gates);

          // Keep the original default AND gate if available
          const andIndex = res.gates.findIndex((g) => g.type === "AND");

          if (andIndex >= 0) {
            setActiveItem({
              kind: "gate",
              index: andIndex,
            });
          } else if (res.gates.length > 0) {
            setActiveItem({
              kind: "gate",
              index: 0,
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  /* =======================================================
     ACTIVE ITEM
     ======================================================= */

  const activeGate =
    activeItem?.kind === "gate"
      ? gates[activeItem.index]
      : null;

  const activeCircuit =
    activeItem?.kind === "circuit"
      ? combinationalCircuits[activeItem.index]
      : null;

  /* =======================================================
     GATE OUTPUT
     ======================================================= */

  const calculateGateOutput = (gate, inputs) => {
    if (!gate) return 0;

    const a = inputs.A;
    const b = inputs.B;

    switch (gate.type) {
      case "INPUT":
        return a;

      case "OUTPUT":
        return a;

      case "NOT":
        return a === 1 ? 0 : 1;

      case "AND":
        return a === 1 && b === 1 ? 1 : 0;

      case "OR":
        return a === 1 || b === 1 ? 1 : 0;

      case "NAND":
        return !(a === 1 && b === 1) ? 1 : 0;

      case "NOR":
        return !(a === 1 || b === 1) ? 1 : 0;

      case "XOR":
        return a !== b ? 1 : 0;

      case "XNOR":
        return a === b ? 1 : 0;

      default:
        return 0;
    }
  };

  /* =======================================================
     CIRCUIT OUTPUT
     ======================================================= */

  const calculateCircuitOutput = (circuit, inputs) => {
    if (!circuit) return {};

    const A = inputs.A;
    const B = inputs.B;
    const Cin = inputs.Cin;
    const Bin = inputs.Bin;
    const I0 = inputs.I0;
    const I1 = inputs.I1;
    const S = inputs.S;
    const D = inputs.D;

    switch (circuit.type) {
      case "HALF ADDER":
        return {
          Sum: A ^ B,
          Carry: A & B,
        };

      case "FULL ADDER": {
        const total = A + B + Cin;

        return {
          Sum: total % 2,
          Carry: total >= 2 ? 1 : 0,
        };
      }

      case "HALF SUBTRACTOR":
        return {
          Difference: A ^ B,
          Borrow: A === 0 && B === 1 ? 1 : 0,
        };

      case "FULL SUBTRACTOR": {
        const result = A - B - Bin;

        return {
          Difference: ((result % 2) + 2) % 2,
          Borrow: result < 0 ? 1 : 0,
        };
      }

      case "2:1 MUX":
        return {
          Y: S === 0 ? I0 : I1,
        };

      case "1:2 DEMUX":
        return {
          Y0: S === 0 ? D : 0,
          Y1: S === 1 ? D : 0,
        };

      case "2:4 DECODER": {
        const value = A * 2 + B;

        return {
          Y0: value === 0 ? 1 : 0,
          Y1: value === 1 ? 1 : 0,
          Y2: value === 2 ? 1 : 0,
          Y3: value === 3 ? 1 : 0,
        };
      }

      case "4:2 ENCODER": {
        if (inputs.D3 === 1) {
          return { A: 1, B: 1 };
        }

        if (inputs.D2 === 1) {
          return { A: 1, B: 0 };
        }

        if (inputs.D1 === 1) {
          return { A: 0, B: 1 };
        }

        return { A: 0, B: 0 };
      }

      case "1-BIT COMPARATOR":
        return {
          "A>B": A > B ? 1 : 0,
          "A=B": A === B ? 1 : 0,
          "A<B": A < B ? 1 : 0,
        };

      default:
        return {};
    }
  };

  const gateOutput = calculateGateOutput(activeGate, testInputs);

  const circuitOutputs = calculateCircuitOutput(
    activeCircuit,
    testInputs
  );

  /* =======================================================
     INPUT TOGGLE
     ======================================================= */

  const toggleInput = (inputName) => {
    setTestInputs((prev) => ({
      ...prev,
      [inputName]: prev[inputName] === 1 ? 0 : 1,
    }));
  };

  /* =======================================================
     BUILDER
     ======================================================= */

  const handleOpenInBuilder = () => {
    navigate("/build");
  };

  /* =======================================================
     RENDER INPUT BUTTON
     ======================================================= */

  const renderInputButton = (inputName) => (
    <button
      key={inputName}
      className={`test-input-btn ${
        testInputs[inputName] === 1 ? "high" : "low"
      }`}
      onClick={() => toggleInput(inputName)}
    >
      {inputName} = {testInputs[inputName]}
    </button>
  );

  /* =======================================================
     RENDER OUTPUT
     ======================================================= */

  const renderOutputBadge = (outputName, value) => (
    <div
      key={outputName}
      className={`test-output-badge ${
        value === 1 ? "high" : "low"
      }`}
    >
      {outputName} = {value}
    </div>
  );

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="learn-page">
      <Navbar />

      <main className="learn-content">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="learn-header">
          <span className="learn-eyebrow">
            DIGITAL LOGIC COMPENDIUM
          </span>

          <h1>Logic Gates & Components</h1>

          <p>
            Comprehensive reference guide for digital logic
            components, truth tables, Boolean expressions,
            and combinational circuits.
          </p>
        </div>

        <div className="learn-layout">

          {/* =================================================
              LEFT NAVIGATION
          ================================================= */}

          <aside className="gate-selector-list">

            {/* LOGIC GATES */}

            <h3>LOGIC GATES</h3>

            {gates.map((g, idx) => (
              <div
                key={g.type}
                className={`gate-nav-card ${
                  activeItem?.kind === "gate" &&
                  activeItem.index === idx
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveItem({
                    kind: "gate",
                    index: idx,
                  })
                }
              >
                <div className="gate-badge">
                  {g.type}
                </div>

                <div className="gate-meta">
                  <span className="gate-name">
                    {g.name}
                  </span>

                  <span className="gate-symbol">
                    {g.symbol}
                  </span>
                </div>
              </div>
            ))}

            {/* COMBINATIONAL CIRCUITS */}

            <h3 className="component-section-title">
              COMBINATIONAL CIRCUITS
            </h3>

            {combinationalCircuits.map((circuit, idx) => (
              <div
                key={circuit.type}
                className={`gate-nav-card ${
                  activeItem?.kind === "circuit" &&
                  activeItem.index === idx
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveItem({
                    kind: "circuit",
                    index: idx,
                  })
                }
              >
                <div className="gate-badge">
                  {circuit.type}
                </div>

                <div className="gate-meta">
                  <span className="gate-name">
                    {circuit.name}
                  </span>

                  <span className="gate-symbol">
                    {circuit.inputNames.length} IN
                  </span>
                </div>
              </div>
            ))}
          </aside>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          {(activeGate || activeCircuit) && (
            <section className="gate-detail-panel">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="gate-spec-header">
                <div>

                  <span className="gate-type-tag">
                    {activeGate
                      ? `${activeGate.type} GATE`
                      : activeCircuit.type}
                  </span>

                  <h2>
                    {activeGate
                      ? activeGate.name
                      : activeCircuit.name}
                  </h2>
                </div>

                <button
                  className="open-builder-btn"
                  onClick={handleOpenInBuilder}
                >
                  Launch in Circuit Builder →
                </button>
              </div>

              {/* =================================================
                  INFO CARDS
              ================================================= */}

              <div className="spec-info-cards">

                <div className="spec-card">
                  <span className="spec-label">
                    {activeGate
                      ? "BOOLEAN EXPRESSION"
                      : "BOOLEAN EXPRESSIONS"}
                  </span>

                  <code className="spec-code">
                    {activeGate
                      ? activeGate.expression
                      : activeCircuit.expression}
                  </code>
                </div>

                <div className="spec-card">
                  <span className="spec-label">
                    LOGIC BEHAVIOR
                  </span>

                  <p className="spec-text">
                    {activeGate
                      ? activeGate.behavior
                      : activeCircuit.behavior}
                  </p>
                </div>

              </div>

              {/* =================================================
                  INPUT / OUTPUT INFORMATION
              ================================================= */}

              <div className="spec-info-cards">

                <div className="spec-card">
                  <span className="spec-label">
                    INPUTS
                  </span>

                  <div className="component-pills">
                    {(activeGate
                      ? Array.from({
                          length: activeGate.inputs || 1,
                        }).map((_, index) =>
                          index === 0 ? "A" : "B"
                        )
                      : activeCircuit.inputNames
                    ).map((input) => (
                      <span
                        key={input}
                        className="component-pill"
                      >
                        {input}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="spec-card">
                  <span className="spec-label">
                    OUTPUTS
                  </span>

                  <div className="component-pills">
                    {(activeGate
                      ? ["OUT"]
                      : activeCircuit.outputNames
                    ).map((output) => (
                      <span
                        key={output}
                        className="component-pill"
                      >
                        {output}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="spec-desc-block">
                <h3>Functional Description</h3>

                <p>
                  {activeGate
                    ? activeGate.description
                    : activeCircuit.description}
                </p>
              </div>

              {/* =================================================
                  TRUTH TABLE + TESTER
              ================================================= */}

              <div className="spec-two-col">

                {/* =================================================
                    TRUTH TABLE
                ================================================= */}

                {(activeGate?.truthTable ||
                  activeCircuit?.truthTable) && (
                  <div className="spec-table-box">

                    <h3>Formal Truth Table</h3>

                    <div className="truth-table-scroll">
                      <table className="spec-table">

                        <thead>
                          <tr>
                            {Object.keys(
                              (
                                activeGate?.truthTable ||
                                activeCircuit?.truthTable
                              )[0] || {}
                            ).map((key) => (
                              <th key={key}>
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {(
                            activeGate?.truthTable ||
                            activeCircuit?.truthTable
                          ).map((row, rowIndex) => (
                            <tr key={rowIndex}>

                              {Object.entries(row).map(
                                ([key, value]) => (
                                  <td
                                    key={key}
                                    className={
                                      value === 1
                                        ? "t-val-1"
                                        : "t-val-0"
                                    }
                                  >
                                    {value}
                                  </td>
                                )
                              )}

                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  </div>
                )}

                {/* =================================================
                    INTERACTIVE TESTER
                ================================================= */}

                <div className="spec-tester-box">

                  <h3>
                    Interactive Component Sandbox
                  </h3>

                  <p className="tester-sub">
                    Click input signals to verify the
                    output state in real time.
                  </p>

                  <div className="interactive-gate-diagram">

                    {/* INPUTS */}

                    <div className="inputs-col">

                      {(activeGate
                        ? activeGate.type === "NOT"
                          ? ["A"]
                          : ["A", "B"]
                        : activeCircuit.inputNames
                      ).map(renderInputButton)}

                    </div>

                    {/* COMPONENT */}

                    <div className="gate-box-visual">

                      <span className="diagram-gate-type">
                        {activeGate
                          ? activeGate.type
                          : activeCircuit.type}
                      </span>

                      <span className="diagram-gate-symbol">
                        {activeGate
                          ? activeGate.symbol
                          : "◆"}
                      </span>

                    </div>

                    {/* OUTPUTS */}

                    <div className="outputs-col">

                      {activeGate &&
                        renderOutputBadge(
                          "OUT",
                          gateOutput
                        )}

                      {activeCircuit &&
                        activeCircuit.outputNames.map(
                          (outputName) =>
                            renderOutputBadge(
                              outputName,
                              circuitOutputs[outputName] ??
                                0
                            )
                        )}

                    </div>

                  </div>
                </div>

              </div>

            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default Learn;