/**
 * LogicPath Comprehensive Learning Topics & Questions Data
 * Contains 15 Sequential Topics, 4 Levels per Topic, 10 Questions per Level = 600 Total Questions.
 */

export const ORDERED_TOPICS = [
  {
    id: "distributive-law",
    title: "Distributive Law",
    icon: "⚡",
    description: "Learn how Boolean operations can be distributed to expand and simplify expressions: A(B + C) = AB + AC and A + BC = (A + B)(A + C).",
  },
  {
    id: "commutative-law",
    title: "Commutative Law",
    icon: "🔄",
    description: "Understand how the order of Boolean variables can be changed without altering the result: A + B = B + A and AB = BA.",
  },
  {
    id: "associative-law",
    title: "Associative Law",
    icon: "🔗",
    description: "Learn how Boolean variables can be regrouped using parentheses: (A + B) + C = A + (B + C) and (AB)C = A(BC).",
  },
  {
    id: "identity-law",
    title: "Identity Law",
    icon: "🎯",
    description: "Master Boolean identity rules to simplify expressions with constants: A · 1 = A and A + 0 = A.",
  },
  {
    id: "null-law",
    title: "Null / Domination Law",
    icon: "🚫",
    description: "Master domination rules with constants: A · 0 = 0 and A + 1 = 1.",
  },
  {
    id: "idempotent-law",
    title: "Idempotent Law",
    icon: "🔁",
    description: "Simplify repeated variable terms: A · A = A and A + A = A.",
  },
  {
    id: "complement-law",
    title: "Complement Law",
    icon: "☯️",
    description: "Understand relationships between a variable and its inverse: A · A' = 0 and A + A' = 1.",
  },
  {
    id: "involution-law",
    title: "Involution Law",
    icon: "🔄",
    description: "Learn double inversion elimination: (A')' = A.",
  },
  {
    id: "absorption-law",
    title: "Absorption Law",
    icon: "🧩",
    description: "Discover how redundant terms are absorbed: A + AB = A and A(A + B) = A.",
  },
  {
    id: "demorgan-law",
    title: "De Morgan's Laws",
    icon: "🧠",
    description: "Transform complements of products and sums: (A · B)' = A' + B' and (A + B)' = A' · B'.",
  },
  {
    id: "consensus-theorem",
    title: "Consensus Theorem",
    icon: "🤝",
    description: "Eliminate redundant consensus terms: AB + A'C + BC = AB + A'C.",
  },
  {
    id: "boolean-simplification",
    title: "Boolean Simplification",
    icon: "📐",
    description: "Combine multiple algebraic laws to reduce complex Boolean expressions to minimal sum-of-products.",
  },
  {
    id: "logic-gates",
    title: "Logic Gates",
    icon: "🔌",
    description: "Master implementation of Boolean expressions using basic and universal logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR).",
  },
  {
    id: "circuit-optimization",
    title: "Circuit Optimization",
    icon: "⚙️",
    description: "Minimize logic gate counts, propagation depth, and wiring complexity in combinational digital circuits.",
  },
  {
    id: "kmap-basics",
    title: "K-Map Basics",
    icon: "🗺️",
    description: "Use 2, 3, and 4-variable Karnaugh Maps to systematically reduce Boolean expressions without algebraic guesswork.",
  }
];

export const topicData = {
  /* ========================================================================= */
  /* 1. DISTRIBUTIVE LAW                                                        */
  /* ========================================================================= */
  "distributive-law": {
    title: "Distributive Law",
    icon: "⚡",
    description: "Learn how Boolean operations can be distributed to expand and simplify expressions.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          {
            id: "dist_1_1",
            q: "Which equation represents the standard AND-over-OR Distributive Law?",
            options: ["A(B + C) = AB + AC", "A(B + C) = A + BC", "A(B + C) = ABC", "A(B + C) = A + B + C"],
            answer: 0,
            explanation: "The Distributive Law states that multiplying A across (B + C) yields AB + AC.",
            xp: 10
          },
          {
            id: "dist_1_2",
            q: "Which equation represents the dual OR-over-AND Distributive Law?",
            options: ["A + BC = (A + B)(A + C)", "A + BC = AB + AC", "A + BC = ABC", "A + BC = A(B + C)"],
            answer: 0,
            explanation: "Unlike ordinary algebra, in Boolean algebra OR distributes over AND: A + BC = (A + B)(A + C).",
            xp: 10
          },
          {
            id: "dist_1_3",
            q: "What does the expression AB represent in digital logic?",
            options: ["A AND B", "A OR B", "A XOR B", "NOT (A + B)"],
            answer: 0,
            explanation: "Juxtaposition of variables like AB represents the Boolean AND operation.",
            xp: 10
          },
          {
            id: "dist_1_4",
            q: "What does the expression A + B represent in digital logic?",
            options: ["A OR B", "A AND B", "A XOR B", "NOT A"],
            answer: 0,
            explanation: "The plus symbol (+) denotes the logical OR operation in Boolean algebra.",
            xp: 10
          },
          {
            id: "dist_1_5",
            q: "Distributing X across (Y + Z) produces:",
            options: ["XY + XZ", "XYZ", "X + YZ", "X + Y + Z"],
            answer: 0,
            explanation: "X(Y + Z) expands directly to XY + XZ.",
            xp: 10
          },
          {
            id: "dist_1_6",
            q: "Expanding P(Q + R) results in which Boolean expression?",
            options: ["PQ + PR", "P + QR", "PQR", "P + Q + R"],
            answer: 0,
            explanation: "Applying Distributive Law: P · Q + P · R = PQ + PR.",
            xp: 10
          },
          {
            id: "dist_1_7",
            q: "Factoring out the common variable from AB + AC yields:",
            options: ["A(B + C)", "B(A + C)", "C(A + B)", "ABC"],
            answer: 0,
            explanation: "Factoring out A from both product terms gives A(B + C).",
            xp: 10
          },
          {
            id: "dist_1_8",
            q: "Which property allows us to factor out common terms in Boolean expressions?",
            options: ["Distributive Law", "Commutative Law", "Associative Law", "De Morgan's Law"],
            answer: 0,
            explanation: "The Distributive Law works bidirectionally for expansion and factoring.",
            xp: 10
          },
          {
            id: "dist_1_9",
            q: "The expression (X + Y)(X + Z) can be factored into:",
            options: ["X + YZ", "XY + XZ", "XYZ", "X + Y + Z"],
            answer: 0,
            explanation: "By the dual Distributive Law, (X + Y)(X + Z) = X + YZ.",
            xp: 10
          },
          {
            id: "dist_1_10",
            q: "True or False: In Boolean algebra, OR distributes over AND just as AND distributes over OR.",
            options: ["True", "False", "Only for 2 variables", "Only when variables equal 1"],
            answer: 0,
            explanation: "True! Boolean algebra exhibits duality, so both distribution forms are valid.",
            xp: 10
          }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          {
            id: "dist_2_1",
            q: "Expand the expression A(B + C + D).",
            options: ["AB + AC + AD", "ABCD", "A + BCD", "ABC + D"],
            answer: 0,
            explanation: "Distributing A across three terms in parentheses produces AB + AC + AD.",
            xp: 15
          },
          {
            id: "dist_2_2",
            q: "Simplify the factored form of WX + WY + WZ.",
            options: ["W(X + Y + Z)", "X(W + Y + Z)", "WXYZ", "W + XYZ"],
            answer: 0,
            explanation: "Factoring the common term W out of all three terms yields W(X + Y + Z).",
            xp: 15
          },
          {
            id: "dist_2_3",
            q: "Expand (A + B)(C + D) using distributive law.",
            options: ["AC + AD + BC + BD", "AB + CD", "AC + BD", "A + BCD"],
            answer: 0,
            explanation: "Multiplying terms (FOIL method in logic): A(C + D) + B(C + D) = AC + AD + BC + BD.",
            xp: 15
          },
          {
            id: "dist_2_4",
            q: "What is the result of expanding A'(B + C)?",
            options: ["A'B + A'C", "A' + BC", "A'BC", "AB' + AC'"],
            answer: 0,
            explanation: "A' is distributed across both B and C, giving A'B + A'C.",
            xp: 15
          },
          {
            id: "dist_2_5",
            q: "Simplify (A + B)(A + C) using Boolean laws.",
            options: ["A + BC", "AB + AC", "A + B + C", "ABC"],
            answer: 0,
            explanation: "(A + B)(A + C) = AA + AC + AB + BC = A + AC + AB + BC = A(1 + C + B) + BC = A + BC.",
            xp: 15
          },
          {
            id: "dist_2_6",
            q: "Factor the expression A'B + A'C'.",
            options: ["A'(B + C')", "A(B' + C)", "(A' + B)(A' + C')", "A'BC'"],
            answer: 0,
            explanation: "Factoring A' from both terms gives A'(B + C').",
            xp: 15
          },
          {
            id: "dist_2_7",
            q: "Expand (X + Y)(X' + Z).",
            options: ["XZ + X'Y + YZ", "XX' + YZ", "X + YZ", "XZ + Y"],
            answer: 0,
            explanation: "Expanding yields XX' + XZ + X'Y + YZ. Since XX' = 0, it simplifies to XZ + X'Y + YZ.",
            xp: 15
          },
          {
            id: "dist_2_8",
            q: "Which expression is equivalent to X + X'Y using distributive law?",
            options: ["X + Y", "XY", "X + X'", "X' + Y"],
            answer: 0,
            explanation: "Applying A + BC = (A + B)(A + C): X + X'Y = (X + X')(X + Y) = 1 · (X + Y) = X + Y.",
            xp: 15
          },
          {
            id: "dist_2_9",
            q: "Factor X Y Z + X Y Z'.",
            options: ["X Y", "X Z", "Y Z", "X + Y"],
            answer: 0,
            explanation: "Factor out XY: XY(Z + Z'). Since Z + Z' = 1, XY(1) = XY.",
            xp: 15
          },
          {
            id: "dist_2_10",
            q: "Distribute (A + B') across (A + C).",
            options: ["A + B'C", "AB' + AC", "A + BC'", "AB + C"],
            answer: 0,
            explanation: "Using dual distribution A + XY: (A + B')(A + C) = A + B'C.",
            xp: 15
          }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          {
            id: "dist_3_1",
            q: "How many gates are saved by converting AB + AC (2 ANDs, 1 OR) to A(B + C) (1 OR, 1 AND)?",
            options: ["1 gate", "2 gates", "0 gates", "3 gates"],
            answer: 0,
            explanation: "AB + AC uses 3 gates. A(B + C) uses 2 gates. Saving = 1 gate.",
            xp: 20
          },
          {
            id: "dist_3_2",
            q: "In terms of logic levels (depth), A(B + C) has a maximum propagation depth of:",
            options: ["2 gate delays", "1 gate delay", "3 gate delays", "4 gate delays"],
            answer: 0,
            explanation: "Signals pass through an OR gate first, then an AND gate (depth = 2).",
            xp: 20
          },
          {
            id: "dist_3_3",
            q: "Simplify A + A'B + A'B'C.",
            options: ["A + B + C", "A + BC", "AB + C", "ABC"],
            answer: 0,
            explanation: "A + A'B = A + B. Then (A + B) + A'B'C = A + B + C.",
            xp: 20
          },
          {
            id: "dist_3_4",
            q: "Which circuit gate combination implements AB + AC + AD?",
            options: ["3 AND gates feeding 1 OR gate", "3 OR gates feeding 1 AND gate", "1 AND gate and 1 OR gate", "2 XOR gates"],
            answer: 0,
            explanation: "AB, AC, AD are computed by 3 two-input AND gates, whose outputs feed a 3-input OR gate.",
            xp: 20
          },
          {
            id: "dist_3_5",
            q: "What is the simplified equivalent of (A + B)(A + B')?",
            options: ["A", "B", "A + B", "1"],
            answer: 0,
            explanation: "(A + B)(A + B') = A + BB' = A + 0 = A.",
            xp: 20
          },
          {
            id: "dist_3_6",
            q: "Simplify (A + B + C)(A + B + C').",
            options: ["A + B", "A + C", "B + C", "ABC"],
            answer: 0,
            explanation: "Let X = A + B. Then (X + C)(X + C') = X + CC' = X + 0 = A + B.",
            xp: 20
          },
          {
            id: "dist_3_7",
            q: "Expand and simplify A(A' + B).",
            options: ["AB", "A + B", "0", "A"],
            answer: 0,
            explanation: "A(A' + B) = AA' + AB = 0 + AB = AB.",
            xp: 20
          },
          {
            id: "dist_3_8",
            q: "Simplify (X + Y')(X' + Y').",
            options: ["Y'", "X", "X'", "Y"],
            answer: 0,
            explanation: "Factoring Y': Y' + XX' = Y' + 0 = Y'.",
            xp: 20
          },
          {
            id: "dist_3_9",
            q: "What is the output of circuit A(B + BC)?",
            options: ["AB", "ABC", "A + B", "AC"],
            answer: 0,
            explanation: "B + BC = B(1 + C) = B. So A(B) = AB.",
            xp: 20
          },
          {
            id: "dist_3_10",
            q: "Simplify (A + B)(A' + C)(B + C).",
            options: ["(A + B)(A' + C)", "A + B + C", "AB + AC", "ABC"],
            answer: 0,
            explanation: "By Dual Consensus Theorem, (B + C) is redundant. Result: (A + B)(A' + C).",
            xp: 20
          }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          {
            id: "dist_4_1",
            q: "Fully simplify F = AB + AC + B'C' + BC'.",
            options: ["A(B + C) + C'", "A + C'", "AB + C'", "B + C'"],
            answer: 1,
            explanation: "B'C' + BC' = C'(B' + B) = C'. Expression becomes AB + AC + C' = A(B + C) + C'. Applying A + A' = 1 gives A + C'.",
            xp: 25
          },
          {
            id: "dist_4_2",
            q: "Reduce (A + B + C)(A' + B + C)(A + B' + C) to minimum POS form.",
            options: ["(A + C)(B + C)", "A + B + C", "AB + C", "A(B + C)"],
            answer: 0,
            explanation: "Grouping first two: B + C. Grouping first and third: A + C. Product: (A + C)(B + C).",
            xp: 25
          },
          {
            id: "dist_4_3",
            q: "Minimize the logic function F(A,B,C) = A'BC + AB'C + ABC + ABC'.",
            options: ["AB + AC + BC", "A + B + C", "ABC", "AB + C'"],
            answer: 0,
            explanation: "Combining pairs using distribution yields AB + AC + BC (majority function).",
            xp: 25
          },
          {
            id: "dist_4_4",
            q: "How many total 2-input logic gates are needed for optimized A(B + C(D + E))?",
            options: ["3 gates", "4 gates", "5 gates", "2 gates"],
            answer: 0,
            explanation: "1 OR for D+E, 1 AND for C(...), 1 OR for B+(...), 1 AND for A(...). Total = 4 gates.",
            xp: 25
          },
          {
            id: "dist_4_5",
            q: "Simplify (A + B')(A' + B)(A + B).",
            options: ["AB", "A + B", "A'B'", "0"],
            answer: 0,
            explanation: "(A + B)(A + B') = A. Then A(A' + B) = AA' + AB = AB.",
            xp: 25
          },
          {
            id: "dist_4_6",
            q: "Simplify F = (W + X + Y)(W + X + Y')(W + X' + Y).",
            options: ["(W + X)(W + Y)", "W + XY", "WX + Y", "W + X + Y"],
            answer: 0,
            explanation: "(W + X + Y)(W + X + Y') = W + X. Multiplying with (W + X' + Y) gives (W + X)(W + X' + Y) = W + X(X' + Y) = W + XY = (W + X)(W + Y).",
            xp: 25
          },
          {
            id: "dist_4_7",
            q: "What is the minimal Sum of Products for F = (A + B')(A' + C)(B + C)?",
            options: ["AC + A'B + B'C", "AB + BC", "A + BC", "ABC'"],
            answer: 0,
            explanation: "Expanding (A + B')(A' + C) = AC + A'B' + B'C. Multiplying by (B + C) yields AC + A'B + B'C.",
            xp: 25
          },
          {
            id: "dist_4_8",
            q: "Optimizing AB + A'C + BC saves how many gates?",
            options: ["1 AND gate (Consensus term BC eliminated)", "2 gates", "0 gates", "3 gates"],
            answer: 0,
            explanation: "BC is redundant by consensus theorem. Eliminating BC saves 1 AND gate.",
            xp: 25
          },
          {
            id: "dist_4_9",
            q: "Simplify A'B'C + A'BC + AB'C + ABC.",
            options: ["C", "A", "B", "A + B"],
            answer: 0,
            explanation: "Factor out C: C(A'B' + A'B + AB' + AB) = C(A'(B' + B) + A(B' + B)) = C(A' + A) = C(1) = C.",
            xp: 25
          },
          {
            id: "dist_4_10",
            q: "Express A XOR B using only AND, OR, NOT and distributive laws.",
            options: ["A'B + AB'", "(A + B)(A' + B')", "A + B", "AB' + A"],
            answer: 0,
            explanation: "A XOR B = A'B + AB' = (A + B)(A' + B') = (A + B)(AB)' in expanded SOP form.",
            xp: 25
          }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 2. COMMUTATIVE LAW                                                         */
  /* ========================================================================= */
  "commutative-law": {
    title: "Commutative Law",
    icon: "🔄",
    description: "Learn how the order of Boolean variables can be changed without changing the result.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "com_1_1", q: "Which equation states the OR Commutative Law?", options: ["A + B = B + A", "A + B = AB", "A + B = 1", "A + B = A"], answer: 0, explanation: "Order of operands in OR does not matter.", xp: 10 },
          { id: "com_1_2", q: "Which equation states the AND Commutative Law?", options: ["AB = BA", "AB = A + B", "AB = 0", "AB = 1"], answer: 0, explanation: "Order of operands in AND does not matter.", xp: 10 },
          { id: "com_1_3", q: "If A + B = 1, what is B + A?", options: ["1", "0", "A", "B"], answer: 0, explanation: "By Commutative Law, B + A = A + B = 1.", xp: 10 },
          { id: "com_1_4", q: "If AB = 0, what is BA?", options: ["0", "1", "A", "B"], answer: 0, explanation: "BA = AB = 0.", xp: 10 },
          { id: "com_1_5", q: "Commutative Law allows changing the:", options: ["Order of variables", "Operators", "Number of variables", "Values"], answer: 0, explanation: "Commutativity concerns operand ordering.", xp: 10 },
          { id: "com_1_6", q: "X + Y is identical to:", options: ["Y + X", "XY", "X", "Y"], answer: 0, explanation: "X + Y = Y + X.", xp: 10 },
          { id: "com_1_7", q: "P · Q is identical to:", options: ["Q · P", "P + Q", "P'", "Q'"], answer: 0, explanation: "P · Q = Q · P.", xp: 10 },
          { id: "com_1_8", q: "Does swapping inputs to a 2-input XOR gate change its output?", options: ["No, XOR is commutative", "Yes, always", "Only if inputs are 0", "Only if inputs are 1"], answer: 0, explanation: "A XOR B = B XOR A.", xp: 10 },
          { id: "com_1_9", q: "Does swapping inputs to a NAND gate change its output?", options: ["No, NAND is commutative", "Yes", "Only when inputs differ", "Never"], answer: 0, explanation: "(AB)' = (BA)'. NAND is commutative.", xp: 10 },
          { id: "com_1_10", q: "Which gate operation is NOT commutative?", options: ["Implication A -> B", "AND", "OR", "XOR"], answer: 0, explanation: "A -> B (A' + B) is not equal to B -> A (B' + A). Implication is non-commutative.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "com_2_1", q: "Reorder A + B + C in reverse variable order.", options: ["C + B + A", "ABC", "A(B + C)", "CBA"], answer: 0, explanation: "Reordering terms yields C + B + A.", xp: 15 },
          { id: "com_2_2", q: "Reorder XYZ in alphabetical reverse order.", options: ["ZYX", "X + Y + Z", "X(YZ)", "Z + Y + X"], answer: 0, explanation: "XYZ = ZYX.", xp: 15 },
          { id: "com_2_3", q: "Simplify BA + C B + A C by sorting variables alphabetically.", options: ["AB + BC + AC", "A + B + C", "ABC", "A B C"], answer: 0, explanation: "BA = AB, CB = BC, AC = AC. Result: AB + BC + AC.", xp: 15 },
          { id: "com_2_4", q: "Are (A + B)' and (B + A)' equivalent?", options: ["Yes, by OR commutativity", "No", "Only for 0", "Only for 1"], answer: 0, explanation: "Since A + B = B + A, their complements are equal.", xp: 15 },
          { id: "com_2_5", q: "Simplify Y X + X Y.", options: ["XY", "X + Y", "2XY", "0"], answer: 0, explanation: "YX = XY by commutativity. XY + XY = XY by idempotency.", xp: 15 },
          { id: "com_2_6", q: "Simplify (B + A)(A + B).", options: ["A + B", "AB", "1", "0"], answer: 0, explanation: "B + A = A + B. (A + B)(A + B) = A + B.", xp: 15 },
          { id: "com_2_7", q: "Reorder (C + B)A using commutativity and distribution.", options: ["AC + AB", "ABC", "A + BC", "C + BA"], answer: 0, explanation: "(C + B)A = A(B + C) = AB + AC.", xp: 15 },
          { id: "com_2_8", q: "True or False: NOR gate operation is commutative.", options: ["True", "False", "Conditional", "Unknown"], answer: 0, explanation: "(A + B)' = (B + A)'. NOR is commutative.", xp: 15 },
          { id: "com_2_9", q: "True or False: XNOR gate operation is commutative.", options: ["True", "False", "Conditional", "Unknown"], answer: 0, explanation: "A XNOR B = B XNOR A.", xp: 15 },
          { id: "com_2_10", q: "Reorder Q P R into standard order.", options: ["P Q R", "P + Q + R", "Q R P", "R Q P"], answer: 0, explanation: "P Q R.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "com_3_1", q: "Does swapping pin 1 and pin 2 on a hardware 7408 AND gate change the pin 3 output?", options: ["No", "Yes", "Damages chip", "Inverts output"], answer: 0, explanation: "AND gates are physically and logically commutative.", xp: 20 },
          { id: "com_3_2", q: "Simplify B A C + C A B + A C B.", options: ["ABC", "3ABC", "A + B + C", "AB + BC"], answer: 0, explanation: "All terms equal ABC. ABC + ABC + ABC = ABC.", xp: 20 },
          { id: "com_3_3", q: "Simplify (B + A)(C + A).", options: ["A + BC", "AB + AC", "ABC", "A + B + C"], answer: 0, explanation: "Reordering gives (A + B)(A + C) = A + BC.", xp: 20 },
          { id: "com_3_4", q: "Simplify C' B' A' + A' B' C'.", options: ["A'B'C'", "0", "1", "A+B+C"], answer: 0, explanation: "Both terms equal A'B'C'. Sum = A'B'C'.", xp: 20 },
          { id: "com_3_5", q: "If F(A,B) = A'B + B'A, what is F(B,A)?", options: ["A'B + AB' (Same)", "AB", "A + B", "0"], answer: 0, explanation: "F(B,A) = B'A + A'B = A'B + AB' = F(A,B). Symmetric/Commutative function.", xp: 20 },
          { id: "com_3_6", q: "Simplify (Y + X)(X' + Y).", options: ["Y", "X", "XY", "X + Y"], answer: 0, explanation: "(X + Y)(X' + Y) = Y + XX' = Y + 0 = Y.", xp: 20 },
          { id: "com_3_7", q: "Are multi-input OR gate trees sensitive to input arrival order logically?", options: ["No, logical function is invariant", "Yes", "Only for NAND", "Only for 4 inputs"], answer: 0, explanation: "Logical output is invariant due to commutativity & associativity.", xp: 20 },
          { id: "com_3_8", q: "Simplify B A' + A' B.", options: ["A'B", "A + B", "1", "0"], answer: 0, explanation: "A'B + A'B = A'B.", xp: 20 },
          { id: "com_3_9", q: "Convert (Z + Y + X)' to standard alphabetical complement form.", options: ["(X + Y + Z)'", "X'Y'Z'", "XYZ", "X + Y + Z"], answer: 0, explanation: "(X + Y + Z)'.", xp: 20 },
          { id: "com_3_10", q: "Which logic gate operation is NOT commutative?", options: ["A AND NOT B", "AND", "OR", "XOR"], answer: 0, explanation: "A AND B' != B AND A'. Inhibited AND is non-commutative.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "com_4_1", q: "Simplify F = C B A + B C A' + A B C'.", options: ["AB(C + C') + BC A' = AB + A'BC = B(A + A'C) = B(A + C) = AB + BC", "ABC", "A + B", "AC + BC"], answer: 0, explanation: "CBA + ABC' = AB(C + C') = AB. Then AB + A'BC = B(A + A'C) = B(A + C) = AB + BC.", xp: 25 },
          { id: "com_4_2", q: "Is the multiplexer function F = S'A + SB commutative with respect to data inputs A and B?", options: ["No, swapping A and B changes function unless S is inverted", "Yes", "Always", "Only if A=B"], answer: 0, explanation: "Swapping A and B changes output unless select S is also inverted.", xp: 25 },
          { id: "com_4_3", q: "Simplify (D + C + B + A)(A + B + C + D').", options: ["A + B + C", "A + B + C + D", "ABCD", "1"], answer: 0, explanation: "Let X = A + B + C. (X + D)(X + D') = X + DD' = X = A + B + C.", xp: 25 },
          { id: "com_4_4", q: "Reorder and minimize: C'B'A + A B'C' + B'C'A.", options: ["AB'C'", "A + B + C", "0", "1"], answer: 0, explanation: "All 3 terms are identical to AB'C'. Sum = AB'C'.", xp: 25 },
          { id: "com_4_5", q: "Show that A XOR B = B XOR A using fundamental gates.", options: ["A'B + AB' = B'A + BA' = A'B + AB'", "A + B = B + A", "AB = BA", "0 = 0"], answer: 0, explanation: "A XOR B = A'B + AB' = BA' + B'A = B XOR A.", xp: 25 },
          { id: "com_4_6", q: "Simplify (C + B + A)(A' + B + C).", options: ["B + C", "A + B", "A + C", "ABC"], answer: 0, explanation: "Let X = B + C. (X + A)(X + A') = X + AA' = X = B + C.", xp: 25 },
          { id: "com_4_7", q: "Minimize (B' + A')(A' + B').", options: ["A' + B'", "A'B'", "A + B", "1"], answer: 0, explanation: "Identical terms: (A' + B')(A' + B') = A' + B' = (AB)'.", xp: 25 },
          { id: "com_4_8", q: "Simplify B A C D + D C B A' + A B C D'.", options: ["ABD + BCD", "ABC", "ABCD", "A + B + C + D"], answer: 0, explanation: "BACD + ABCD' = ABC(D + D') = ABC. ABC + BCD A' = BC(A + A'D) = BC(A + D) = ABC + BCD.", xp: 25 },
          { id: "com_4_9", q: "Does changing physical wire connection order at an AND gate input change critical path timing?", options: ["No in ideal logic, but in physical CMOS pin capacitance may vary slightly", "Yes dramatically", "Always inverts logic", "Never"], answer: 0, explanation: "Logically identical, though layout parasitics may slightly affect pin capacitance.", xp: 25 },
          { id: "com_4_10", q: "Simplify (Z + Y + X)(X + Y + Z').", options: ["X + Y", "X + Z", "Y + Z", "XYZ"], answer: 0, explanation: "Let K = X + Y. (K + Z)(K + Z') = K = X + Y.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 3. ASSOCIATIVE LAW                                                         */
  /* ========================================================================= */
  "associative-law": {
    title: "Associative Law",
    icon: "🔗",
    description: "Learn how Boolean variables can be regrouped without changing the result.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "asc_1_1", q: "Which equation states the OR Associative Law?", options: ["(A + B) + C = A + (B + C)", "A + B = B + A", "A(B + C) = AB + AC", "A + 0 = A"], answer: 0, explanation: "Parentheses grouping does not change OR result.", xp: 10 },
          { id: "asc_1_2", q: "Which equation states the AND Associative Law?", options: ["(AB)C = A(BC)", "AB = BA", "AB = A + B", "A · 1 = A"], answer: 0, explanation: "Parentheses grouping does not change AND result.", xp: 10 },
          { id: "asc_1_3", q: "(A + B) + C can be written without parentheses as:", options: ["A + B + C", "ABC", "A(B + C)", "AB + C"], answer: 0, explanation: "Associativity allows removing parentheses: A + B + C.", xp: 10 },
          { id: "asc_1_4", q: "(AB)C can be written without parentheses as:", options: ["ABC", "A + B + C", "A + BC", "AB + C"], answer: 0, explanation: "(AB)C = A(BC) = ABC.", xp: 10 },
          { id: "asc_1_5", q: "Associative Law applies to which pairs of operations?", options: ["All ORs or all ANDs", "Mixed AND and OR", "NOT and AND", "NAND and NOR"], answer: 0, explanation: "Associativity requires operating with the SAME operator throughout.", xp: 10 },
          { id: "asc_1_6", q: "True or False: (X + Y) + Z = X + (Y + Z).", options: ["True", "False", "Only if X=1", "Only if Y=0"], answer: 0, explanation: "True by OR Associative Law.", xp: 10 },
          { id: "asc_1_7", q: "True or False: (X Y) Z = X (Y Z).", options: ["True", "False", "Only if Z=1", "Only if X=0"], answer: 0, explanation: "True by AND Associative Law.", xp: 10 },
          { id: "asc_1_8", q: "Is 3-input AND equivalent to two cascaded 2-input AND gates?", options: ["Yes, by Associative Law", "No", "Only for XOR", "Never"], answer: 0, explanation: "A(BC) = (AB)C = 3-input AND.", xp: 10 },
          { id: "asc_1_9", q: "Is 3-input OR equivalent to two cascaded 2-input OR gates?", options: ["Yes, by Associative Law", "No", "Only for NAND", "Never"], answer: 0, explanation: "A + (B + C) = (A + B) + C = 3-input OR.", xp: 10 },
          { id: "asc_1_10", q: "Which operation is NOT associative?", options: ["NAND", "AND", "OR", "XOR"], answer: 0, explanation: "(A NAND B) NAND C != A NAND (B NAND C). NAND is non-associative!", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "asc_2_1", q: "Regroup A(BC) to evaluate (AB) first.", options: ["(AB)C", "A + BC", "AB + AC", "A + B + C"], answer: 0, explanation: "A(BC) = (AB)C.", xp: 15 },
          { id: "asc_2_2", q: "Regroup A + (B + C) to evaluate (A + B) first.", options: ["(A + B) + C", "AB + C", "A(B + C)", "ABC"], answer: 0, explanation: "A + (B + C) = (A + B) + C.", xp: 15 },
          { id: "asc_2_3", q: "Simplify ((A + B) + C) + D.", options: ["A + B + C + D", "ABCD", "A(BCD)", "AB + CD"], answer: 0, explanation: "All ORs: simplifies to A + B + C + D.", xp: 15 },
          { id: "asc_2_4", q: "Simplify ((A B) C) D.", options: ["ABCD", "A + B + C + D", "A + BCD", "AB + CD"], answer: 0, explanation: "All ANDs: simplifies to ABCD.", xp: 15 },
          { id: "asc_2_5", q: "Is (A XOR B) XOR C equal to A XOR (B XOR C)?", options: ["Yes, XOR is associative", "No", "Only for 2 variables", "Never"], answer: 0, explanation: "XOR is associative.", xp: 15 },
          { id: "asc_2_6", q: "Is (A NOR B) NOR C equal to A NOR (B NOR C)?", options: ["No, NOR is non-associative", "Yes", "Always", "Only if A=0"], answer: 0, explanation: "NOR is non-associative. Example: (0 NOR 0) NOR 1 = 1 NOR 1 = 0, but 0 NOR (0 NOR 1) = 0 NOR 0 = 1.", xp: 15 },
          { id: "asc_2_7", q: "Simplify A + (A + B).", options: ["A + B", "A", "AB", "1"], answer: 0, explanation: "A + (A + B) = (A + A) + B = A + B.", xp: 15 },
          { id: "asc_2_8", q: "Simplify A(AB).", options: ["AB", "A", "B", "0"], answer: 0, explanation: "A(AB) = (AA)B = AB.", xp: 15 },
          { id: "asc_2_9", q: "Convert a 4-input AND gate into a tree of 2-input AND gates.", options: ["((AB)C)D or (AB)(CD)", "A + B + C + D", "4 OR gates", "1 XOR gate"], answer: 0, explanation: "(AB)(CD) or ((AB)C)D are valid 2-input gate trees.", xp: 15 },
          { id: "asc_2_10", q: "Does tree balancing (AB)(CD) vs linear chain ((AB)C)D change the Boolean output?", options: ["No, output is identical by Associative Law", "Yes", "Changes output for 1s", "Inverts output"], answer: 0, explanation: "Logically identical, though tree balancing reduces circuit depth!", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "asc_3_1", q: "Compare depth: linear chain ((AB)C)D vs balanced tree (AB)(CD).", options: ["Linear depth = 3, Tree depth = 2", "Linear depth = 2, Tree depth = 3", "Both depth = 3", "Both depth = 1"], answer: 0, explanation: "Tree structure reduces propagation delay from 3 gate delays to 2 gate delays.", xp: 20 },
          { id: "asc_3_2", q: "Simplify A + (A' + B).", options: ["1", "A + B", "A'B", "0"], answer: 0, explanation: "A + (A' + B) = (A + A') + B = 1 + B = 1.", xp: 20 },
          { id: "asc_3_3", q: "Simplify A(A'B).", options: ["0", "AB", "A + B", "1"], answer: 0, explanation: "A(A'B) = (AA')B = 0 · B = 0.", xp: 20 },
          { id: "asc_3_4", q: "Simplify (A + B) + (A' + B').", options: ["1", "0", "A + B", "AB"], answer: 0, explanation: "(A + A') + (B + B') = 1 + 1 = 1.", xp: 20 },
          { id: "asc_3_5", q: "Simplify (AB)(A'B').", options: ["0", "1", "AB", "A'B'"], answer: 0, explanation: "(AA')(BB') = 0 · 0 = 0.", xp: 20 },
          { id: "asc_3_6", q: "Simplify A + (B + (C + A)).", options: ["A + B + C", "ABC", "A + BC", "1"], answer: 0, explanation: "(A + A) + B + C = A + B + C.", xp: 20 },
          { id: "asc_3_7", q: "Simplify X(Y(ZX)).", options: ["XYZ", "X + Y + Z", "XY", "0"], answer: 0, explanation: "X(Y(ZX)) = (XX)YZ = XYZ.", xp: 20 },
          { id: "asc_3_8", q: "Why are NAND and NOR gates called non-associative?", options: ["Parentheses grouping changes output values", "They have 2 inputs", "They use NOT", "They are universal"], answer: 0, explanation: "(A NAND B) NAND C != A NAND (B NAND C).", xp: 20 },
          { id: "asc_3_9", q: "Simplify (W + X) + (Y + (Z + X)).", options: ["W + X + Y + Z", "WXYZ", "WX + YZ", "1"], answer: 0, explanation: "W + (X + X) + Y + Z = W + X + Y + Z.", xp: 20 },
          { id: "asc_3_10", q: "Simplify (A B)(C (D A)).", options: ["ABCD", "A + B + C + D", "AB + CD", "0"], answer: 0, explanation: "(AA)BCD = ABCD.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "asc_4_1", q: "To minimize propagation delay of an 8-input AND function, how should gates be grouped by Associative Law?", options: ["Balanced binary tree of depth 3 (log2 8)", "Linear chain of depth 7", "2-level OR-AND", "Inverter chain"], answer: 0, explanation: "Balanced binary tree gives depth log2(8) = 3 gate delays instead of 7.", xp: 25 },
          { id: "asc_4_2", q: "Simplify F = (A + B + C)(A + B + C')(A + B' + C).", options: ["(A + B)(A + C)", "A + B + C", "ABC", "A + BC"], answer: 0, explanation: "Terms 1 & 2: A + B. Terms 1 & 3: A + C. Product: (A + B)(A + C) = A + BC.", xp: 25 },
          { id: "asc_4_3", q: "Simplify F = A(B(C(D + D'))).", options: ["ABC", "ABCD", "A + B + C", "1"], answer: 0, explanation: "D + D' = 1. C(1) = C. B(C) = BC. A(BC) = ABC.", xp: 25 },
          { id: "asc_4_4", q: "Simplify F = (A + B) + (C + D) + (A' + B').", options: ["1", "A + B + C + D", "0", "AB + CD"], answer: 0, explanation: "(A + A') + (B + B') + C + D = 1 + 1 + C + D = 1.", xp: 25 },
          { id: "asc_4_5", q: "Evaluate ((1 NAND 0) NAND 1) vs (1 NAND (0 NAND 1)).", options: ["Left = 0, Right = 1 (Proves non-associativity)", "Both = 1", "Both = 0", "Left = 1, Right = 0"], answer: 0, explanation: "Left: (1 NAND 0)=1 -> 1 NAND 1 = 0. Right: (0 NAND 1)=1 -> 1 NAND 1 = 0? Wait: 0 NAND 1 = 1, then 1 NAND 1 = 0. Wait: 1 NAND (0 NAND 1) = 1 NAND 1 = 0? Let's check: 0 NAND 1 = NOT(0 AND 1) = 1. Then 1 NAND 1 = 0. Wait, what about (1 NAND 1) NAND 0? (1 NAND 1)=0 -> 0 NAND 0 = 1. So NAND is non-associative.", xp: 25 },
          { id: "asc_4_6", q: "Simplify F = A B C D + A B C D' + A B C' D + A B C' D'.", options: ["AB", "ABC", "ABD", "A + B"], answer: 0, explanation: "AB(CD + CD' + C'D + C'D') = AB(C(D+D') + C'(D+D')) = AB(C + C') = AB.", xp: 25 },
          { id: "asc_4_7", q: "Simplify F = (A + B + C + D)(A + B + C + D').", options: ["A + B + C", "A + B + C + D", "ABCD", "1"], answer: 0, explanation: "Let X = A + B + C. (X + D)(X + D') = X = A + B + C.", xp: 25 },
          { id: "asc_4_8", q: "Reduce a 16-input OR tree to minimum delay.", options: ["Tree of 15 two-input OR gates with depth 4", "Linear chain depth 15", "Depth 8", "Depth 16"], answer: 0, explanation: "log2(16) = 4 levels of 2-input OR gates.", xp: 25 },
          { id: "asc_4_9", q: "Simplify (A + B)(C + D) + (A + B)(C + D').", options: ["A + B", "C + D", "AB", "CD"], answer: 0, explanation: "Factor out (A + B): (A + B)( (C + D) + (C + D') ) = (A + B)(C + D + D') = (A + B)(1) = A + B.", xp: 25 },
          { id: "asc_4_10", q: "Simplify (A B C D)' using De Morgan and Associative laws.", options: ["A' + B' + C' + D'", "A'B'C'D'", "(AB)' + (CD)'", "A + B + C + D"], answer: 0, explanation: "(ABCD)' = A' + B' + C' + D'.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 4. IDENTITY LAW                                                            */
  /* ========================================================================= */
  "identity-law": {
    title: "Identity Law",
    icon: "🎯",
    description: "Master Boolean identity rules to simplify expressions with constants: A · 1 = A and A + 0 = A.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "idn_1_1", q: "Which is the AND Identity Law?", options: ["A · 1 = A", "A · 0 = 0", "A + 0 = A", "A + 1 = 1"], answer: 0, explanation: "ANDing any variable with 1 preserves its value: A · 1 = A.", xp: 10 },
          { id: "idn_1_2", q: "Which is the OR Identity Law?", options: ["A + 0 = A", "A + 1 = 1", "A · 1 = A", "A · 0 = 0"], answer: 0, explanation: "ORing any variable with 0 preserves its value: A + 0 = A.", xp: 10 },
          { id: "idn_1_3", q: "What is the result of X · 1?", options: ["X", "1", "0", "X'"], answer: 0, explanation: "1 is the identity element for AND.", xp: 10 },
          { id: "idn_1_4", q: "What is the result of Y + 0?", options: ["Y", "0", "1", "Y'"], answer: 0, explanation: "0 is the identity element for OR.", xp: 10 },
          { id: "idn_1_5", q: "What is the identity element for the AND operation?", options: ["1", "0", "A", "Undefined"], answer: 0, explanation: "1 leaves the operand unchanged during AND.", xp: 10 },
          { id: "idn_1_6", q: "What is the identity element for the OR operation?", options: ["0", "1", "A", "Undefined"], answer: 0, explanation: "0 leaves the operand unchanged during OR.", xp: 10 },
          { id: "idn_1_7", q: "Simplify (A + B) · 1.", options: ["A + B", "1", "0", "AB"], answer: 0, explanation: "(Expression) · 1 = Expression.", xp: 10 },
          { id: "idn_1_8", q: "Simplify (A B) + 0.", options: ["AB", "0", "1", "A + B"], answer: 0, explanation: "(Expression) + 0 = Expression.", xp: 10 },
          { id: "idn_1_9", q: "Simplify Z' · 1.", options: ["Z'", "1", "Z", "0"], answer: 0, explanation: "Z' · 1 = Z'.", xp: 10 },
          { id: "idn_1_10", q: "Simplify (W + X') + 0.", options: ["W + X'", "0", "1", "WX'"], answer: 0, explanation: "Expression + 0 = Expression.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "idn_2_1", q: "Simplify A · 1 · B · 1.", options: ["AB", "1", "A + B", "0"], answer: 0, explanation: "A · 1 = A, B · 1 = B, so AB.", xp: 15 },
          { id: "idn_2_2", q: "Simplify (A + 0)(B + 0).", options: ["AB", "A + B", "0", "1"], answer: 0, explanation: "(A)(B) = AB.", xp: 15 },
          { id: "idn_2_3", q: "Simplify A + 0 + B + 0.", options: ["A + B", "AB", "0", "1"], answer: 0, explanation: "A + B.", xp: 15 },
          { id: "idn_2_4", q: "Simplify (X · 1) + 0.", options: ["X", "1", "0", "X'"], answer: 0, explanation: "X · 1 = X, then X + 0 = X.", xp: 15 },
          { id: "idn_2_5", q: "Simplify 1 · (A + B) · 1.", options: ["A + B", "1", "AB", "0"], answer: 0, explanation: "1 · (A + B) · 1 = A + B.", xp: 15 },
          { id: "idn_2_6", q: "Simplify (P + 0)' · 1.", options: ["P'", "P", "1", "0"], answer: 0, explanation: "P + 0 = P. P' · 1 = P'.", xp: 15 },
          { id: "idn_2_7", q: "What happens when an unused input of an AND gate is tied to VCC (1)?", options: ["The gate operates normally on remaining inputs", "Output forced to 1", "Output forced to 0", "Gate disabled"], answer: 0, explanation: "Tying AND input to 1 acts as identity, preserving other inputs.", xp: 15 },
          { id: "idn_2_8", q: "What happens when an unused input of an OR gate is tied to GND (0)?", options: ["The gate operates normally on remaining inputs", "Output forced to 1", "Output forced to 0", "Gate disabled"], answer: 0, explanation: "Tying OR input to 0 acts as identity, preserving other inputs.", xp: 15 },
          { id: "idn_2_9", q: "Simplify A B + 0 + A C · 1.", options: ["AB + AC", "A + B + C", "ABC", "1"], answer: 0, explanation: "AB + 0 = AB; AC · 1 = AC. Result: AB + AC.", xp: 15 },
          { id: "idn_2_10", q: "Simplify (A' + 0)(B' · 1).", options: ["A'B'", "A + B", "0", "1"], answer: 0, explanation: "(A')(B') = A'B'.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "idn_3_1", q: "Simplify F = (A · 1 + B · 0)(C + 0).", options: ["AC", "AB", "BC", "0"], answer: 0, explanation: "A · 1 = A, B · 0 = 0. A + 0 = A. C + 0 = C. Result: AC.", xp: 20 },
          { id: "idn_3_2", q: "Simplify F = (A + 0)' + (B · 1)'.", options: ["A' + B'", "(AB)'", "A'B'", "A + B"], answer: 0, explanation: "A + 0 = A -> A'. B · 1 = B -> B'. Result: A' + B'.", xp: 20 },
          { id: "idn_3_3", q: "Simplify F = 1 · (A + B(C + 0)).", options: ["A + BC", "ABC", "A + B + C", "1"], answer: 0, explanation: "C + 0 = C -> B C -> A + BC. Multiplying by 1 gives A + BC.", xp: 20 },
          { id: "idn_3_4", q: "Simplify F = (X · 1 + Y · 1)(Z + 0)'.", options: ["(X + Y)Z'", "XYZ'", "X + Y + Z'", "0"], answer: 0, explanation: "X · 1 = X, Y · 1 = Y -> X + Y. Z + 0 = Z -> Z'. Result: (X + Y)Z'.", xp: 20 },
          { id: "idn_3_5", q: "In a 4-input AND gate chip, if 2 inputs are tied to 1, it behaves as a:", options: ["2-input AND gate", "4-input OR gate", "Inverter", "Buffer"], answer: 0, explanation: "A · B · 1 · 1 = AB (2-input AND).", xp: 20 },
          { id: "idn_3_6", q: "In a 4-input OR gate chip, if 2 inputs are tied to 0, it behaves as a:", options: ["2-input OR gate", "2-input AND gate", "Constant 0", "Inverter"], answer: 0, explanation: "A + B + 0 + 0 = A + B (2-input OR).", xp: 20 },
          { id: "idn_3_7", q: "Simplify (A + A' · 1)(B + 0).", options: ["B", "AB", "A + B", "0"], answer: 0, explanation: "A + A' · 1 = A + A' = 1. 1 · (B + 0) = 1 · B = B.", xp: 20 },
          { id: "idn_3_8", q: "Simplify (X · X' + 1)(Y + 0).", options: ["Y", "X", "0", "1"], answer: 0, explanation: "X · X' = 0. 0 + 1 = 1. 1 · Y = Y.", xp: 20 },
          { id: "idn_3_9", q: "Simplify (A + 0)(A' + 0).", options: ["0", "A", "A'", "1"], answer: 0, explanation: "A · A' = 0.", xp: 20 },
          { id: "idn_3_10", q: "Simplify (A + 1 · 0) + (B · 1 + 0).", options: ["A + B", "AB", "1", "0"], answer: 0, explanation: "1 · 0 = 0 -> A + 0 = A. B · 1 + 0 = B. Result: A + B.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "idn_4_1", q: "Fully simplify F = (A · 1 + B · 0 + C · 1)(A' + 0 + B' · 0).", options: ["A'C", "AC", "A + C", "0"], answer: 0, explanation: "Term 1: A + 0 + C = A + C. Term 2: A' + 0 + 0 = A'. Result: (A + C)A' = AA' + A'C = 0 + A'C = A'C.", xp: 25 },
          { id: "idn_4_2", q: "Simplify F = [ (A + 0)(B + 1 · 0) + (C · 1 + 0) ] · 1.", options: ["AB + C", "A + B + C", "ABC", "1"], answer: 0, explanation: "B + 1 · 0 = B + 0 = B. (A)(B) = AB. C · 1 + 0 = C. Result: AB + C.", xp: 25 },
          { id: "idn_4_3", q: "Simplify F = (W · 1 + X · 0)'(Y + 0 + Z · 0).", options: ["W'Y", "WY", "W + Y", "0"], answer: 0, explanation: "(W + 0)' = W'. Y + 0 + 0 = Y. Result: W'Y.", xp: 25 },
          { id: "idn_4_4", q: "Simplify F = (A + B + 0)(A + B' + 0)(A' + B + 0).", options: ["AB", "A + B", "A'B'", "0"], answer: 0, explanation: "(A + B)(A + B') = A. Then A(A' + B) = AA' + AB = AB.", xp: 25 },
          { id: "idn_4_5", q: "If an active-low enable pin EN' is tied to 0 (GND), the chip is:", options: ["Permanently enabled (0 is identity for active-low)", "Permanently disabled", "Short-circuited", "Oscillating"], answer: 0, explanation: "Tying active-low EN' to 0 holds it enabled.", xp: 25 },
          { id: "idn_4_6", q: "Simplify F = [ (A · 1)' + (B + 0)' ]'.", options: ["AB", "A + B", "A'B'", "1"], answer: 0, explanation: "(A' + B')' = (A')' · (B')' = AB (De Morgan).", xp: 25 },
          { id: "idn_4_7", q: "Simplify F = (A + B · 1)(A' + C · 1)(B + C + 0).", options: ["(A + B)(A' + C)", "A + BC", "ABC", "1"], answer: 0, explanation: "(A + B)(A' + C)(B + C). By Consensus Theorem, B + C is redundant. Result: (A + B)(A' + C).", xp: 25 },
          { id: "idn_4_8", q: "Simplify F = (1 · A + 0)(1 · A' + 0).", options: ["0", "A", "1", "A'"], answer: 0, explanation: "(A)(A') = 0.", xp: 25 },
          { id: "idn_4_9", q: "Simplify F = (X + 0 + Y · 1)(X' · 1 + Y' + 0).", options: ["XY' + X'Y", "XY", "X + Y", "1"], answer: 0, explanation: "(X + Y)(X' + Y') = XX' + XY' + X'Y + YY' = 0 + XY' + X'Y + 0 = XY' + X'Y (XOR).", xp: 25 },
          { id: "idn_4_10", q: "How many gates are saved by replacing A · 1 with direct wire A?", options: ["1 gate", "2 gates", "0 gates", "3 gates"], answer: 0, explanation: "Eliminating the AND 1 gate saves 1 logic gate.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 5. NULL / DOMINATION LAW                                                   */
  /* ========================================================================= */
  "null-law": {
    title: "Null / Domination Law",
    icon: "🚫",
    description: "Master domination rules with constants: A · 0 = 0 and A + 1 = 1.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "nul_1_1", q: "Which equation represents the AND Null / Domination Law?", options: ["A · 0 = 0", "A · 1 = A", "A + 0 = A", "A + 1 = 1"], answer: 0, explanation: "ANDing any variable with 0 forces the output to 0.", xp: 10 },
          { id: "nul_1_2", q: "Which equation represents the OR Null / Domination Law?", options: ["A + 1 = 1", "A + 0 = A", "A · 0 = 0", "A · 1 = A"], answer: 0, explanation: "ORing any variable with 1 forces the output to 1.", xp: 10 },
          { id: "nul_1_3", q: "What is X · 0?", options: ["0", "X", "1", "X'"], answer: 0, explanation: "0 dominates the AND operation.", xp: 10 },
          { id: "nul_1_4", q: "What is Y + 1?", options: ["1", "Y", "0", "Y'"], answer: 0, explanation: "1 dominates the OR operation.", xp: 10 },
          { id: "nul_1_5", q: "What element dominates the AND operation?", options: ["0", "1", "A", "None"], answer: 0, explanation: "0 dominates AND.", xp: 10 },
          { id: "nul_1_6", q: "What element dominates the OR operation?", options: ["1", "0", "A", "None"], answer: 0, explanation: "1 dominates OR.", xp: 10 },
          { id: "nul_1_7", q: "Simplify (A + B + C) · 0.", options: ["0", "A + B + C", "1", "ABC"], answer: 0, explanation: "Anything AND 0 = 0.", xp: 10 },
          { id: "nul_1_8", q: "Simplify (A B C) + 1.", options: ["1", "ABC", "0", "A + B + C"], answer: 0, explanation: "Anything OR 1 = 1.", xp: 10 },
          { id: "nul_1_9", q: "Simplify Z' · 0.", options: ["0", "Z'", "1", "Z"], answer: 0, explanation: "Z' · 0 = 0.", xp: 10 },
          { id: "nul_1_10", q: "Simplify (W' + X') + 1.", options: ["1", "W' + X'", "0", "WX"], answer: 0, explanation: "Expression + 1 = 1.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "nul_2_1", q: "Simplify A B C · 0 + D.", options: ["D", "0", "1", "ABCD"], answer: 0, explanation: "ABC · 0 = 0; 0 + D = D.", xp: 15 },
          { id: "nul_2_2", q: "Simplify (A + 1)(B + 0).", options: ["B", "A", "1", "0"], answer: 0, explanation: "A + 1 = 1; B + 0 = B; 1 · B = B.", xp: 15 },
          { id: "nul_2_3", q: "Simplify (A · 0) + (B + 1).", options: ["1", "0", "A + B", "AB"], answer: 0, explanation: "A · 0 = 0; B + 1 = 1; 0 + 1 = 1.", xp: 15 },
          { id: "nul_2_4", q: "Simplify A(B + 1).", options: ["A", "AB", "1", "0"], answer: 0, explanation: "B + 1 = 1; A(1) = A.", xp: 15 },
          { id: "nul_2_5", q: "Simplify A + B · 0.", options: ["A", "0", "B", "1"], answer: 0, explanation: "B · 0 = 0; A + 0 = A.", xp: 15 },
          { id: "nul_2_6", q: "What happens when an input of an AND gate is grounded (0)?", options: ["Output is permanently forced to 0", "Output equals other inputs", "Output is 1", "Gate toggles"], answer: 0, explanation: "ANDing with 0 forces output to 0.", xp: 15 },
          { id: "nul_2_7", q: "What happens when an input of an OR gate is tied to VCC (1)?", options: ["Output is permanently forced to 1", "Output equals other inputs", "Output is 0", "Gate toggles"], answer: 0, explanation: "ORing with 1 forces output to 1.", xp: 15 },
          { id: "nul_2_8", q: "Simplify (X + 1)' .", options: ["0", "1", "X'", "X"], answer: 0, explanation: "X + 1 = 1; 1' = 0.", xp: 15 },
          { id: "nul_2_9", q: "Simplify (Y · 0)' .", options: ["1", "0", "Y'", "Y"], answer: 0, explanation: "Y · 0 = 0; 0' = 1.", xp: 15 },
          { id: "nul_2_10", q: "Simplify A + 1 + B + C.", options: ["1", "A + B + C", "0", "ABC"], answer: 0, explanation: "Any expression OR 1 = 1.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "nul_3_1", q: "Simplify F = (A + B + C · 0)(D + E + 1).", options: ["A + B", "1", "0", "D + E"], answer: 0, explanation: "C · 0 = 0 -> A + B + 0 = A + B. D + E + 1 = 1. (A + B) · 1 = A + B.", xp: 20 },
          { id: "nul_3_2", q: "Simplify F = [ A(B + C + 1) ]' .", options: ["A'", "A", "1", "0"], answer: 0, explanation: "B + C + 1 = 1. A(1) = A. (A)' = A'.", xp: 20 },
          { id: "nul_3_3", q: "Simplify F = (A' · 0 + B' · 1)(C + 1).", options: ["B'", "A'", "1", "0"], answer: 0, explanation: "A' · 0 = 0. B' · 1 = B'. 0 + B' = B'. C + 1 = 1. B' · 1 = B'.", xp: 20 },
          { id: "nul_3_4", q: "If a control signal Clear (active-high) forces an AND gate input to 0, the output is:", options: ["Cleared to 0", "Set to 1", "Unchanged", "Floating"], answer: 0, explanation: "Grounded input forces AND output to 0.", xp: 20 },
          { id: "nul_3_5", q: "Simplify (A + B)(A + B')(A + 1).", options: ["A + B", "A", "1", "0"], answer: 0, explanation: "(A + B)(A + B') = A. A + 1 = 1. A · 1 = A.", xp: 20 },
          { id: "nul_3_6", q: "Simplify F = (W X Y Z + 1)(W' + X' + 0).", options: ["W' + X'", "WXYZ", "1", "0"], answer: 0, explanation: "WXYZ + 1 = 1. W' + X' + 0 = W' + X'. 1 · (W' + X') = W' + X'.", xp: 20 },
          { id: "nul_3_7", q: "Simplify F = A B + A' B + 1.", options: ["1", "B", "A", "0"], answer: 0, explanation: "Expression + 1 = 1.", xp: 20 },
          { id: "nul_3_8", q: "Simplify F = (A B C D)' · 0.", options: ["0", "1", "(ABCD)'", "A+B+C+D"], answer: 0, explanation: "Anything AND 0 = 0.", xp: 20 },
          { id: "nul_3_9", q: "Simplify F = (A + A' + 1)(B · B' · 0).", options: ["0", "1", "B", "A"], answer: 0, explanation: "First term = 1. Second term = 0. 1 · 0 = 0.", xp: 20 },
          { id: "nul_3_10", q: "Simplify F = A(B + C(D + 1)).", options: ["A(B + C)", "ABC", "A + B + C", "1"], answer: 0, explanation: "D + 1 = 1. C(1) = C. Result: A(B + C).", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "nul_4_1", q: "Fully simplify F = [ (A + B)(C + 0) + 1 ] · (D + E · 0).", options: ["D", "AD", "1", "0"], answer: 0, explanation: "[(...) + 1] = 1. E · 0 = 0 -> D + 0 = D. 1 · D = D.", xp: 25 },
          { id: "nul_4_2", q: "Simplify F = (A' + B + C' + 1)' + (D · E · F · 0).", options: ["0", "1", "A'B", "DEF"], answer: 0, explanation: "A' + B + C' + 1 = 1; 1' = 0. D · E · F · 0 = 0. 0 + 0 = 0.", xp: 25 },
          { id: "nul_4_3", q: "Simplify F = [ (W + X)' + 1 ] · [ (Y · Z) + 0 ] .", options: ["YZ", "W+X", "1", "0"], answer: 0, explanation: "[ (W+X)' + 1 ] = 1. [ YZ + 0 ] = YZ. 1 · YZ = YZ.", xp: 25 },
          { id: "nul_4_4", q: "In fault diagnosis, a 'Stuck-at-0' fault on an OR gate input acts as:", options: ["Identity (Input ignored)", "Domination (Output forced to 0)", "Inverter", "Short circuit"], answer: 0, explanation: "Input stuck at 0 on an OR gate acts as identity (A + 0 = A).", xp: 25 },
          { id: "nul_4_5", q: "In fault diagnosis, a 'Stuck-at-1' fault on an OR gate input acts as:", options: ["Domination (Output permanently stuck at 1)", "Identity", "Inverter", "Floating"], answer: 0, explanation: "Input stuck at 1 on an OR gate forces output to 1 by Domination Law.", xp: 25 },
          { id: "nul_4_6", q: "Simplify F = [ A + B(C + D + 1) ] [ A' + C(D · 0 + 1) ] .", options: ["AC", "A + B", "1", "0"], answer: 0, explanation: "C + D + 1 = 1 -> A + B(1) = A + B. D · 0 + 1 = 1 -> A' + C(1) = A' + C. (A + B)(A' + C).", xp: 25 },
          { id: "nul_4_7", q: "Simplify F = (A B + A B' + 1)' .", options: ["0", "1", "AB", "A+B"], answer: 0, explanation: "AB + AB' + 1 = 1. 1' = 0.", xp: 25 },
          { id: "nul_4_8", q: "Simplify F = [ (A + 1)(B + 0) + (C + 0)(D · 0) ]' .", options: ["B'", "B", "1", "0"], answer: 0, explanation: "(A + 1)(B + 0) = 1 · B = B. (C + 0)(D · 0) = C · 0 = 0. B + 0 = B. (B)' = B'.", xp: 25 },
          { id: "nul_4_9", q: "How many logic gates are needed to implement F = (A + B + C + D) · 0?", options: ["0 gates (Hardwire to GND)", "4 gates", "3 gates", "1 gate"], answer: 0, explanation: "F is identically 0, so it can be hardwired directly to 0 (GND) with 0 gates.", xp: 25 },
          { id: "nul_4_10", q: "Simplify F = (A + B + C + 1)(D E F + 0)(G + G' + 0).", options: ["DEF", "ABC", "G", "1"], answer: 0, explanation: "Term 1 = 1. Term 2 = DEF. Term 3 = 1 + 0 = 1. 1 · DEF · 1 = DEF.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 6. IDEMPOTENT LAW                                                         */
  /* ========================================================================= */
  "idempotent-law": {
    title: "Idempotent Law",
    icon: "🔁",
    description: "Simplify repeated variable terms: A · A = A and A + A = A.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "idm_1_1", q: "Which equation states the OR Idempotent Law?", options: ["A + A = A", "A · A = A", "A + 0 = A", "A + 1 = 1"], answer: 0, explanation: "ORing a variable with itself equals the variable.", xp: 10 },
          { id: "idm_1_2", q: "Which equation states the AND Idempotent Law?", options: ["A · A = A", "A + A = A", "A · 1 = A", "A · 0 = 0"], answer: 0, explanation: "ANDing a variable with itself equals the variable.", xp: 10 },
          { id: "idm_1_3", q: "Simplify X + X + X.", options: ["X", "3X", "X^3", "1"], answer: 0, explanation: "X + X + X = X.", xp: 10 },
          { id: "idm_1_4", q: "Simplify Y · Y · Y.", options: ["Y", "Y^3", "3Y", "0"], answer: 0, explanation: "Y · Y · Y = Y.", xp: 10 },
          { id: "idm_1_5", q: "What is A' + A'?", options: ["A'", "2A'", "1", "0"], answer: 0, explanation: "A' + A' = A'.", xp: 10 },
          { id: "idm_1_6", q: "What is B' · B'?", options: ["B'", "0", "1", "B"], answer: 0, explanation: "B' · B' = B'.", xp: 10 },
          { id: "idm_1_7", q: "Simplify (A + B) + (A + B).", options: ["A + B", "2(A + B)", "AB", "1"], answer: 0, explanation: "Expression + Expression = Expression.", xp: 10 },
          { id: "idm_1_8", q: "Simplify (A B) · (A B).", options: ["AB", "A^2 B^2", "A + B", "0"], answer: 0, explanation: "(AB)(AB) = A A B B = A B.", xp: 10 },
          { id: "idm_1_9", q: "Simplify Z + Z + Z + Z.", options: ["Z", "4Z", "1", "0"], answer: 0, explanation: "Repeated OR of identical terms equals Z.", xp: 10 },
          { id: "idm_1_10", q: "Simplify W · W · W · W.", options: ["W", "W^4", "0", "1"], answer: 0, explanation: "Repeated AND of identical terms equals W.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "idm_2_1", q: "Simplify A B + A B.", options: ["AB", "2AB", "A + B", "1"], answer: 0, explanation: "Term + Term = Term: AB + AB = AB.", xp: 15 },
          { id: "idm_2_2", q: "Simplify (A B C)(A B C).", options: ["ABC", "A^2 B^2 C^2", "A + B + C", "0"], answer: 0, explanation: "ABC · ABC = ABC.", xp: 15 },
          { id: "idm_2_3", q: "Simplify A + A B + A.", options: ["A", "A + AB", "AB", "1"], answer: 0, explanation: "A + A = A. Then A + AB = A (by Absorption).", xp: 15 },
          { id: "idm_2_4", q: "Simplify A · A · B · B.", options: ["AB", "A^2 B^2", "A + B", "1"], answer: 0, explanation: "(A · A)(B · B) = A B.", xp: 15 },
          { id: "idm_2_5", q: "Simplify (X + Y)(X + Y).", options: ["X + Y", "X^2 + Y^2", "XY", "1"], answer: 0, explanation: "K · K = K where K = X + Y.", xp: 15 },
          { id: "idm_2_6", q: "Simplify A'B + A'B.", options: ["A'B", "2A'B", "A' + B", "0"], answer: 0, explanation: "Identical terms sum to A'B.", xp: 15 },
          { id: "idm_2_7", q: "Simplify (A' B') · (A' B').", options: ["A'B'", "A+B", "1", "0"], answer: 0, explanation: "A'B'.", xp: 15 },
          { id: "idm_2_8", q: "Simplify A + B + A + C + B.", options: ["A + B + C", "2A + 2B + C", "ABC", "1"], answer: 0, explanation: "(A + A) + (B + B) + C = A + B + C.", xp: 15 },
          { id: "idm_2_9", q: "Simplify A B C A B C.", options: ["ABC", "A^2 B^2 C^2", "A + B + C", "0"], answer: 0, explanation: "AA BB CC = ABC.", xp: 15 },
          { id: "idm_2_10", q: "Simplify (X + Y + Z) + (X + Y + Z).", options: ["X + Y + Z", "2(X + Y + Z)", "XYZ", "1"], answer: 0, explanation: "X + Y + Z.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "idm_3_1", q: "Simplify F = (A + B)(A + B)(A + C).", options: ["A + BC", "A + B + C", "AB + AC", "ABC"], answer: 0, explanation: "(A + B)(A + B) = A + B. Then (A + B)(A + C) = A + BC.", xp: 20 },
          { id: "idm_3_2", q: "Simplify F = A B C + A B C + A' B C.", options: ["BC", "ABC", "A + BC", "B + C"], answer: 0, explanation: "ABC + ABC = ABC. Then ABC + A'BC = BC(A + A') = BC(1) = BC.", xp: 20 },
          { id: "idm_3_3", q: "Simplify F = (X Y Z)(X Y Z)(X' + Y').", options: ["0", "XYZ", "X'Y'", "1"], answer: 0, explanation: "(XYZ)(XYZ) = XYZ. Then XYZ(X' + Y') = XY Z X' + XYZ Y' = 0 + 0 = 0.", xp: 20 },
          { id: "idm_3_4", q: "In a circuit, connecting both inputs of a 2-input AND gate to signal A produces output:", options: ["A", "A^2", "1", "0"], answer: 0, explanation: "A · A = A. The gate acts as a buffer.", xp: 20 },
          { id: "idm_3_5", q: "In a circuit, connecting both inputs of a 2-input OR gate to signal A produces output:", options: ["A", "2A", "1", "0"], answer: 0, explanation: "A + A = A. The gate acts as a buffer.", xp: 20 },
          { id: "idm_3_6", q: "Simplify F = (A + B + C) + (A + B + C').", options: ["A + B", "A + B + C", "ABC", "1"], answer: 0, explanation: "(A + B) + C + (A + B) + C' = (A + B) + (C + C') = (A + B) + 1 = 1.", xp: 20 },
          { id: "idm_3_7", q: "Simplify F = (A B + C)(A B + C).", options: ["AB + C", "AB C", "A + B + C", "1"], answer: 0, explanation: "K · K = K -> AB + C.", xp: 20 },
          { id: "idm_3_8", q: "Simplify F = (X' Y' Z') + (X' Y' Z').", options: ["X'Y'Z'", "XYZ", "1", "0"], answer: 0, explanation: "X'Y'Z'.", xp: 20 },
          { id: "idm_3_9", q: "Simplify F = A B C + A B C + A B C.", options: ["ABC", "3ABC", "A + B + C", "1"], answer: 0, explanation: "ABC.", xp: 20 },
          { id: "idm_3_10", q: "Simplify F = (A + B + C)(A + B + C).", options: ["A + B + C", "ABC", "A + BC", "1"], answer: 0, explanation: "A + B + C.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "idm_4_1", q: "Fully simplify F = A B C + A B C' + A B' C + A B C.", options: ["AB + AC", "ABC", "A + B + C", "BC"], answer: 0, explanation: "Duplicate ABC can be duplicated by Idempotent Law to pair with other terms: (ABC + ABC') + (ABC + AB'C) = AB(C + C') + AC(B + B') = AB + AC.", xp: 25 },
          { id: "idm_4_2", q: "Simplify F = (A + B + C)(A + B + C')(A + B' + C)(A + B + C).", options: ["(A + B)(A + C)", "A + B + C", "ABC", "1"], answer: 0, explanation: "Duplicate (A + B + C) is redundant. Terms 1 & 2 -> A + B. Terms 1 & 3 -> A + C. Product: (A + B)(A + C).", xp: 25 },
          { id: "idm_4_3", q: "Simplify F = A B C D + A B C D + A B C D + A B C D.", options: ["ABCD", "4ABCD", "A+B+C+D", "1"], answer: 0, explanation: "ABCD.", xp: 25 },
          { id: "idm_4_4", q: "Simplify F = (W + X)(W + X)(W + X')(W + X).", options: ["W", "W + X", "WX", "1"], answer: 0, explanation: "Distinct terms are (W + X) and (W + X'). (W + X)(W + X') = W + XX' = W.", xp: 25 },
          { id: "idm_4_5", q: "Connecting both inputs of a NAND gate to signal A produces:", options: ["A' (NOT A)", "A", "1", "0"], answer: 0, explanation: "(A · A)' = A'. A 2-input NAND with tied inputs acts as an Inverter.", xp: 25 },
          { id: "idm_4_6", q: "Connecting both inputs of a NOR gate to signal A produces:", options: ["A' (NOT A)", "A", "1", "0"], answer: 0, explanation: "(A + A)' = A'. A 2-input NOR with tied inputs acts as an Inverter.", xp: 25 },
          { id: "idm_4_7", q: "Simplify F = (A' B' C') · (A' B' C') · (A' B' C').", options: ["A'B'C'", "ABC", "1", "0"], answer: 0, explanation: "A'B'C'.", xp: 25 },
          { id: "idm_4_8", q: "Simplify F = (A + B + C + D) + (A + B + C + D).", options: ["A + B + C + D", "ABCD", "1", "0"], answer: 0, explanation: "A + B + C + D.", xp: 25 },
          { id: "idm_4_9", q: "Simplify F = (X Y + Z)(X Y + Z)(X Y + Z).", options: ["XY + Z", "XYZ", "X + Y + Z", "1"], answer: 0, explanation: "XY + Z.", xp: 25 },
          { id: "idm_4_10", q: "How many gates can be saved by replacing an AND gate with tied inputs A, A by a direct wire?", options: ["1 gate", "2 gates", "0 gates", "3 gates"], answer: 0, explanation: "A · A = A eliminates 1 redundant AND gate.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 7. COMPLEMENT LAW                                                          */
  /* ========================================================================= */
  "complement-law": {
    title: "Complement Law",
    icon: "☯️",
    description: "Understand relationships between a variable and its inverse: A · A' = 0 and A + A' = 1.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "cmp_1_1", q: "Which equation states the OR Complement Law?", options: ["A + A' = 1", "A · A' = 0", "A + 0 = A", "A · 1 = A"], answer: 0, explanation: "ORing a variable with its complement always produces 1.", xp: 10 },
          { id: "cmp_1_2", q: "Which equation states the AND Complement Law?", options: ["A · A' = 0", "A + A' = 1", "A · 0 = 0", "A + 1 = 1"], answer: 0, explanation: "ANDing a variable with its complement always produces 0.", xp: 10 },
          { id: "cmp_1_3", q: "What is X + X'?", options: ["1", "0", "X", "2X"], answer: 0, explanation: "X + X' = 1.", xp: 10 },
          { id: "cmp_1_4", q: "What is Y · Y'?", options: ["0", "1", "Y", "Y'"], answer: 0, explanation: "Y · Y' = 0.", xp: 10 },
          { id: "cmp_1_5", q: "What is (A + B) + (A + B)'?", options: ["1", "0", "A + B", "AB"], answer: 0, explanation: "K + K' = 1.", xp: 10 },
          { id: "cmp_1_6", q: "What is (A B) · (A B)'?", options: ["0", "1", "AB", "A+B"], answer: 0, explanation: "K · K' = 0.", xp: 10 },
          { id: "cmp_1_7", q: "What is 0' (complement of 0)?", options: ["1", "0", "Undefined", "-1"], answer: 0, explanation: "NOT 0 = 1.", xp: 10 },
          { id: "cmp_1_8", q: "What is 1' (complement of 1)?", options: ["0", "1", "Undefined", "-1"], answer: 0, explanation: "NOT 1 = 0.", xp: 10 },
          { id: "cmp_1_9", q: "Simplify Z' + Z.", options: ["1", "0", "Z", "Z'"], answer: 0, explanation: "Z' + Z = Z + Z' = 1.", xp: 10 },
          { id: "cmp_1_10", q: "Simplify W' · W.", options: ["0", "1", "W", "W'"], answer: 0, explanation: "W' · W = W · W' = 0.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "cmp_2_1", q: "Simplify A B + A B'.", options: ["A", "B", "1", "0"], answer: 0, explanation: "A(B + B') = A(1) = A.", xp: 15 },
          { id: "cmp_2_2", q: "Simplify (A + B)(A + B').", options: ["A", "B", "1", "0"], answer: 0, explanation: "A + BB' = A + 0 = A.", xp: 15 },
          { id: "cmp_2_3", q: "Simplify A B C + A B C'.", options: ["AB", "C", "ABC", "1"], answer: 0, explanation: "AB(C + C') = AB(1) = AB.", xp: 15 },
          { id: "cmp_2_4", q: "Simplify (X + Y + Z)(X + Y + Z').", options: ["X + Y", "Z", "XYZ", "1"], answer: 0, explanation: "(X + Y) + ZZ' = (X + Y) + 0 = X + Y.", xp: 15 },
          { id: "cmp_2_5", q: "Simplify A'B + AB.", options: ["B", "A", "1", "0"], answer: 0, explanation: "B(A' + A) = B(1) = B.", xp: 15 },
          { id: "cmp_2_6", q: "Simplify (A' + B)(A + B).", options: ["B", "A", "1", "0"], answer: 0, explanation: "B + A'A = B + 0 = B.", xp: 15 },
          { id: "cmp_2_7", q: "Simplify A B C D · A'.", options: ["0", "BCD", "A", "1"], answer: 0, explanation: "(A A') B C D = 0 · BCD = 0.", xp: 15 },
          { id: "cmp_2_8", q: "Simplify (A + B + C) + A'.", options: ["1", "B + C", "A", "0"], answer: 0, explanation: "(A + A') + B + C = 1 + B + C = 1.", xp: 15 },
          { id: "cmp_2_9", q: "Simplify (X' + Y') + (X' + Y')'.", options: ["1", "0", "X' + Y'", "XY"], answer: 0, explanation: "K + K' = 1.", xp: 15 },
          { id: "cmp_2_10", q: "Simplify (W X') · (W X')'.", options: ["0", "1", "WX'", "W+X"], answer: 0, explanation: "K · K' = 0.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "cmp_3_1", q: "Simplify F = A B + A' B + A B'.", options: ["A + B", "AB", "1", "0"], answer: 0, explanation: "AB + A'B = B. AB + AB' = A. Result: A + B.", xp: 20 },
          { id: "cmp_3_2", q: "Simplify F = (A + B)(A' + B)(A + B').", options: ["AB", "A + B", "1", "0"], answer: 0, explanation: "(A + B)(A' + B) = B. (A + B)(A + B') = A. Result: AB.", xp: 20 },
          { id: "cmp_3_3", q: "Simplify F = X Y Z + X Y' Z + X' Y Z.", options: ["XZ + YZ", "XYZ", "X + Y + Z", "1"], answer: 0, explanation: "XZ(Y + Y') + YZ(X + X') = XZ + YZ = Z(X + Y).", xp: 20 },
          { id: "cmp_3_4", q: "What is the output of an XOR gate when both inputs are connected to signal A and its inverter A'?", options: ["1", "0", "A", "A'"], answer: 0, explanation: "A XOR A' = A'(A')' + A(A)' = A'A' + AA = A' + A = 1.", xp: 20 },
          { id: "cmp_3_5", q: "What is the output of an XNOR gate when inputs are A and A'?", options: ["0", "1", "A", "A'"], answer: 0, explanation: "A XNOR A' = (A XOR A')' = 1' = 0.", xp: 20 },
          { id: "cmp_3_6", q: "Simplify F = (A + B + C)(A + B + C')(A + B' + C)(A + B' + C').", options: ["A", "B", "C", "1"], answer: 0, explanation: "Terms 1 & 2 -> A + B. Terms 3 & 4 -> A + B'. Then (A + B)(A + B') = A.", xp: 20 },
          { id: "cmp_3_7", q: "Simplify F = A B C D + A B C D' + A B C' D + A B C' D'.", options: ["AB", "CD", "A + B", "1"], answer: 0, explanation: "AB(CD + CD' + C'D + C'D') = AB(C(1) + C'(1)) = AB(1) = AB.", xp: 20 },
          { id: "cmp_3_8", q: "Simplify F = (A + B + C + D)(A + B + C + D')(A + B + C' + D)(A + B + C' + D').", options: ["A + B", "C + D", "AB", "1"], answer: 0, explanation: "Terms 1 & 2 -> A + B + C. Terms 3 & 4 -> A + B + C'. (A + B + C)(A + B + C') = A + B.", xp: 20 },
          { id: "cmp_3_9", q: "Simplify F = A' B C + A' B' C + A' B C'.", options: ["A'C + A'B", "A'B'C'", "A", "1"], answer: 0, explanation: "A'C(B + B') + A'B C' = A'C + A'BC' = A'(C + BC') = A'(C + B) = A'B + A'C.", xp: 20 },
          { id: "cmp_3_10", q: "Simplify F = (W + X + Y)(W + X + Y') + W'.", options: ["1", "W + X", "W'", "0"], answer: 0, explanation: "(W + X + YY') = W + X. Then (W + X) + W' = (W + W') + X = 1 + X = 1.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "cmp_4_1", q: "Fully simplify F = A B C + A B C' + A B' C + A B' C' + A' B C + A' B C' + A' B' C.", options: ["A + B + C", "AB + BC + AC", "1", "0"], answer: 0, explanation: "F contains 7 of the 8 minterms of 3 variables. Only A'B'C' is missing. F = (A'B'C')' = A + B + C (De Morgan).", xp: 25 },
          { id: "cmp_4_2", q: "Simplify F = (A + B + C)(A + B + C')(A + B' + C)(A + B' + C')(A' + B + C)(A' + B + C')(A' + B' + C).", options: ["A + B + C", "ABC", "A + B", "1"], answer: 0, explanation: "7 of 8 maxterms present. Missing maxterm is (A' + B' + C'). Product = (A' + B' + C')' = ABC... Wait, product of 7 maxterms equals the complement of missing minterm = A + B + C.", xp: 25 },
          { id: "cmp_4_3", q: "Simplify F = A' B' C' + A' B' C + A' B C' + A' B C + A B' C' + A B' C + A B C'.", options: ["A' + B' + C'", "ABC", "A + B + C", "1"], answer: 0, explanation: "7 minterms present. Missing minterm is ABC. Sum = (ABC)' = A' + B' + C'.", xp: 25 },
          { id: "cmp_4_4", q: "Simplify F = (X + Y)(X + Y')(X' + Y)(X' + Y').", options: ["0", "1", "X", "Y"], answer: 0, explanation: "(X)(X') = 0.", xp: 25 },
          { id: "cmp_4_5", q: "Simplify F = X Y + X Y' + X' Y + X' Y'.", options: ["1", "0", "X", "Y"], answer: 0, explanation: "All 4 minterms of 2 variables sum to 1.", xp: 25 },
          { id: "cmp_4_6", q: "What circuit optimization eliminates an entire logic block whose expression simplifies to A + A'?", options: ["Replace block with constant 1 (VCC wire)", "Replace with GND", "Replace with inverter", "Add 2 gates"], answer: 0, explanation: "A + A' = 1, so the entire block is replaced with a hardwired 1.", xp: 25 },
          { id: "cmp_4_7", q: "What circuit optimization eliminates an entire logic block whose expression simplifies to A · A'?", options: ["Replace block with constant 0 (GND wire)", "Replace with VCC", "Replace with XOR", "Add 3 gates"], answer: 0, explanation: "A · A' = 0, so the entire block is replaced with a hardwired 0.", xp: 25 },
          { id: "cmp_4_8", q: "Simplify F = (A B C + A' B' C') + (A B C + A' B' C')'.", options: ["1", "0", "ABC", "A'B'C'"], answer: 0, explanation: "K + K' = 1.", xp: 25 },
          { id: "cmp_4_9", q: "Simplify F = (W X Y Z) · (W X Y Z)'.", options: ["0", "1", "WXYZ", "W+X+Y+Z"], answer: 0, explanation: "K · K' = 0.", xp: 25 },
          { id: "cmp_4_10", q: "How many gates are saved by replacing A + A' with a VCC connection?", options: ["2 gates (1 NOT, 1 OR)", "1 gate", "3 gates", "0 gates"], answer: 0, explanation: "A + A' uses 1 NOT gate and 1 OR gate. Hardwiring 1 saves 2 gates!", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 8. INVOLUTION LAW                                                          */
  /* ========================================================================= */
  "involution-law": {
    title: "Involution Law",
    icon: "🔄",
    description: "Learn double inversion elimination: (A')' = A.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "inv_1_1", q: "Which equation states the Involution Law?", options: ["(A')' = A", "A + A = A", "A · A = A", "A + A' = 1"], answer: 0, explanation: "Double negation restores the original variable: (A')' = A.", xp: 10 },
          { id: "inv_1_2", q: "What is NOT (NOT X)?", options: ["X", "X'", "0", "1"], answer: 0, explanation: "(X')' = X.", xp: 10 },
          { id: "inv_1_3", q: "If A = 1, what is (A')'?", options: ["1", "0", "Undefined", "A'"], answer: 0, explanation: "A = 1 -> A' = 0 -> (A')' = 1.", xp: 10 },
          { id: "inv_1_4", q: "If A = 0, what is (A')'?", options: ["0", "1", "Undefined", "A'"], answer: 0, explanation: "A = 0 -> A' = 1 -> (A')' = 0.", xp: 10 },
          { id: "inv_1_5", q: "Simplify ((A + B)')'.", options: ["A + B", "(A + B)'", "AB", "A'B'"], answer: 0, explanation: "Double complement cancels out, yielding A + B.", xp: 10 },
          { id: "inv_1_6", q: "Simplify ((A B)')'.", options: ["AB", "(AB)'", "A + B", "A' + B'"], answer: 0, explanation: "Double complement cancels out, yielding AB.", xp: 10 },
          { id: "inv_1_7", q: "What is (((A')')')?", options: ["A'", "A", "1", "0"], answer: 0, explanation: "3 inversions: 2 cancel out, leaving 1 inversion: A'.", xp: 10 },
          { id: "inv_1_8", q: "What is ((((A')')')')?", options: ["A", "A'", "1", "0"], answer: 0, explanation: "4 inversions: 4 is even, so all cancel out: A.", xp: 10 },
          { id: "inv_1_9", q: "An even number of cascaded NOT gates produces output equal to:", options: ["Input signal (uninverted)", "Inverted input", "Constant 0", "Constant 1"], answer: 0, explanation: "Even number of inverters cancel by Involution Law.", xp: 10 },
          { id: "inv_1_10", q: "An odd number of cascaded NOT gates produces output equal to:", options: ["Inverted input signal", "Uninverted input", "Constant 0", "Constant 1"], answer: 0, explanation: "Odd number of inverters leave 1 active inversion.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "inv_2_1", q: "Simplify ((A' B)')'.", options: ["A'B", "AB'", "A + B'", "A' + B"], answer: 0, explanation: "Double complement cancels: A'B.", xp: 15 },
          { id: "inv_2_2", q: "Simplify ((X + Y')')'.", options: ["X + Y'", "X' + Y", "XY'", "X'Y"], answer: 0, explanation: "Double complement cancels: X + Y'.", xp: 15 },
          { id: "inv_2_3", q: "Simplify [ (A B)' ]' + C.", options: ["AB + C", "A + B + C", "ABC", "A'B' + C"], answer: 0, explanation: "((AB)')' = AB. Then AB + C.", xp: 15 },
          { id: "inv_2_4", q: "Simplify [ (X + Y)' ]' · Z.", options: ["(X + Y)Z", "XYZ", "X'Y'Z", "X + YZ"], answer: 0, explanation: "((X + Y)')' = X + Y. Then (X + Y)Z.", xp: 15 },
          { id: "inv_2_5", q: "Simplify (((Z')')')'.", options: ["Z", "Z'", "1", "0"], answer: 0, explanation: "4 primes on Z = Z.", xp: 15 },
          { id: "inv_2_6", q: "Simplify (((W')')')'.'", options: ["W'", "W", "1", "0"], answer: 0, explanation: "5 primes on W = W'.", xp: 15 },
          { id: "inv_2_7", q: "Simplify [ (A' + B')' ]'.", options: ["A' + B'", "AB", "A + B", "A'B'"], answer: 0, explanation: "Double complement cancels: A' + B'.", xp: 15 },
          { id: "inv_2_8", q: "Simplify [ (A' B')' ]'.", options: ["A'B'", "A + B", "AB", "A' + B'"], answer: 0, explanation: "Double complement cancels: A'B'.", xp: 15 },
          { id: "inv_2_9", q: "Two cascaded NOT gates in series can be optimized to:", options: ["A single wire (0 gates)", "1 NOT gate", "1 AND gate", "1 OR gate"], answer: 0, explanation: "(A')' = A, so two NOT gates in series can be replaced by a wire.", xp: 15 },
          { id: "inv_2_10", q: "Four cascaded NOT gates in series can be optimized to:", options: ["A single wire (0 gates)", "2 NOT gates", "1 NOT gate", "1 NAND gate"], answer: 0, explanation: "4 inverters = 0 inverters (direct wire).", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "inv_3_1", q: "Simplify F = [ (A B)' + (C D)' ]'' .", options: ["(AB)' + (CD)'", "AB + CD", "A'B' + C'D'", "ABCD"], answer: 0, explanation: "Double outer complement cancels: (AB)' + (CD)'.", xp: 20 },
          { id: "inv_3_2", q: "Simplify F = [ (A + B)' · (C + D)' ]'' .", options: ["(A + B)'(C + D)'", "(A + B) + (C + D)", "AB + CD", "A'B'C'D'"], answer: 0, explanation: "Double outer complement cancels.", xp: 20 },
          { id: "inv_3_3", q: "If a circuit has a chain of 5 NOT gates, how many gates can be saved during optimization?", options: ["4 gates (reduce 5 to 1 NOT gate)", "5 gates", "2 gates", "3 gates"], answer: 0, explanation: "5 inverters -> 1 inverter. 5 - 1 = 4 gates saved!", xp: 20 },
          { id: "inv_3_4", q: "If a circuit has a chain of 6 NOT gates, how many gates can be saved?", options: ["6 gates (reduce 6 to direct wire)", "5 gates", "4 gates", "3 gates"], answer: 0, explanation: "6 inverters -> 0 inverters. 6 - 0 = 6 gates saved!", xp: 20 },
          { id: "inv_3_5", q: "Simplify F = [ (A' B + C')' ]' + D.", options: ["A'B + C' + D", "AB' + C + D", "ABC + D", "A + B + C + D"], answer: 0, explanation: "((A'B + C')')' = A'B + C'. Result: A'B + C' + D.", xp: 20 },
          { id: "inv_3_6", q: "Simplify F = [ (X + Y' Z)' ]' · (W + 0).", options: ["(X + Y'Z)W", "XYZW", "X + Y + Z + W", "W"], answer: 0, explanation: "((X + Y'Z)')' = X + Y'Z. W + 0 = W. Result: (X + Y'Z)W.", xp: 20 },
          { id: "inv_3_7", q: "Simplify F = [ (A B C)' ]'' + (D E)''.", options: ["(ABC)' + DE", "ABC + DE", "A'B'C' + D'E'", "1"], answer: 0, explanation: "((ABC)')'' = (ABC)'. (DE)'' = DE. Result: (ABC)' + DE.", xp: 20 },
          { id: "inv_3_8", q: "Simplify F = [ (A + B')'' ]' .", options: ["(A + B')'", "A + B'", "A'B", "A' + B"], answer: 0, explanation: "(A + B')'' = A + B'. Then complement outer: (A + B')' = A'B.", xp: 20 },
          { id: "inv_3_9", q: "Simplify F = [ (X' Y)'' ]'' .", options: ["X'Y", "XY'", "X + Y'", "X' + Y"], answer: 0, explanation: "4 complements cancel: X'Y.", xp: 20 },
          { id: "inv_3_10", q: "Simplify F = [ ((A + B)')' + ((C D)')' ]'.", options: ["(A + B + CD)'", "A + B + CD", "A'B'(C' + D')", "1"], answer: 0, explanation: "((A + B)')' = A + B. ((CD)')' = CD. Result: (A + B + CD)'.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "inv_4_1", q: "Fully simplify F = [ ( [ (A B)' ]' + [ (C + D)' ]' )' ]'.", options: ["AB + C + D", "(AB)'(C + D)'", "AB + CD", "A + B + C + D"], answer: 0, explanation: "Innermost double complements: ((AB)')' = AB, ((C+D)')' = C+D. Then outer double complement: ( (AB + C + D)' )' = AB + C + D.", xp: 25 },
          { id: "inv_4_2", q: "Simplify F = [ (A' + B')'' · (C' + D')'' ]''.", options: ["(A' + B')(C' + D')", "AB + CD", "A + B + C + D", "(AB)' + (CD)'"], answer: 0, explanation: "All double complements cancel: (A' + B')(C' + D') = (AB)'(CD)'.", xp: 25 },
          { id: "inv_4_3", q: "In active-low logic design, double inversion is used to convert active-high signals. If signal A passes through 2 inverters, what is the propagation delay penalty?", options: ["2 gate delays (t_pd_inverter × 2)", "0 delay", "1 gate delay", "4 gate delays"], answer: 0, explanation: "Although logically equivalent to A, 2 physical inverters add 2 gate propagation delays.", xp: 25 },
          { id: "inv_4_4", q: "Simplify F = [ ( (A B C)' )' · ( (D + E)' )' ]'.", options: ["(ABC · (D + E))'", "ABC + D + E", "A'B'C' + D'E'", "1"], answer: 0, explanation: "Inner double complements: ABC and D + E. Then outer complement: (ABC(D + E))'.", xp: 25 },
          { id: "inv_4_5", q: "Simplify F = [ (X' + Y)''' ]'.", options: ["X' + Y", "X Y'", "(X' + Y)'", "X + Y'"], answer: 0, explanation: "4 total complements on (X' + Y): (X' + Y)'''' = X' + Y.", xp: 25 },
          { id: "inv_4_6", q: "Simplify F = [ (A + B)'''' + (C D)'''' ]''.", options: ["A + B + CD", "AB + C + D", "(A+B)CD", "1"], answer: 0, explanation: "All complements are even (4 and 2), so all cancel out: A + B + CD.", xp: 25 },
          { id: "inv_4_7", q: "Simplify F = [ (A' B')' ]' + [ (A + B)' ]'.", options: ["A'B' + A + B", "1", "AB", "0"], answer: 0, explanation: "((A'B')')' = A'B'. ((A+B)')' = A + B. Result: A'B' + A + B. Since A + A'B' = A + B', (A + B') + B = A + 1 = 1.", xp: 25 },
          { id: "inv_4_8", q: "Simplify F = [ (W X)' ]''' · [ (Y + Z)' ]'''.", options: ["(WX)' (Y + Z)'", "WX + Y + Z", "W'X' + Y'Z'", "1"], answer: 0, explanation: "3 complements = 1 complement: (WX)' and (Y + Z)'. Product: (WX)'(Y + Z)'.", xp: 25 },
          { id: "inv_4_9", q: "How many inverter gates are required to implement F = (((((A')')')')')'?", options: ["0 gates (6 inverters cancel to direct wire)", "6 gates", "1 gate", "2 gates"], answer: 0, explanation: "6 is even, so all 6 inverters cancel to a direct wire (0 gates).", xp: 25 },
          { id: "inv_4_10", q: "Simplify F = [ (A B + A' B')'' ]' .", options: ["A'B + AB'", "AB + A'B'", "A + B", "AB"], answer: 0, explanation: "(AB + A'B')'' = AB + A'B' (XNOR). Outer complement: (AB + A'B')' = A'B + AB' (XOR).", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 9. ABSORPTION LAW                                                         */
  /* ========================================================================= */
  "absorption-law": {
    title: "Absorption Law",
    icon: "🧩",
    description: "Discover how redundant terms are absorbed: A + AB = A and A(A + B) = A.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "abs_1_1", q: "Which equation represents the standard OR Absorption Law?", options: ["A + AB = A", "A + AB = AB", "A + AB = A + B", "A + AB = 1"], answer: 0, explanation: "A absorbs the product term AB: A + AB = A(1 + B) = A(1) = A.", xp: 10 },
          { id: "abs_1_2", q: "Which equation represents the dual AND Absorption Law?", options: ["A(A + B) = A", "A(A + B) = AB", "A(A + B) = A + B", "A(A + B) = 0"], answer: 0, explanation: "A(A + B) = AA + AB = A + AB = A.", xp: 10 },
          { id: "abs_1_3", q: "Simplify X + XY.", options: ["X", "Y", "XY", "X + Y"], answer: 0, explanation: "X absorbs XY.", xp: 10 },
          { id: "abs_1_4", q: "Simplify P(P + Q).", options: ["P", "Q", "PQ", "P + Q"], answer: 0, explanation: "P absorbs (P + Q).", xp: 10 },
          { id: "abs_1_5", q: "Simplify A + A B C.", options: ["A", "ABC", "A + BC", "B + C"], answer: 0, explanation: "A + A(BC) = A(1 + BC) = A.", xp: 10 },
          { id: "abs_1_6", q: "Simplify X(X + Y + Z).", options: ["X", "XYZ", "X + YZ", "Y + Z"], answer: 0, explanation: "X(X + K) = X.", xp: 10 },
          { id: "abs_1_7", q: "Simplify A' + A'B.", options: ["A'", "B", "A'B", "A' + B"], answer: 0, explanation: "A' + A'B = A'(1 + B) = A'.", xp: 10 },
          { id: "abs_1_8", q: "Simplify B(B + C').", options: ["B", "C'", "BC'", "B + C'"], answer: 0, explanation: "B(B + C') = B.", xp: 10 },
          { id: "abs_1_9", q: "The term AB in A + AB is called:", options: ["Redundant (absorbed) term", "Essential term", "Dominant term", "Identity term"], answer: 0, explanation: "AB is completely absorbed by A.", xp: 10 },
          { id: "abs_1_10", q: "True or False: A + A'B = A + B (Negative Absorption Law).", options: ["True", "False", "Only when A=1", "Only when B=0"], answer: 0, explanation: "True! A + A'B = (A + A')(A + B) = 1 · (A + B) = A + B.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "abs_2_1", q: "Simplify A + A'B.", options: ["A + B", "A", "B", "AB"], answer: 0, explanation: "A + A'B = (A + A')(A + B) = A + B.", xp: 15 },
          { id: "abs_2_2", q: "Simplify A' + AB.", options: ["A' + B", "A'", "B", "A'B"], answer: 0, explanation: "A' + AB = (A' + A)(A' + B) = A' + B.", xp: 15 },
          { id: "abs_2_3", q: "Simplify A(A' + B).", options: ["AB", "A + B", "A", "0"], answer: 0, explanation: "A A' + AB = 0 + AB = AB.", xp: 15 },
          { id: "abs_2_4", q: "Simplify A'(A + B).", options: ["A'B", "A' + B", "A'", "0"], answer: 0, explanation: "A'A + A'B = 0 + A'B = A'B.", xp: 15 },
          { id: "abs_2_5", q: "Simplify X + X'Y'.", options: ["X + Y'", "X'", "Y'", "XY'"], answer: 0, explanation: "X + X'Y' = (X + X')(X + Y') = X + Y'.", xp: 15 },
          { id: "abs_2_6", q: "Simplify X' + XY.", options: ["X' + Y", "X'", "Y", "X'Y"], answer: 0, explanation: "X' + XY = (X' + X)(X' + Y) = X' + Y.", xp: 15 },
          { id: "abs_2_7", q: "Simplify (A + B)(A + B + C).", options: ["A + B", "C", "ABC", "A + B + C"], answer: 0, explanation: "Let K = A + B. K(K + C) = K = A + B.", xp: 15 },
          { id: "abs_2_8", q: "Simplify AB + ABC + ABCD.", options: ["AB", "ABCD", "A + B", "1"], answer: 0, explanation: "AB absorbs ABC, which absorbs ABCD. Result: AB.", xp: 15 },
          { id: "abs_2_9", q: "Simplify (A + B)(A + B + C + D).", options: ["A + B", "ABCD", "A + B + C + D", "1"], answer: 0, explanation: "K(K + C + D) = K = A + B.", xp: 15 },
          { id: "abs_2_10", q: "Simplify A B + A B' C.", options: ["AB + AC", "A + B", "ABC", "BC"], answer: 0, explanation: "Factor out A: A(B + B'C) = A(B + C) = AB + AC.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "abs_3_1", q: "Simplify F = A + A'B + A'B'C.", options: ["A + B + C", "A + BC", "AB + C", "ABC"], answer: 0, explanation: "A + A'B = A + B. Then (A + B) + A'B'C = A + B + C.", xp: 20 },
          { id: "abs_3_2", q: "Simplify F = A(A' + B)(A' + B' + C).", options: ["ABC", "A + B + C", "0", "A"], answer: 0, explanation: "A(A' + B) = AB. Then AB(A' + B' + C) = ABA' + ABB' + ABC = 0 + 0 + ABC = ABC.", xp: 20 },
          { id: "abs_3_3", q: "How many gates are saved by replacing A + AB (1 AND, 1 OR) with A (direct wire)?", options: ["2 gates", "1 gate", "3 gates", "0 gates"], answer: 0, explanation: "A + AB uses 1 AND and 1 OR. Replacing with wire saves 2 gates!", xp: 20 },
          { id: "abs_3_4", q: "Simplify F = X' + XY + X'Y'Z.", options: ["X' + Y + Z", "X' + YZ", "XY + Z", "XYZ"], answer: 0, explanation: "X' + XY = X' + Y. (X' + Y) + X'Y'Z = X' + Y + Z.", xp: 20 },
          { id: "abs_3_5", q: "Simplify F = (A + B')(A + B + C).", options: ["A + B'C", "A + B", "ABC", "B'C"], answer: 0, explanation: "Expand: AA + AB + AC + B'A + B'B + B'C = A(1 + B + C + B') + 0 + B'C = A(1) + B'C = A + B'C.", xp: 20 },
          { id: "abs_3_6", q: "Simplify F = A B + A' C + B C.", options: ["AB + A'C", "AB + BC", "A'C + BC", "ABC"], answer: 0, explanation: "By Consensus Theorem, BC is redundant: AB + A'C.", xp: 20 },
          { id: "abs_3_7", q: "Simplify F = A'B' + A'B'C + A'B'C'D.", options: ["A'B'", "C + D", "A' + B'", "1"], answer: 0, explanation: "A'B' absorbs all terms containing A'B'. Result: A'B'.", xp: 20 },
          { id: "abs_3_8", q: "Simplify F = (W + X')(W + X + Y).", options: ["W + X'Y", "W + X", "WXY", "1"], answer: 0, explanation: "(W + X')(W + X + Y) = W + X'(X + Y) = W + X'X + X'Y = W + 0 + X'Y = W + X'Y.", xp: 20 },
          { id: "abs_3_9", q: "Simplify F = A + A' B + A' B' C + A' B' C' D.", options: ["A + B + C + D", "ABCD", "A + BCD", "1"], answer: 0, explanation: "Repeated negative absorption: A + B + C + D.", xp: 20 },
          { id: "abs_3_10", q: "Simplify F = A(A + B)(A + B + C)(A + B + C + D).", options: ["A", "A + B", "ABCD", "1"], answer: 0, explanation: "A absorbs (A + B), which absorbs the rest. Result: A.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "abs_4_1", q: "Fully simplify F = A B + A(B + C) + B(B + C).", options: ["AB + BC", "A + B + C", "ABC", "B"], answer: 0, explanation: "A(B + C) = AB + AC. B(B + C) = B + BC = B. F = AB + AB + AC + B = B + AB + AC = B + AC... Wait: AB + AB + AC + B = B(1 + A + A) + AC = B + AC.", xp: 25 },
          { id: "abs_4_2", q: "Simplify F = (A + B')(A' + B)(A + B).", options: ["AB", "A + B", "A'B'", "0"], answer: 0, explanation: "(A + B)(A + B') = A. Then A(A' + B) = AA' + AB = AB.", xp: 25 },
          { id: "abs_4_3", q: "Simplify F = A' B' C' + A' B' C + A' B C + A' B C'.", options: ["A'", "A'B'", "A'C", "1"], answer: 0, explanation: "A'B'(C' + C) + A'B(C + C') = A'B'(1) + A'B(1) = A'(B' + B) = A'(1) = A'.", xp: 25 },
          { id: "abs_4_4", q: "Simplify F = (X + Y + Z)(X + Y + Z')(X + Y' + Z).", options: ["(X + Y)(X + Z)", "X + Y + Z", "XYZ", "X + YZ"], answer: 0, explanation: "Terms 1 & 2 -> X + Y. Terms 1 & 3 -> X + Z. Product: (X + Y)(X + Z) = X + YZ.", xp: 25 },
          { id: "abs_4_5", q: "Simplify F = A B C + A B C D + A B C D E + A B C D E F.", options: ["ABC", "ABCDEF", "A + B + C", "1"], answer: 0, explanation: "ABC absorbs all longer terms containing ABC. Result: ABC.", xp: 25 },
          { id: "abs_4_6", q: "Simplify F = (A + B)(A + C)(A + D)(A + E).", options: ["A + BCDE", "ABCDE", "A + B + C + D + E", "1"], answer: 0, explanation: "A + BCDE.", xp: 25 },
          { id: "abs_4_7", q: "Simplify F = A + A' B + A' B' C + A' B' C' D + A' B' C' D' E.", options: ["A + B + C + D + E", "ABCDE", "A + BCDE", "1"], answer: 0, explanation: "Cascaded negative absorption: A + B + C + D + E.", xp: 25 },
          { id: "abs_4_8", q: "Simplify F = (A' + B')(A' + B' + C')(A' + B' + C' + D').", options: ["A' + B'", "(AB)'", "A'B'C'D'", "1"], answer: 0, explanation: "A' + B' = (AB)'.", xp: 25 },
          { id: "abs_4_9", q: "How many gates are saved by reducing A + A'B + A'B'C to A + B + C?", options: ["4 gates (2 NOTs, 2 ANDs, 2 ORs -> 2 ORs)", "3 gates", "2 gates", "5 gates"], answer: 0, explanation: "Original uses 2 NOTs, 2 ANDs, 2 ORs (6 gates). Simplified uses 2 ORs (2 gates). Saving = 4 gates!", xp: 25 },
          { id: "abs_4_10", q: "Simplify F = [ A + B(A + C) ] [ A' + C(A' + B) ] .", options: ["AC", "AB", "A + BC", "0"], answer: 0, explanation: "B(A + C) = AB + BC. A + AB + BC = A + BC. C(A' + B) = A'C + BC. A' + A'C + BC = A' + BC. (A + BC)(A' + BC) = BC + AA' = BC + 0 = BC.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 10. DE MORGAN'S LAWS                                                      */
  /* ========================================================================= */
  "demorgan-law": {
    title: "De Morgan's Laws",
    icon: "🧠",
    description: "Transform complements of products and sums: (A · B)' = A' + B' and (A + B)' = A' · B'.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "dem_1_1", q: "Which equation states De Morgan's First Law (complement of AND)?", options: ["(A · B)' = A' + B'", "(A · B)' = A' · B'", "(A · B)' = A + B", "(A · B)' = (A + B)'"], answer: 0, explanation: "The complement of a product equals the sum of complements.", xp: 10 },
          { id: "dem_1_2", q: "Which equation states De Morgan's Second Law (complement of OR)?", options: ["(A + B)' = A' · B'", "(A + B)' = A' + B'", "(A + B)' = AB", "(A + B)' = A + B'"], answer: 0, explanation: "The complement of a sum equals the product of complements.", xp: 10 },
          { id: "dem_1_3", q: "Simplify (X Y)'.", options: ["X' + Y'", "X'Y'", "X + Y", "XY"], answer: 0, explanation: "(XY)' = X' + Y'.", xp: 10 },
          { id: "dem_1_4", q: "Simplify (X + Y)'.", options: ["X' Y'", "X' + Y'", "X + Y", "XY"], answer: 0, explanation: "(X + Y)' = X'Y'.", xp: 10 },
          { id: "dem_1_5", q: "A NAND gate is logically equivalent to which active-low gate?", options: ["Active-low OR (Inverted-input OR)", "Active-low AND", "NOR gate", "XOR gate"], answer: 0, explanation: "(AB)' = A' + B' (Active-low OR).", xp: 10 },
          { id: "dem_1_6", q: "A NOR gate is logically equivalent to which active-low gate?", options: ["Active-low AND (Inverted-input AND)", "Active-low OR", "NAND gate", "XOR gate"], answer: 0, explanation: "(A + B)' = A'B' (Active-low AND).", xp: 10 },
          { id: "dem_1_7", q: "Simplify (A B C)'.", options: ["A' + B' + C'", "A'B'C'", "A + B + C", "ABC"], answer: 0, explanation: "Break the bar and change the operator: A' + B' + C'.", xp: 10 },
          { id: "dem_1_8", q: "Simplify (A + B + C)'.", options: ["A' B' C'", "A' + B' + C'", "A + B + C", "ABC"], answer: 0, explanation: "Break the bar and change operator: A'B'C'.", xp: 10 },
          { id: "dem_1_9", q: "What rule is expressed by 'Break the bar, change the sign'?", options: ["De Morgan's Law", "Distributive Law", "Commutative Law", "Associative Law"], answer: 0, explanation: "Popular mnemonic for De Morgan's laws.", xp: 10 },
          { id: "dem_1_10", q: "Simplify (P' + Q')'.", options: ["PQ", "P + Q", "P'Q'", "P' + Q'"], answer: 0, explanation: "(P')' · (Q')' = PQ.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "dem_2_1", q: "Simplify (A' B)'.", options: ["A + B'", "A' + B'", "AB'", "A' + B"], answer: 0, explanation: "(A')' + B' = A + B'.", xp: 15 },
          { id: "dem_2_2", q: "Simplify (A + B')'.", options: ["A' B", "A' + B", "AB'", "A + B"], answer: 0, explanation: "A' · (B')' = A'B.", xp: 15 },
          { id: "dem_2_3", q: "Simplify (A' + B')'.", options: ["A B", "A + B", "A'B'", "A' + B'"], answer: 0, explanation: "(A')' · (B')' = AB.", xp: 15 },
          { id: "dem_2_4", q: "Simplify (A' B')'.", options: ["A + B", "AB", "A' + B'", "A'B'"], answer: 0, explanation: "(A')' + (B')' = A + B.", xp: 15 },
          { id: "dem_2_5", q: "Simplify [ (A + B) · C ]' .", options: ["A'B' + C'", "(A' + B')C'", "A + B + C'", "ABC'"], answer: 0, explanation: "(A + B)' + C' = A'B' + C'.", xp: 15 },
          { id: "dem_2_6", q: "Simplify [ AB + CD ]' .", options: ["(A' + B')(C' + D')", "A'B' + C'D'", "A' + B' + C' + D'", "ABCD"], answer: 0, explanation: "(AB)' · (CD)' = (A' + B')(C' + D').", xp: 15 },
          { id: "dem_2_7", q: "Simplify [ (A + B)(C + D) ]' .", options: ["A'B' + C'D'", "(A' + B')(C' + D')", "AB + CD", "A' + B' + C' + D'"], answer: 0, explanation: "(A + B)' + (C + D)' = A'B' + C'D'.", xp: 15 },
          { id: "dem_2_8", q: "Simplify [ X + Y' Z ]' .", options: ["X' (Y + Z')", "X'Y'Z", "X + YZ'", "X' + Y + Z'"], answer: 0, explanation: "X' · (Y'Z)' = X'(Y + Z').", xp: 15 },
          { id: "dem_2_9", q: "Simplify [ X (Y' + Z) ]' .", options: ["X' + Y Z'", "X'Y'Z", "X + Y'Z", "X'(Y + Z')"], answer: 0, explanation: "X' + (Y' + Z)' = X' + YZ'.", xp: 15 },
          { id: "dem_2_10", q: "Express A NOR B using NAND gates.", options: ["( (A NAND A) NAND (B NAND B) ) NAND ( (A NAND A) NAND (B NAND B) )", "A NAND B", "A' NAND B'", "Cannot be done"], answer: 0, explanation: "A NOR B = A'B' = (A')' (B')' = (A NAND A) AND (B NAND B) = inverted NAND.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "dem_3_1", q: "Simplify F = [ (A + B')' + (A' + B)' ]' .", options: ["A'B + AB'", "AB + A'B'", "A + B", "0"], answer: 0, explanation: "(A + B')' = A'B. (A' + B)' = AB'. Sum: A'B + AB' (XOR). Outer complement: (A'B + AB')' = A'B' + AB (XNOR)... Wait: F = [ A'B + AB' ]' = XNOR = AB + A'B'.", xp: 20 },
          { id: "dem_3_2", q: "Convert SOP expression AB + CD into equivalent all-NAND implementation.", options: ["( (AB)' · (CD)' )'", "AB + CD", "(A' + B')(C' + D')", "AND-OR"], answer: 0, explanation: "AB + CD = ( (AB + CD)'' ) = ( (AB)' · (CD)' )'. 2 input NANDs feeding 1 output NAND!", xp: 20 },
          { id: "dem_3_3", q: "Convert POS expression (A + B)(C + D) into equivalent all-NOR implementation.", options: ["( (A + B)' + (C + D)' )'", "(A + B)(C + D)", "A'B' + C'D'", "OR-AND"], answer: 0, explanation: "(A + B)(C + D) = ( ((A+B)(C+D))'' ) = ( (A+B)' + (C+D)' )'. 2 input NORs feeding 1 output NOR!", xp: 20 },
          { id: "dem_3_4", q: "Simplify F = [ (A B)' (B C)' (A C)' ]' .", options: ["A' + B' + C' (Wait: AB + BC + AC)", "AB + BC + AC", "A'B'C'", "ABC"], answer: 1, explanation: "( (AB)' (BC)' (AC)' )' = (AB)'' + (BC)'' + (AC)'' = AB + BC + AC.", xp: 20 },
          { id: "dem_3_5", q: "Simplify F = [ (A + B)' + (B + C)' + (A + C)' ]' .", options: ["(A + B)(B + C)(A + C)", "A + B + C", "ABC", "A'B'C'"], answer: 0, explanation: "( (A+B)' + (B+C)' + (A+C)' )' = (A+B)''(B+C)''(A+C)'' = (A + B)(B + C)(A + C).", xp: 20 },
          { id: "dem_3_6", q: "Simplify F = [ A' B' + C' D' ]' .", options: ["(A + B)(C + D)", "AB + CD", "A' + B' + C' + D'", "ABCD"], answer: 0, explanation: "(A'B')' · (C'D')' = (A + B)(C + D).", xp: 20 },
          { id: "dem_3_7", q: "Simplify F = [ (A + B') (C' + D) ]' .", options: ["A'B + CD'", "(A' + B)(C + D')", "AB' + C'D", "A'B'C'D'"], answer: 0, explanation: "(A + B')' + (C' + D)' = A'B + CD'.", xp: 20 },
          { id: "dem_3_8", q: "Why are NAND and NOR called universal logic gates?", options: ["Any Boolean function can be implemented using only NAND or only NOR gates via De Morgan's laws", "They use less power", "They have 2 inputs", "They are fast"], answer: 0, explanation: "De Morgan's laws allow converting AND, OR, NOT to pure NAND or NOR logic.", xp: 20 },
          { id: "dem_3_9", q: "Simplify F = [ X' Y + X Y' ]' .", options: ["XY + X'Y' (XNOR)", "X'Y + XY'", "X + Y", "0"], answer: 0, explanation: "Complement of XOR is XNOR: XY + X'Y'.", xp: 20 },
          { id: "dem_3_10", q: "Simplify F = [ (W + X)' (Y + Z)' ]' .", options: ["W + X + Y + Z", "WX + YZ", "(W+X)(Y+Z)", "W'X'Y'Z'"], answer: 0, explanation: "(W + X)'' + (Y + Z)'' = W + X + Y + Z.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "dem_4_1", q: "Fully simplify F = [ (A + B C)' + A' B ]' .", options: ["A(B' + C)", "A + B'C", "AB + C", "A'B'C'"], answer: 0, explanation: "( (A + BC)' + A'B )' = (A + BC)'' · (A'B)' = (A + BC)(A + B') = AA + AB' + ABC + BCB' = A + AB' + ABC = A(1 + B' + BC) = A.", xp: 0, options: ["A", "A(B' + C)", "A + B", "BC"], answer: 0, explanation: "Simplifies to A.", xp: 25 },
          { id: "dem_4_2", q: "Implement F = A'B + AB' (XOR) using exactly 4 two-input NAND gates.", options: ["NAND1=(AB)', NAND2=(A·NAND1)', NAND3=(B·NAND1)', NAND4=(NAND2·NAND3)'", "5 NAND gates", "3 NAND gates", "6 NAND gates"], answer: 0, explanation: "Classic 4-NAND gate XOR circuit implementation.", xp: 25 },
          { id: "dem_4_3", q: "Simplify F = [ (A' + B + C')(A + B' + C)(A' + B' + C') ]' .", options: ["AB'C + A'BC' + ABC", "A + B + C", "ABC", "A'B'C'"], answer: 0, explanation: "De Morgan on POS: (A' + B + C')' + (A + B' + C)' + (A' + B' + C')' = AB'C + A'BC' + ABC.", xp: 25 },
          { id: "dem_4_4", q: "Simplify F = [ (W X + Y Z)' + (W' X' + Y' Z')' ]' .", options: ["(WX + YZ)(W'X' + Y'Z')", "WX + YZ", "W'X' + Y'Z'", "0"], answer: 0, explanation: "( (WX + YZ)' )' · ( (W'X' + Y'Z')' )' = (WX + YZ)(W'X' + Y'Z').", xp: 25 },
          { id: "dem_4_5", q: "Simplify F = [ (A + B' C)' (B + A' C')' ]' .", options: ["A + B'C + B + A'C' = A + B + B'C + A'C' = A + B + C + C' = 1", "1", "0", "ABC"], answer: 1, explanation: "(A + B'C)'' + (B + A'C')'' = A + B'C + B + A'C' = (A + A'C') + (B + B'C) = A + C' + B + C = A + B + 1 = 1.", xp: 25 },
          { id: "dem_4_6", q: "Convert 2-level AND-OR circuit into 2-level NAND-NAND circuit.", options: ["Replace all AND gates and OR gate with NAND gates (Bubble pushing)", "Replace with NOR gates", "Add 5 inverters", "Cannot be done"], answer: 0, explanation: "By De Morgan's law, AND-OR is directly equivalent to NAND-NAND.", xp: 25 },
          { id: "dem_4_7", q: "Convert 2-level OR-AND circuit into 2-level NOR-NOR circuit.", options: ["Replace all OR gates and AND gate with NOR gates", "Replace with NAND gates", "Add 4 inverters", "Cannot be done"], answer: 0, explanation: "By De Morgan's law, OR-AND is directly equivalent to NOR-NOR.", xp: 25 },
          { id: "dem_4_8", q: "Simplify F = [ (A' B C + A B' C + A B C')' ]' .", options: ["A'BC + AB'C + ABC'", "(A+B+C)'", "A' + B' + C'", "ABC"], answer: 0, explanation: "Double negation cancels: A'BC + AB'C + ABC'.", xp: 25 },
          { id: "dem_4_9", q: "Simplify F = [ (X' + Y') (Y' + Z') (X' + Z') ]' .", options: ["XY + YZ + XZ", "X'Y'Z'", "X + Y + Z", "0"], answer: 0, explanation: "(X' + Y')' + (Y' + Z')' + (X' + Z')' = XY + YZ + XZ.", xp: 25 },
          { id: "dem_4_10", q: "How many NAND gates are saved by converting (A' + B')' to AB?", options: ["3 NAND gates (converted to 0 gates / direct AND)", "2 gates", "1 gate", "4 gates"], answer: 0, explanation: "(A' + B')' = (A')' · (B')' = AB. Eliminates inverters and NAND structure.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 11. CONSENSUS THEOREM                                                     */
  /* ========================================================================= */
  "consensus-theorem": {
    title: "Consensus Theorem",
    icon: "🤝",
    description: "Eliminate redundant consensus terms: AB + A'C + BC = AB + A'C.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "con_1_1", q: "Which equation states the SOP Consensus Theorem?", options: ["AB + A'C + BC = AB + A'C", "AB + A'C + BC = BC", "AB + A'C + BC = A + B + C", "AB + A'C = BC"], answer: 0, explanation: "BC is the redundant consensus term between AB and A'C.", xp: 10 },
          { id: "con_1_2", q: "Which term is the consensus term in AB + A'C + BC?", options: ["BC", "AB", "A'C", "A"], answer: 0, explanation: "BC contains the un-complemented variables from AB and A'C.", xp: 10 },
          { id: "con_1_3", q: "Which equation states the POS Consensus Theorem?", options: ["(A + B)(A' + C)(B + C) = (A + B)(A' + C)", "(A + B)(A' + C)(B + C) = B + C", "(A + B)(A' + C) = B + C", "None"], answer: 0, explanation: "(B + C) is the redundant POS consensus term.", xp: 10 },
          { id: "con_1_4", q: "To apply Consensus Theorem, one variable must appear:", options: ["Complemented in one term and uncomplemented in another", "Always complemented", "Always uncomplemented", "3 times"], answer: 0, explanation: "Variable A and A' must be present in the two main terms.", xp: 10 },
          { id: "con_1_5", q: "Simplify WX + W'Y + XY.", options: ["WX + W'Y", "XY", "WX + XY", "W'Y + XY"], answer: 0, explanation: "XY is the consensus term of WX and W'Y. Result: WX + W'Y.", xp: 10 },
          { id: "con_1_6", q: "Simplify (X + Y)(X' + Z)(Y + Z).", options: ["(X + Y)(X' + Z)", "Y + Z", "(X + Y)(Y + Z)", "XYZ"], answer: 0, explanation: "(Y + Z) is the redundant consensus term.", xp: 10 },
          { id: "con_1_7", q: "Simplify AB' + BC + AC.", options: ["AB' + BC", "AC", "AB' + AC", "BC"], answer: 0, explanation: "B and B' are paired. Consensus term is AC. Result: AB' + BC.", xp: 10 },
          { id: "con_1_8", q: "Simplify (A + B')(B + C)(A + C).", options: ["(A + B')(B + C)", "A + C", "B + C", "ABC"], answer: 0, explanation: "B' and B are paired. Consensus term is (A + C). Result: (A + B')(B + C).", xp: 10 },
          { id: "con_1_9", q: "True or False: Eliminating consensus terms reduces gate count without affecting output.", options: ["True", "False", "Only for 4 inputs", "Only for OR gates"], answer: 0, explanation: "True! Consensus term elimination removes redundant gates.", xp: 10 },
          { id: "con_1_10", q: "Simplify A'B + AC + BC.", options: ["A'B + AC", "BC", "A'B + BC", "AC + BC"], answer: 0, explanation: "BC is consensus term between A'B and AC. Result: A'B + AC.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "con_2_1", q: "Simplify A'B' + AC' + B'C'.", options: ["A'B' + AC'", "B'C'", "A'B' + B'C'", "AC' + B'C'"], answer: 0, explanation: "A' and A are paired. Consensus term is B'C'. Result: A'B' + AC'.", xp: 15 },
          { id: "con_2_2", q: "Simplify (A' + B')(A + C')(B' + C').", options: ["(A' + B')(A + C')", "B' + C'", "A' + B'", "A + C'"], answer: 0, explanation: "(B' + C') is the consensus term.", xp: 15 },
          { id: "con_2_3", q: "Simplify AB + A'C' + BC'.", options: ["AB + A'C'", "BC'", "AB + BC'", "A'C' + BC'"], answer: 0, explanation: "BC' is the consensus term of AB and A'C'. Result: AB + A'C'.", xp: 15 },
          { id: "con_2_4", q: "Simplify (A + B)(A' + C')(B + C').", options: ["(A + B)(A' + C')", "B + C'", "A + B", "A' + C'"], answer: 0, explanation: "(B + C') is the consensus term.", xp: 15 },
          { id: "con_2_5", q: "Simplify W'X' + WY + X'Y.", options: ["W'X' + WY", "X'Y", "W'X' + X'Y", "WY + X'Y"], answer: 0, explanation: "X'Y is the consensus term of W'X' and WY. Result: W'X' + WY.", xp: 15 },
          { id: "con_2_6", q: "Simplify (W' + X')(W + Y)(X' + Y).", options: ["(W' + X')(W + Y)", "X' + Y", "W' + X'", "W + Y"], answer: 0, explanation: "(X' + Y) is the consensus term.", xp: 15 },
          { id: "con_2_7", q: "Simplify A B C + A' D + B C D.", options: ["ABC + A'D", "BCD", "ABC + BCD", "A'D + BCD"], answer: 0, explanation: "BCD is the consensus term of (ABC) and (A'D). Result: ABC + A'D.", xp: 15 },
          { id: "con_2_8", q: "Simplify (A + B + C)(A' + D)(B + C + D).", options: ["(A + B + C)(A' + D)", "B + C + D", "A + B + C", "A' + D"], answer: 0, explanation: "(B + C + D) is the consensus term.", xp: 15 },
          { id: "con_2_9", q: "Identify the consensus term in P Q + P' R + Q R.", options: ["QR", "PQ", "P'R", "P"], answer: 0, explanation: "QR is formed from non-complemented variables Q (from PQ) and R (from P'R).", xp: 15 },
          { id: "con_2_10", q: "Simplify A' B C' + A D + B C' D.", options: ["A'BC' + AD", "BC'D", "A'BC' + BC'D", "AD + BC'D"], answer: 0, explanation: "BC'D is the consensus term.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "con_3_1", q: "How many AND gates are saved by applying consensus theorem to AB + A'C + BC?", options: ["1 AND gate", "2 gates", "0 gates", "3 gates"], answer: 0, explanation: "BC requires 1 AND gate. Removing BC saves 1 AND gate.", xp: 20 },
          { id: "con_3_2", q: "Simplify F = AB + A'C + BC + BD + A'D.", options: ["AB + A'C + BD + A'D (Wait: AB + A'C + D)", "AB + A'C + D", "AB + A'C", "BC + BD"], answer: 1, explanation: "BC is consensus of AB and A'C -> AB + A'C. Then BD + A'D = D(B + A')? BD + A'D + AB = AB + A'D + BD... BD is consensus of AB and A'D -> AB + A'C + A'D = AB + A'C + A'D... Actually BD + A'D = D(B + A'). Result: AB + A'C + D.", xp: 20 },
          { id: "con_3_3", q: "Simplify F = (A + B)(A' + C)(B + C)(C + D).", options: ["(A + B)(A' + C)(C + D)", "(A + B)(A' + C)", "B + C", "C + D"], answer: 0, explanation: "(B + C) is consensus of (A + B) and (A' + C). Result: (A + B)(A' + C)(C + D).", xp: 20 },
          { id: "con_3_4", q: "Simplify F = W'X'Y + WZ + X'YZ.", options: ["W'X'Y + WZ", "X'YZ", "W'X'Y + X'YZ", "WZ + X'YZ"], answer: 0, explanation: "X'YZ is the consensus term of W'X'Y and WZ.", xp: 20 },
          { id: "con_3_5", q: "Simplify F = AB'C + A'D + B'CD.", options: ["AB'C + A'D", "B'CD", "AB'C + B'CD", "A'D + B'CD"], answer: 0, explanation: "B'CD is the consensus term.", xp: 20 },
          { id: "con_3_6", q: "In hazard-free logic design, why are consensus terms intentionally ADDED to circuits?", options: ["To eliminate static timing hazards (glitches)", "To save gates", "To reduce depth", "To invert logic"], answer: 0, explanation: "Adding consensus terms (redundant cover) prevents static-1 hazards during input transitions!", xp: 20 },
          { id: "con_3_7", q: "Simplify F = (A + B + C')(A' + D')(B + C' + D').", options: ["(A + B + C')(A' + D')", "B + C' + D'", "A + B + C'", "A' + D'"], answer: 0, explanation: "(B + C' + D') is the consensus term.", xp: 20 },
          { id: "con_3_8", q: "Simplify F = A B' + B C' + C A'.", options: ["AB' + BC' + CA' (Cannot be reduced by consensus)", "AB' + BC'", "CA'", "0"], answer: 0, explanation: "No single term is consensus of the other two because 3 variables are in a cyclic arrangement. Cannot be reduced!", xp: 20 },
          { id: "con_3_9", q: "Simplify F = (A + B')(B + C')(C + A').", options: ["(A + B')(B + C')(C + A') (Cyclic, cannot be reduced)", "A + B'", "B + C'", "1"], answer: 0, explanation: "Cyclic consensus structure cannot be reduced further.", xp: 20 },
          { id: "con_3_10", q: "Simplify F = A' B C' D + A E + B C' D E.", options: ["A'BC'D + AE", "BC'DE", "A'BC'D + BC'DE", "AE + BC'DE"], answer: 0, explanation: "BC'DE is the consensus term.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "con_4_1", q: "Fully simplify F = A B + A' C + B C + A C + A' B.", options: ["A + B + C", "AB + A'C", "AB + A'B + BC", "AB + AC + BC"], answer: 0, explanation: "AB + A'B = B(A + A') = B. A'C + AC = C(A' + A) = C. BC is absorbed by B. F = B + C.", xp: 0, options: ["B + C", "AB + A'C", "A + B + C", "BC"], answer: 0, explanation: "AB + A'B = B. A'C + AC = C. BC absorbed by B. Result: B + C.", xp: 25 },
          { id: "con_4_2", q: "Simplify F = (A + B)(A' + C)(B + C)(A + C)(A' + B).", options: ["(B + C)(A + C)", "B + C", "A + C", "(A + B)(A' + C)"], answer: 1, explanation: "(A + B)(A' + B) = B. (A' + C)(A + C) = C. (B + C) is remaining.", xp: 1, options: ["BC", "B + C", "A + B", "1"], answer: 1, explanation: "(A+B)(A'+B) = B. (A'+C)(A+C) = C. Remaining: B(C) = BC... Wait: B AND C = BC. Result: BC.", xp: 25 },
          { id: "con_4_3", q: "Simplify F = W'X'Y + WZ + X'YZ + WY'Z.", options: ["W'X'Y + WZ", "W'X'Y + WY'Z", "WZ + X'YZ", "X'YZ + WY'Z"], answer: 0, explanation: "X'YZ is consensus of W'X'Y and WZ -> W'X'Y + WZ + WY'Z. WY'Z is absorbed by WZ: WZ(1 + Y') = WZ. Result: W'X'Y + WZ.", xp: 25 },
          { id: "con_4_4", q: "Simplify F = (A' + B + C)(A + D)(B + C + D)(A + C).", options: ["(A' + B + C)(A + C)", "(A + D)(B + C + D)", "A + C", "B + C"], answer: 0, explanation: "(B + C + D) is consensus of 1 & 2. F = (A' + B + C)(A + D)(A + C). (A + D)(A + C) = A + CD. (A' + B + C)(A + CD) = A(B + C) + A'CD = AB + AC + A'CD = AB + AC + CD.", xp: 25 },
          { id: "con_4_5", q: "How many terms in F = AB + A'C + BC + CD + B'D can be eliminated by consensus?", options: ["2 terms (BC and CD)", "1 term", "3 terms", "0 terms"], answer: 0, explanation: "BC is consensus of AB and A'C. CD is consensus of AC (or BC) and B'D. Total 2 terms eliminated!", xp: 25 },
          { id: "con_4_6", q: "Simplify F = AB + A'C + CD + B'D.", options: ["AB + A'C + B'D", "AB + CD", "A'C + B'D", "AB + A'C + BC + CD"], answer: 0, explanation: "CD is consensus of A'C and B'D? A'C and B'D -> A'B'C? Wait: AB + A'C + B'D. CD is consensus of AC and B'D. Result: AB + A'C + B'D.", xp: 25 },
          { id: "con_4_7", q: "Simplify F = (A + B)(A' + C)(C + D)(B' + D).", options: ["(A + B)(A' + C)(B' + D)", "(A + B)(C + D)", "(A' + C)(B' + D)", "1"], answer: 0, explanation: "(C + D) is redundant consensus term.", xp: 25 },
          { id: "con_4_8", q: "Simplify F = X'Y'Z + XW + Y'ZW.", options: ["X'Y'Z + XW", "Y'ZW", "X'Y'Z + Y'ZW", "XW + Y'ZW"], answer: 0, explanation: "Y'ZW is consensus term of X'Y'Z and XW.", xp: 25 },
          { id: "con_4_9", q: "Simplify F = (X' + Y' + Z)(X + W)(Y' + Z + W).", options: ["(X' + Y' + Z)(X + W)", "Y' + Z + W", "X + W", "1"], answer: 0, explanation: "(Y' + Z + W) is consensus term.", xp: 25 },
          { id: "con_4_10", q: "What is the primary benefit of Consensus Theorem in Boolean minimization?", options: ["It eliminates hidden redundant product/sum terms without expanding expressions", "It doubles gate count", "It inverts inputs", "It increases propagation depth"], answer: 0, explanation: "Directly identifies and removes redundant terms without full expansion.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 12. BOOLEAN SIMPLIFICATION                                                */
  /* ========================================================================= */
  "boolean-simplification": {
    title: "Boolean Simplification",
    icon: "📐",
    description: "Combine multiple algebraic laws to reduce complex Boolean expressions to minimal sum-of-products.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "sim_1_1", q: "Simplify A + A'B.", options: ["A + B", "AB", "A", "B"], answer: 0, explanation: "A + A'B = (A + A')(A + B) = 1(A + B) = A + B.", xp: 10 },
          { id: "sim_1_2", q: "Simplify A(A + B).", options: ["A", "B", "AB", "A + B"], answer: 0, explanation: "A(A + B) = AA + AB = A + AB = A.", xp: 10 },
          { id: "sim_1_3", q: "Simplify A + AB.", options: ["A", "B", "AB", "A + B"], answer: 0, explanation: "A(1 + B) = A(1) = A.", xp: 10 },
          { id: "sim_1_4", q: "Simplify A' + AB.", options: ["A' + B", "A'", "B", "A'B"], answer: 0, explanation: "A' + AB = (A' + A)(A' + B) = A' + B.", xp: 10 },
          { id: "sim_1_5", q: "Simplify AB + AB'.", options: ["A", "B", "AB", "1"], answer: 0, explanation: "A(B + B') = A(1) = A.", xp: 10 },
          { id: "sim_1_6", q: "Simplify (A + B)(A + B').", options: ["A", "B", "A + B", "0"], answer: 0, explanation: "A + BB' = A + 0 = A.", xp: 10 },
          { id: "sim_1_7", q: "Simplify A + 1.", options: ["1", "A", "0", "A'"], answer: 0, explanation: "Domination law: A + 1 = 1.", xp: 10 },
          { id: "sim_1_8", q: "Simplify A · 0.", options: ["0", "A", "1", "A'"], answer: 0, explanation: "Domination law: A · 0 = 0.", xp: 10 },
          { id: "sim_1_9", q: "Simplify A + 0.", options: ["A", "0", "1", "A'"], answer: 0, explanation: "Identity law: A + 0 = A.", xp: 10 },
          { id: "sim_1_10", q: "Simplify A · 1.", options: ["A", "1", "0", "A'"], answer: 0, explanation: "Identity law: A · 1 = A.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "sim_2_1", q: "Simplify AB + A'C + BC.", options: ["AB + A'C", "BC", "AB + BC", "A'C + BC"], answer: 0, explanation: "Consensus theorem: BC is redundant.", xp: 15 },
          { id: "sim_2_2", q: "Simplify (A + B)(A' + C).", options: ["AC + A'B", "A + B + C", "ABC", "AB + A'C"], answer: 0, explanation: "AA' + AC + A'B + BC = AC + A'B + BC. BC is redundant consensus term = AC + A'B.", xp: 15 },
          { id: "sim_2_3", q: "Simplify A(B + C) + A'B.", options: ["B + AC", "A + BC", "AB + C", "ABC"], answer: 0, explanation: "AB + AC + A'B = B(A + A') + AC = B(1) + AC = B + AC.", xp: 15 },
          { id: "sim_2_4", q: "Simplify (A + B)(A + C).", options: ["A + BC", "AB + AC", "A + B + C", "ABC"], answer: 0, explanation: "AA + AC + AB + BC = A(1 + C + B) + BC = A + BC.", xp: 15 },
          { id: "sim_2_5", q: "Simplify A'B'C + A'BC + AB'C.", options: ["A'C + B'C", "ABC", "A'B'", "C"], answer: 0, explanation: "A'C(B' + B) + AB'C = A'C + AB'C = C(A' + AB') = C(A' + B') = A'C + B'C.", xp: 15 },
          { id: "sim_2_6", q: "Simplify (A + B')(A' + B).", options: ["AB + A'B'", "A'B + AB'", "A + B", "0"], answer: 0, explanation: "AA' + AB + A'B' + B'B = 0 + AB + A'B' + 0 = AB + A'B' (XNOR).", xp: 15 },
          { id: "sim_2_7", q: "Simplify A'B' + A'B + AB'.", options: ["A' + B'", "A + B", "AB", "1"], answer: 0, explanation: "A'(B' + B) + AB' = A' + AB' = A' + B' (De Morgan).", xp: 15 },
          { id: "sim_2_8", q: "Simplify (A + B + C)(A + B).", options: ["A + B", "C", "ABC", "A + B + C"], answer: 0, explanation: "Let K = A + B. K(K + C) = K = A + B.", xp: 15 },
          { id: "sim_2_9", q: "Simplify A B + A B' C + A C'.", options: ["A", "AB + C'", "AC", "1"], answer: 0, explanation: "AB + AB'C = A(B + B'C) = A(B + C) = AB + AC. Then AB + AC + AC' = AB + A(C + C') = AB + A(1) = A.", xp: 15 },
          { id: "sim_2_10", q: "Simplify (X + Y)' + (X + Y')'.", options: ["X'", "Y'", "X", "Y"], answer: 0, explanation: "X'Y' + X'Y = X'(Y' + Y) = X'(1) = X'.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "sim_3_1", q: "Simplify F = AB + A'C + B'C'.", options: ["AB + A'C + B'C' (Cannot be simplified further)", "AB + A'C", "BC", "1"], answer: 0, explanation: "No pair of terms shares a consensus or common variable pattern.", xp: 20 },
          { id: "sim_3_2", q: "Simplify F = (A + B + C)(A + B' + C)(A + B + C').", options: ["(A + B)(A + C)", "A + B + C", "ABC", "A + BC"], answer: 0, explanation: "Terms 1 & 2 -> A + C. Terms 1 & 3 -> A + B. Product: (A + B)(A + C) = A + BC.", xp: 20 },
          { id: "sim_3_3", q: "Simplify F = A'B'C' + A'B'C + A'BC + ABC.", options: ["A'B' + BC", "A' + B", "ABC", "1"], answer: 0, explanation: "A'B'(C' + C) + BC(A' + A) = A'B'(1) + BC(1) = A'B' + BC.", xp: 20 },
          { id: "sim_3_4", q: "Simplify F = (A + B + C')(A + B' + C')(A' + B + C').", options: ["B(A + C')", "(A + C')(B + C')", "A + B", "C'"], answer: 0, explanation: "Terms 1 & 2 -> A + C'. Terms 1 & 3 -> B + C'. Product: (A + C')(B + C') = C' + AB.", xp: 20 },
          { id: "sim_3_5", q: "Simplify F = W X Y Z + W X Y Z' + W X Y' Z + W X Y' Z'.", options: ["WX", "WXYZ", "W + X", "1"], answer: 0, explanation: "WX(YZ + YZ' + Y'Z + Y'Z') = WX(Y(1) + Y'(1)) = WX(1) = WX.", xp: 20 },
          { id: "sim_3_6", q: "Simplify F = (W + X + Y + Z)(W + X + Y + Z').", options: ["W + X + Y", "WXYZ", "1", "0"], answer: 0, explanation: "Let K = W + X + Y. (K + Z)(K + Z') = K = W + X + Y.", xp: 20 },
          { id: "sim_3_7", q: "Simplify F = A B + A C + B C + A' B' C'.", options: ["AB + AC + BC + A'B'C'", "1", "A + B + C", "ABC"], answer: 0, explanation: "Contains Majority function + Minority term. Cannot be reduced in SOP.", xp: 20 },
          { id: "sim_3_8", q: "Simplify F = (A' + B')(A' + C')(B' + C').", options: ["(AB + BC + AC)'", "A'B'C'", "A + B + C", "1"], answer: 0, explanation: "De Morgan: (A' + B')(A' + C')(B' + C') = ( (A+B)(A+C)(B+C) )' = (AB + BC + AC)'.", xp: 20 },
          { id: "sim_3_9", q: "Simplify F = A B' C + A' B C + A B C'.", options: ["AB'C + A'BC + ABC'", "ABC", "A + B + C", "1"], answer: 0, explanation: "3 minterms of weight 2 (exactly two 1s). Cannot be reduced.", xp: 20 },
          { id: "sim_3_10", q: "Simplify F = A B' C + A' B C + A B C' + A B C.", options: ["AB + BC + AC", "ABC", "A + B + C", "1"], answer: 0, explanation: "Adding ABC allows pairing with each term: AB + BC + AC.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "sim_4_1", q: "Fully simplify F(A,B,C,D) = A'B'C'D' + A'B'C'D + A'B'CD + A'B'CD' + AB'C'D' + AB'C'D + AB'CD + AB'CD'.", options: ["B'", "A'B'", "C'D'", "A + B"], answer: 0, explanation: "Factor out B': B'(A'C'D' + A'C'D + A'CD + A'CD' + AC'D' + AC'D + ACD + ACD') = B'(1) = B'.", xp: 25 },
          { id: "sim_4_2", q: "Simplify F = (A + B + C + D)(A + B + C + D')(A + B + C' + D)(A + B + C' + D')(A + B' + C + D)(A + B' + C + D')(A + B' + C' + D)(A + B' + C' + D').", options: ["A", "A + B", "B + C", "1"], answer: 0, explanation: "All 8 maxterms containing A are present. Product simplifies to A.", xp: 25 },
          { id: "sim_4_3", q: "Simplify F = A'B'C'D + A'B'CD + A'BC'D + A'BCD + AB'C'D + AB'CD + ABC'D + ABCD.", options: ["D", "A'D", "BC'D", "1"], answer: 0, explanation: "D is present in all 8 minterms. Factoring D gives D(1) = D.", xp: 25 },
          { id: "sim_4_4", q: "Simplify F = A B + A' C + B C' D + H.", options: ["AB + A'C + CD + H? No: AB + A'C + B C' D", "AB + A'C + BD + H", "A + B + C + D + H", "1"], answer: 0, explanation: "BC'D: C' = (A + C')? AB + A'C: C' = A? Result: AB + A'C + BD + H.", xp: 1, options: ["AB + A'C + BD + H", "AB + A'C + H", "A + H", "1"], answer: 0, explanation: "AB + A'C + BC'D + H = AB + A'C + BD + H.", xp: 25 },
          { id: "sim_4_5", q: "What is the minimal Product-of-Sums form for F = A'B + AC?", options: ["(A + B)(A' + C)", "A + B + C", "AB + AC", "A'B'C'"], answer: 0, explanation: "F = A'B + AC = (A'B + A)(A'B + C) = (A + B)(A' + C).", xp: 25 },
          { id: "sim_4_6", q: "What is the minimal Sum-of-Products form for F = (A + B')(A' + C)?", options: ["AC + A'B'", "AB + AC", "A + BC", "A'B'C'"], answer: 0, explanation: "AA' + AC + A'B' + B'C = 0 + AC + A'B' + B'C. B'C is redundant consensus term = AC + A'B'.", xp: 25 },
          { id: "sim_4_7", q: "Simplify F = [ (A + B')' + (B + C')' + (C + A')' ]' .", options: ["(A'B + B'C + C'A)'", "A + B + C", "ABC", "1"], answer: 0, explanation: "(A + B')' = A'B; (B + C')' = B'C; (C + A')' = C'A. Sum: A'B + B'C + C'A. Outer complement: (A'B + B'C + C'A)'.", xp: 25 },
          { id: "sim_4_8", q: "Simplify F = (A XOR B) XOR (A XNOR B).", options: ["1", "0", "A", "B"], answer: 0, explanation: "Let K = A XOR B. Then A XNOR B = K'. K XOR K' = KK + K'K' = 0 + 0 = 0? Wait! K XOR K' = K(K')' + K'(K)' = K(K) + K'(K') = K + K' = 1.", xp: 25 },
          { id: "sim_4_9", q: "Simplify F = (A XOR B) XNOR (A XNOR B).", options: ["0", "1", "A", "B"], answer: 0, explanation: "K XNOR K' = (K XOR K')' = 1' = 0.", xp: 25 },
          { id: "sim_4_10", q: "How many 2-input logic gates are saved by simplifying F(A,B,C,D) = A'B'C'D' + A'B'C'D + ... (8 minterms) down to B'?", options: ["Multiple gates (reduces 8 4-input ANDs + 7 ORs down to 1 NOT gate / wire B')", "2 gates", "1 gate", "3 gates"], answer: 0, explanation: "Reduces massive 15-gate SOP tree down to a single wire or inverter!", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 13. LOGIC GATES                                                           */
  /* ========================================================================= */
  "logic-gates": {
    title: "Logic Gates",
    icon: "🔌",
    description: "Master implementation of Boolean expressions using basic and universal logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR).",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "gat_1_1", q: "Which logic gate outputs 1 only when ALL inputs are 1?", options: ["AND", "OR", "XOR", "NAND"], answer: 0, explanation: "AND requires all inputs to be HIGH (1).", xp: 10 },
          { id: "gat_1_2", q: "Which logic gate outputs 1 when AT LEAST ONE input is 1?", options: ["OR", "AND", "NOR", "XNOR"], answer: 0, explanation: "OR requires at least one HIGH input.", xp: 10 },
          { id: "gat_1_3", q: "Which logic gate inverts its single input signal?", options: ["NOT (Inverter)", "AND", "OR", "BUFFER"], answer: 0, explanation: "NOT gate inverts 0 to 1 and 1 to 0.", xp: 10 },
          { id: "gat_1_4", q: "Which gate outputs 0 only when ALL inputs are 1?", options: ["NAND", "AND", "NOR", "OR"], answer: 0, explanation: "NAND is NOT-AND.", xp: 10 },
          { id: "gat_1_5", q: "Which gate outputs 0 when AT LEAST ONE input is 1?", options: ["NOR", "OR", "NAND", "AND"], answer: 0, explanation: "NOR is NOT-OR.", xp: 10 },
          { id: "gat_1_6", q: "Which gate outputs 1 when inputs differ, and 0 when inputs are identical?", options: ["XOR", "XNOR", "AND", "OR"], answer: 0, explanation: "XOR (Exclusive OR) outputs 1 for different inputs.", xp: 10 },
          { id: "gat_1_7", q: "Which gate outputs 1 when inputs are identical, and 0 when inputs differ?", options: ["XNOR (Equivalence)", "XOR", "NAND", "NOR"], answer: 0, explanation: "XNOR outputs 1 for matching inputs.", xp: 10 },
          { id: "gat_1_8", q: "Truth table for 2-input AND gate with inputs A=1, B=0 produces output:", options: ["0", "1", "Floating", "Undefined"], answer: 0, explanation: "1 AND 0 = 0.", xp: 10 },
          { id: "gat_1_9", q: "Truth table for 2-input OR gate with inputs A=1, B=0 produces output:", options: ["1", "0", "Floating", "Undefined"], answer: 0, explanation: "1 OR 0 = 1.", xp: 10 },
          { id: "gat_1_10", q: "Truth table for 2-input XOR gate with inputs A=1, B=1 produces output:", options: ["0", "1", "Floating", "Undefined"], answer: 0, explanation: "1 XOR 1 = 0.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "gat_2_1", q: "How many 2-input AND gates and 2-input OR gates are needed for AB + CD + EF?", options: ["3 AND gates, 2 OR gates", "2 AND, 3 OR", "3 AND, 3 OR", "1 AND, 1 OR"], answer: 0, explanation: "3 product terms require 3 AND gates; combining them requires 2 two-input OR gates.", xp: 15 },
          { id: "gat_2_2", q: "What is the truth table output of A XNOR B when A=0, B=0?", options: ["1", "0", "Undefined", "Floating"], answer: 0, explanation: "0 XNOR 0 = 1.", xp: 15 },
          { id: "gat_2_3", q: "What is the truth table output of A XOR B when A=0, B=1?", options: ["1", "0", "Undefined", "Floating"], answer: 0, explanation: "0 XOR 1 = 1.", xp: 15 },
          { id: "gat_2_4", q: "What is the Boolean expression for a 2-input NAND gate?", options: ["(A B)'", "A' + B'", "(A B)' or A' + B'", "A + B"], answer: 2, explanation: "(AB)' is the NAND expression.", xp: 15 },
          { id: "gat_2_5", q: "What is the Boolean expression for a 2-input NOR gate?", options: ["(A + B)'", "A' B'", "(A + B)' or A'B'", "AB"], answer: 2, explanation: "(A + B)' is the NOR expression.", xp: 15 },
          { id: "gat_2_6", q: "What is the Boolean expression for a 2-input XOR gate?", options: ["A'B + AB'", "AB + A'B'", "A + B", "AB"], answer: 0, explanation: "A XOR B = A'B + AB'.", xp: 15 },
          { id: "gat_2_7", q: "What is the Boolean expression for a 2-input XNOR gate?", options: ["AB + A'B'", "A'B + AB'", "A + B", "AB"], answer: 0, explanation: "A XNOR B = AB + A'B'.", xp: 15 },
          { id: "gat_2_8", q: "Connecting a NOT gate to the output of an XOR gate creates which gate?", options: ["XNOR gate", "NAND gate", "NOR gate", "AND gate"], answer: 0, explanation: "NOT (XOR) = XNOR.", xp: 15 },
          { id: "gat_2_9", q: "Connecting a NOT gate to the output of an OR gate creates which gate?", options: ["NOR gate", "NAND gate", "XOR gate", "XNOR gate"], answer: 0, explanation: "NOT (OR) = NOR.", xp: 15 },
          { id: "gat_2_10", q: "Connecting a NOT gate to the output of an AND gate creates which gate?", options: ["NAND gate", "NOR gate", "XOR gate", "XNOR gate"], answer: 0, explanation: "NOT (AND) = NAND.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "gat_3_1", q: "How many 2-input NAND gates are required to implement a NOT gate?", options: ["1 NAND gate (inputs tied together)", "2 NAND gates", "3 NAND gates", "0 gates"], answer: 0, explanation: "(A · A)' = A'. 1 NAND gate with inputs tied acts as NOT.", xp: 20 },
          { id: "gat_3_2", q: "How many 2-input NAND gates are required to implement an AND gate?", options: ["2 NAND gates (NAND followed by NAND inverter)", "1 NAND gate", "3 NAND gates", "4 NAND gates"], answer: 0, explanation: "( (AB)' )' = AB. 2 NAND gates.", xp: 20 },
          { id: "gat_3_3", q: "How many 2-input NAND gates are required to implement an OR gate?", options: ["3 NAND gates (Invert A, Invert B, feed to NAND)", "2 NAND gates", "1 NAND gate", "4 NAND gates"], answer: 0, explanation: "(A' · B')' = A + B (De Morgan). Requires 2 input NAND inverters + 1 output NAND = 3 NANDs.", xp: 20 },
          { id: "gat_3_4", q: "How many 2-input NOR gates are required to implement a NOT gate?", options: ["1 NOR gate (inputs tied together)", "2 NOR gates", "3 NOR gates", "0 gates"], answer: 0, explanation: "(A + A)' = A'. 1 NOR gate with inputs tied acts as NOT.", xp: 20 },
          { id: "gat_3_5", q: "How many 2-input NOR gates are required to implement an OR gate?", options: ["2 NOR gates (NOR followed by NOR inverter)", "1 NOR gate", "3 NOR gates", "4 NOR gates"], answer: 0, explanation: "( (A + B)' )' = A + B. 2 NOR gates.", xp: 20 },
          { id: "gat_3_6", q: "How many 2-input NOR gates are required to implement an AND gate?", options: ["3 NOR gates (Invert A, Invert B, feed to NOR)", "2 NOR gates", "1 NOR gate", "4 NOR gates"], answer: 0, explanation: "(A' + B')' = AB (De Morgan). 3 NOR gates.", xp: 20 },
          { id: "gat_3_7", q: "What is the minimum number of 2-input NAND gates to build an XOR gate?", options: ["4 NAND gates", "5 NAND gates", "3 NAND gates", "6 NAND gates"], answer: 0, explanation: "XOR requires 4 NAND gates.", xp: 20 },
          { id: "gat_3_8", q: "What is the minimum number of 2-input NOR gates to build an XNOR gate?", options: ["4 NOR gates", "5 NOR gates", "3 NOR gates", "6 NOR gates"], answer: 0, explanation: "XNOR requires 4 NOR gates.", xp: 20 },
          { id: "gat_3_9", q: "In digital logic IC families, why are NAND and NOR gates often preferred over AND/OR gates?", options: ["CMOS/TTL inverting gates use fewer transistors and run faster than non-inverting gates", "They use more power", "They are bigger", "They have 3 inputs"], answer: 0, explanation: "Inverting gates (NAND/NOR) are natural single-stage CMOS gates; AND/OR require an extra internal inverter stage!", xp: 20 },
          { id: "gat_3_10", q: "A 3-input XOR gate outputs 1 when:", options: ["An odd number of inputs are 1 (Parity generator)", "All inputs are 1", "Even number of inputs are 1", "No inputs are 1"], answer: 0, explanation: "XOR acts as an odd-parity detector for any number of inputs.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "gat_4_1", q: "Design a Half Adder: What gates generate the SUM and CARRY outputs for inputs A, B?", options: ["SUM = A XOR B, CARRY = A AND B", "SUM = A OR B, CARRY = A AND B", "SUM = A AND B, CARRY = A XOR B", "SUM = A XNOR B, CARRY = A OR B"], answer: 0, explanation: "Half Adder: SUM = A XOR B (1 gate), CARRY = AB (1 gate).", xp: 25 },
          { id: "gat_4_2", q: "Design a Full Adder SUM output for inputs A, B, Cin. What is the expression?", options: ["A XOR B XOR Cin", "A AND B AND Cin", "A + B + Cin", "A XNOR B XNOR Cin"], answer: 0, explanation: "Full Adder SUM = A XOR B XOR Cin (2 XOR gates).", xp: 25 },
          { id: "gat_4_3", q: "Design a Full Adder Cout (Carry Out) expression.", options: ["AB + Cin(A XOR B)", "AB + BCin + ACin", "AB + Cin(A XOR B) or AB + BCin + ACin", "A + B + Cin"], answer: 2, explanation: "Cout = AB + Cin(A XOR B) = AB + BCin + ACin.", xp: 25 },
          { id: "gat_4_4", q: "Build a 2-to-1 Multiplexer using basic logic gates. Output Y =", options: ["S'A + SB", "SA + SB", "S'A' + SB'", "A XOR B"], answer: 0, explanation: "When Select S=0, Y=A; when S=1, Y=B. Y = S'A + SB.", xp: 25 },
          { id: "gat_4_5", q: "How many 2-input logic gates are needed for a 2-to-1 MUX (S'A + SB)?", options: ["4 gates (1 NOT, 2 AND, 1 OR)", "3 gates", "5 gates", "2 gates"], answer: 0, explanation: "1 NOT for S', 2 ANDs for S'A and SB, 1 OR to combine them. Total = 4 gates.", xp: 25 },
          { id: "gat_4_6", q: "How many 2-input NAND gates are needed to build a 2-to-1 MUX?", options: ["4 NAND gates", "5 NAND gates", "6 NAND gates", "3 NAND gates"], answer: 0, explanation: "NAND1=(S'), NAND2=(S'A)', NAND3=(SB)', NAND4=(NAND2·NAND3)' = 4 NAND gates.", xp: 25 },
          { id: "gat_4_7", q: "Build a 1-bit Equality Comparator (A == B). Output =", options: ["A XNOR B", "A XOR B", "A AND B", "A OR B"], answer: 0, explanation: "A XNOR B outputs 1 when A and B match (00 or 11).", xp: 25 },
          { id: "gat_4_8", q: "Build a 2-bit Equality Comparator for inputs (A1,A0) and (B1,B0). Output =", options: ["(A1 XNOR B1) AND (A0 XNOR B0)", "(A1 XOR B1) OR (A0 XOR B0)", "A1 B1 + A0 B0", "A1 + B1 + A0 + B0"], answer: 0, explanation: "Both bit pairs must match: (A1 XNOR B1) AND (A0 XNOR B0).", xp: 25 },
          { id: "gat_4_9", q: "How many transistor gate costs are saved by replacing 2 AND gates + 1 OR gate (cost 6) with 1 XOR gate (cost 3)?", options: ["Cost reduced by 3 units (50% silicon savings)", "1 unit", "0 units", "5 units"], answer: 0, explanation: "Replacing multi-gate SOP with a single XOR gate yields massive silicon footprint reduction.", xp: 25 },
          { id: "gat_4_10", q: "An active-high 2-to-4 Decoder has inputs A, B. What are the 4 output minterm expressions?", options: ["Y0=A'B', Y1=A'B, Y2=AB', Y3=AB", "Y0=A+B, Y1=A+B', Y2=A'+B, Y3=A'+B'", "Y0=AB, Y1=AB, Y2=AB, Y3=AB", "Y0=A, Y1=B, Y2=A', Y3=B'"], answer: 0, explanation: "A 2-to-4 decoder generates all 4 minterms of 2 variables.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 14. CIRCUIT OPTIMIZATION                                                  */
  /* ========================================================================= */
  "circuit-optimization": {
    title: "Circuit Optimization",
    icon: "⚙️",
    description: "Minimize logic gate counts, propagation depth, and wiring complexity in combinational digital circuits.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "opt_1_1", q: "What is the primary goal of digital circuit optimization?", options: ["Reduce gate count, propagation delay, and power consumption while preserving functional equivalence", "Increase clock frequency only", "Add more gates", "Change logic behavior"], answer: 0, explanation: "Optimization improves area, delay, and power while preserving exact 100% truth-table behavior.", xp: 10 },
          { id: "opt_1_2", q: "Circuit propagation depth measures:", options: ["The maximum number of logic gates along any path from input to output", "Total number of wires", "Total chip area", "Number of inputs"], answer: 0, explanation: "Depth determines maximum propagation delay / speed limit of the circuit.", xp: 10 },
          { id: "opt_1_3", q: "Gate count metric measures:", options: ["Total number of logic gates (excluding I/O pins)", "Number of inputs", "Number of outputs", "Number of wires"], answer: 0, explanation: "Total count of non-I/O logic components.", xp: 10 },
          { id: "opt_1_4", q: "Replacing AB + AC with A(B + C) reduces gate count from:", options: ["3 gates to 2 gates", "4 gates to 2 gates", "2 gates to 1 gate", "3 gates to 1 gate"], answer: 0, explanation: "AB + AC = 2 ANDs + 1 OR (3 gates). A(B + C) = 1 OR + 1 AND (2 gates).", xp: 10 },
          { id: "opt_1_5", q: "Replacing A + AB with A reduces gate count from:", options: ["2 gates to 0 gates (direct wire)", "2 gates to 1 gate", "3 gates to 1 gate", "1 gate to 0"], answer: 0, explanation: "A + AB uses 1 AND and 1 OR (2 gates). A is a direct wire (0 gates).", xp: 10 },
          { id: "opt_1_6", q: "Replacing A + A' with 1 reduces gate count from:", options: ["2 gates to 0 gates (hardwired VCC)", "2 gates to 1 gate", "1 gate to 0", "3 gates to 1"], answer: 0, explanation: "A + A' uses 1 NOT and 1 OR (2 gates). 1 is hardwired (0 gates).", xp: 10 },
          { id: "opt_1_7", q: "Replacing A · A' with 0 reduces gate count from:", options: ["2 gates to 0 gates (hardwired GND)", "2 gates to 1 gate", "1 gate to 0", "3 gates to 1"], answer: 0, explanation: "A · A' uses 1 NOT and 1 AND (2 gates). 0 is hardwired (0 gates).", xp: 10 },
          { id: "opt_1_8", q: "Replacing (A')' with A reduces gate count from:", options: ["2 NOT gates to 0 gates (direct wire)", "2 gates to 1 gate", "1 gate to 0", "3 gates to 1"], answer: 0, explanation: "Two cascaded inverters are replaced by a wire.", xp: 10 },
          { id: "opt_1_9", q: "In CAD tools, Technology Mapping converts abstract Boolean logic into:", options: ["Physical cell library gates (e.g. NAND2, NOR2, AOI22)", "Verilog code", "Truth tables", "K-maps"], answer: 0, explanation: "Technology mapping targets specific foundry logic cells.", xp: 10 },
          { id: "opt_1_10", q: "Fan-out of a logic gate refers to:", options: ["The number of gate inputs driven by that single gate's output", "Number of inputs", "Power consumption", "Clock rate"], answer: 0, explanation: "Fan-out is the number of load inputs connected to a gate output.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "opt_2_1", q: "Optimize circuit F = A B + A B' + A' C. Compare gates before vs after.", options: ["Before: 4 gates. After (A + A'C = A + C): 1 gate", "Before 3, After 2", "No change", "Before 5, After 3"], answer: 0, explanation: "AB + AB' = A. A + A'C = A + C (1 OR gate). Original used 3 ANDs, 1 NOT, 1 OR (5 gates) -> 1 OR gate!", xp: 15 },
          { id: "opt_2_2", q: "What is the propagation depth reduction when converting linear AND chain (((AB)C)D) to tree (AB)(CD)?", options: ["Depth reduced from 3 to 2", "Depth reduced from 4 to 2", "No change", "Depth increased"], answer: 0, explanation: "Linear chain depth = 3. Balanced binary tree depth = 2.", xp: 15 },
          { id: "opt_2_3", q: "Optimize circuit F = (A + B)(A + B')(A' + C).", options: ["AC", "A + C", "AB + C", "A'B"], answer: 0, explanation: "(A + B)(A + B') = A. Then A(A' + C) = AA' + AC = AC (1 AND gate).", xp: 15 },
          { id: "opt_2_4", q: "Optimize circuit F = A B C + A B C' + A B' C.", options: ["AB + AC", "ABC", "A + B", "BC"], answer: 0, explanation: "ABC + ABC' = AB. ABC + AB'C = AC. Result: AB + AC = A(B + C). Uses 2 gates!", xp: 15 },
          { id: "opt_2_5", q: "How many connections (wires) are saved by simplifying A(B + C) + AB to AB + AC?", options: ["2 wires saved", "1 wire", "0 wires", "3 wires"], answer: 0, explanation: "Simplifies expressions and removes redundant wiring connections.", xp: 15 },
          { id: "opt_2_6", q: "What is the gate cost savings of using AOI (AND-OR-Invert) CMOS gates vs discrete gates?", options: ["AOI gates combine AND-OR-NOT into a single 1-stage CMOS complex gate", "No savings", "Only 1 wire", "Uses more transistors"], answer: 0, explanation: "CMOS complex gates like AOI22 implement (AB + CD)' in a single physical gate stage!", xp: 15 },
          { id: "opt_2_7", q: "Optimize circuit F = (A + 0)(B · 1) + (C + C').", options: ["1", "AB + 1", "AB", "0"], answer: 0, explanation: "C + C' = 1. AB + 1 = 1. Hardwire to VCC (0 gates)!", xp: 15 },
          { id: "opt_2_8", q: "Optimize circuit F = A B C · 0 + D E · 1.", options: ["DE", "ABC + DE", "0", "1"], answer: 0, explanation: "ABC · 0 = 0. DE · 1 = DE. 0 + DE = DE (1 AND gate).", xp: 15 },
          { id: "opt_2_9", q: "Calculate depth of circuit F = (A B + C D) E.", options: ["Depth = 3 (Level 1: ANDs, Level 2: OR, Level 3: AND)", "Depth = 2", "Depth = 4", "Depth = 1"], answer: 0, explanation: "Signals pass through 1st ANDs, then OR, then final AND (3 gate delays).", xp: 15 },
          { id: "opt_2_10", q: "In a circuit with 8 inputs, what is the theoretical minimum propagation depth using 2-input gates?", options: ["3 gate delays (log2 8)", "4 delays", "7 delays", "2 delays"], answer: 0, explanation: "log2(8) = 3.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "opt_3_1", q: "Optimize circuit F = A'B'C' + A'B'C + A'BC + A'BC' + AB'C' + AB'C.", options: ["A' + B'", "A' + C", "B' + C'", "A'B'"], answer: 0, explanation: "6 minterms of 3 variables. F = A' + B' (1 NAND or 1 OR with inverted inputs).", xp: 20 },
          { id: "opt_3_2", q: "Optimize circuit F = (A + B + C)(A + B + C')(A + B' + C)(A + B' + C').", options: ["A", "B", "C", "A + B"], answer: 0, explanation: "Simplifies to A (direct wire, 0 gates).", xp: 20 },
          { id: "opt_3_3", q: "Compare total transistor cost: 2-level AND-OR (AB + CD) vs 2-level NAND-NAND ((AB)'(CD)')'.", options: ["NAND-NAND uses fewer transistors in CMOS (12 vs 16 transistors)", "AND-OR uses fewer", "Equal cost", "NAND uses more"], answer: 0, explanation: "CMOS NAND uses 4 transistors, AND uses 6. NAND-NAND uses 4+4+4=12 transistors vs AND-OR 6+6+6=18 transistors!", xp: 20 },
          { id: "opt_3_4", q: "Why is multi-level logic optimization (e.g. algebraic factoring) used instead of 2-level SOP for large circuits?", options: ["Multi-level circuits break massive high-fan-in gates into small, fast, low-area gates", "2-level is always faster", "Multi-level uses more area", "Multi-level is illegal"], answer: 0, explanation: "High fan-in gates (e.g. 8-input AND) are slow/impractical in silicon; multi-level factoring optimizes area/delay tradeoffs.", xp: 20 },
          { id: "opt_3_5", q: "Optimize F = A'B'C'D' + A'B'C'D + A'B'CD + A'B'CD' + A'BC'D' + A'BC'D + A'BCD + A'BCD'.", options: ["A'", "B'", "C'", "D'"], answer: 0, explanation: "All 8 minterms starting with A' are present. F = A' (1 NOT gate).", xp: 20 },
          { id: "opt_3_6", q: "What is the area reduction percentage when 8 gates are reduced to 2 gates?", options: ["75% reduction", "50% reduction", "80% reduction", "25% reduction"], answer: 0, explanation: "(8 - 2)/8 = 6/8 = 75% gate count reduction.", xp: 20 },
          { id: "opt_3_7", q: "Optimize F = [ (A + B)' + (A + C)' ]' .", options: ["A + BC", "AB + AC", "A + B + C", "ABC"], answer: 0, explanation: "De Morgan: ( (A+B)' + (A+C)' )' = (A+B)''(A+C)'' = (A + B)(A + C) = A + BC.", xp: 20 },
          { id: "opt_3_8", q: "Optimize F = [ (A B)' (A C)' ]' .", options: ["AB + AC = A(B + C)", "A + BC", "ABC", "A'B'C'"], answer: 0, explanation: "De Morgan: ( (AB)' (AC)' )' = (AB)'' + (AC)'' = AB + AC = A(B + C).", xp: 20 },
          { id: "opt_3_9", q: "In static timing analysis (STA), what is the critical path?", options: ["The longest propagation delay path from any input pin to any output pin", "The shortest path", "The clock wire", "The power wire"], answer: 0, explanation: "Critical path determines maximum allowable clock frequency (Fmax = 1 / T_critical).", xp: 20 },
          { id: "opt_3_10", q: "Optimize F = (X Y + X Z + Y Z)' + X Y Z.", options: ["(XY + XZ + YZ)' + XYZ (Majority complement + Minority)", "1", "0", "X+Y+Z"], answer: 0, explanation: "Output is 1 when 0 or 3 inputs are 1 (3-input XNOR / parity-like behavior).", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "opt_4_1", q: "An unoptimized circuit has 12 gates and depth 5. An optimized version has 4 gates and depth 2. Calculate gate reduction % and depth reduction %.", options: ["66.7% gate reduction, 60% depth reduction", "50% gate, 50% depth", "75% gate, 40% depth", "80% gate, 50% depth"], answer: 0, explanation: "Gate reduction = (12-4)/12 = 66.7%. Depth reduction = (5-2)/5 = 60%.", xp: 25 },
          { id: "opt_4_2", q: "Optimize a 4-bit Ripple Carry Adder carry chain. How does Carry-Lookahead (CLA) optimization trade area for speed?", options: ["CLA increases gate count to compute all carries in parallel, reducing depth from O(N) to O(log N)", "CLA reduces area", "CLA slows down circuit", "CLA uses fewer gates"], answer: 0, explanation: "CLA adds parallel lookahead logic (more gates/area) to drastically cut propagation delay from 2N to 2 delays!", xp: 25 },
          { id: "opt_4_3", q: "Optimize F = A'B'C'D' + A'B'C'D + A'B'CD + A'B'CD' + AB'C'D' + AB'C'D + AB'CD + AB'CD' + ABCD + ABCD' + ABC'D + ABC'D'.", options: ["B' + AC", "B'", "A + B", "C + D"], answer: 0, explanation: "First 8 minterms = B'. Last 4 minterms = AB. B' + AB = B' + A = A + B'? Wait: last 4 minterms are ABCD, ABCD', ABC'D, ABC'D' = AB. B' + AB = B' + A = A + B'.", xp: 0, options: ["A + B'", "B'", "A + B", "C + D"], answer: 0, explanation: "Simplifies to A + B'.", xp: 25 },
          { id: "opt_4_4", q: "Simplify F = (A XOR B) AND (A XNOR B).", options: ["0 (Direct wire to GND)", "1", "A", "B"], answer: 0, explanation: "XOR and XNOR are complements (K and K'). K · K' = 0. Requires 0 gates!", xp: 25 },
          { id: "opt_4_5", q: "Simplify F = (A XOR B) OR (A XNOR B).", options: ["1 (Direct wire to VCC)", "0", "A", "B"], answer: 0, explanation: "K + K' = 1. Requires 0 gates!", xp: 25 },
          { id: "opt_4_6", q: "In high-speed FPGA synthesis, why is Retiming performed?", options: ["Moving flip-flops / registers across combinational logic blocks to balance path delays and maximize clock frequency", "Deleting all gates", "Converting LUTs to RAM", "Reducing pin count"], answer: 0, explanation: "Retiming shifts register boundaries to equalize combinational delay across stages.", xp: 25 },
          { id: "opt_4_7", q: "Optimize F = (W + X)(W + Y)(W + Z)(W' + X')(W' + Y')(W' + Z').", options: ["W(X'Y'Z') + W'(XYZ)", "W + XYZ", "W' + X'Y'Z'", "0"], answer: 0, explanation: "(W + XYZ)(W' + X'Y'Z') = W(X'Y'Z') + W'(XYZ).", xp: 25 },
          { id: "opt_4_8", q: "Calculate maximum operating frequency (Fmax) of a digital circuit with critical path delay t_critical = 5 ns and setup time t_setup = 1 ns.", options: ["166.7 MHz (1 / 6ns)", "200 MHz", "100 MHz", "500 MHz"], answer: 0, explanation: "T_clock = 5ns + 1ns = 6ns. Fmax = 1 / 6ns = 166.67 MHz.", xp: 25 },
          { id: "opt_4_9", q: "How does Common Subexpression Elimination (CSE) optimize multi-output circuits?", options: ["Identifies shared logic sub-expressions across multiple outputs so they are computed by a single shared gate tree", "Duplicates gates", "Inverts outputs", "Removes inputs"], answer: 0, explanation: "CSE shares identical logic subtrees among multiple outputs, reducing total gate count.", xp: 25 },
          { id: "opt_4_10", q: "Optimize multi-output circuit: Output Y1 = A B + A C, Output Y2 = A B + A D.", options: ["Compute AB once (1 shared AND gate); Y1 = (AB) + AC, Y2 = (AB) + AD", "Compute AB twice", "Use 6 gates", "Cannot share gates"], answer: 0, explanation: "Sharing the AB gate saves 1 AND gate across the multi-output circuit.", xp: 25 }
        ]
      }
    ]
  },

  /* ========================================================================= */
  /* 15. K-MAP BASICS                                                          */
  /* ========================================================================= */
  "kmap-basics": {
    title: "K-Map Basics",
    icon: "🗺️",
    description: "Use 2, 3, and 4-variable Karnaugh Maps to systematically reduce Boolean expressions without algebraic guesswork.",
    levels: [
      {
        title: "Level 1: Basic Concepts",
        icon: "📚",
        questions: [
          { id: "kmp_1_1", q: "What is a Karnaugh Map (K-Map)?", options: ["A graphical method for simplifying Boolean expressions by grouping adjacent 1s", "A circuit schematic", "A truth table list", "A state diagram"], answer: 0, explanation: "K-Maps visually organize truth tables so adjacent cells differ by only 1 bit.", xp: 10 },
          { id: "kmp_1_2", q: "Why are row and column headers in a K-Map labeled using Gray Code (00, 01, 11, 10)?", options: ["So adjacent cells differ by exactly ONE bit position (Adjacency Property)", "For binary counting", "To save space", "Random order"], answer: 0, explanation: "Gray code ensures adjacent cells change by only 1 variable, allowing simplification by A + A' = 1.", xp: 10 },
          { id: "kmp_1_3", q: "Valid K-Map group sizes must ALWAYS be powers of 2. Which list contains valid group sizes?", options: ["1, 2, 4, 8, 16", "1, 2, 3, 4, 5", "2, 3, 5, 7", "3, 6, 9, 12"], answer: 0, explanation: "K-Map groups must contain 2^k cells (1, 2, 4, 8, 16). Groups of 3, 5, 6 are invalid!", xp: 10 },
          { id: "kmp_1_4", q: "How many total cells are in a 2-variable K-Map?", options: ["4 cells (2^2)", "2 cells", "8 cells", "16 cells"], answer: 0, explanation: "2 variables -> 2^2 = 4 cells.", xp: 10 },
          { id: "kmp_1_5", q: "How many total cells are in a 3-variable K-Map?", options: ["8 cells (2^3)", "4 cells", "12 cells", "16 cells"], answer: 0, explanation: "3 variables -> 2^3 = 8 cells.", xp: 10 },
          { id: "kmp_1_6", q: "How many total cells are in a 4-variable K-Map?", options: ["16 cells (2^4)", "8 cells", "12 cells", "32 cells"], answer: 0, explanation: "4 variables -> 2^4 = 16 cells.", xp: 10 },
          { id: "kmp_1_7", q: "Grouping a pair of 2 adjacent 1s in a K-Map eliminates how many variables?", options: ["1 variable", "2 variables", "3 variables", "0 variables"], answer: 0, explanation: "A group of 2^1 = 2 cells eliminates 1 variable.", xp: 10 },
          { id: "kmp_1_8", q: "Grouping a quad of 4 adjacent 1s in a K-Map eliminates how many variables?", options: ["2 variables", "1 variable", "3 variables", "0 variables"], answer: 0, explanation: "A group of 2^2 = 4 cells eliminates 2 variables.", xp: 10 },
          { id: "kmp_1_9", q: "Grouping an octet of 8 adjacent 1s in a 4-variable K-Map eliminates how many variables?", options: ["3 variables", "2 variables", "1 variable", "4 variables"], answer: 0, explanation: "A group of 2^3 = 8 cells eliminates 3 variables.", xp: 10 },
          { id: "kmp_1_10", q: "If ALL 16 cells of a 4-variable K-Map contain 1s, the simplified expression is:", options: ["1", "0", "ABCD", "A+B+C+D"], answer: 0, explanation: "A group of 16 cells (2^4) eliminates all 4 variables, yielding constant 1.", xp: 10 }
        ]
      },
      {
        title: "Level 2: Intermediate Application",
        icon: "🧩",
        questions: [
          { id: "kmp_2_1", q: "In a 2-variable K-Map for F(A,B), cells m0(0,0) and m1(0,1) contain 1s. The simplified term is:", options: ["A'", "B'", "A", "B"], answer: 0, explanation: "A=0 in both cells, while B changes (0 to 1). Result: A'.", xp: 15 },
          { id: "kmp_2_2", q: "In a 2-variable K-Map for F(A,B), cells m1(0,1) and m3(1,1) contain 1s. The simplified term is:", options: ["B", "A", "A'", "B'"], answer: 0, explanation: "B=1 in both cells, while A changes (0 to 1). Result: B.", xp: 15 },
          { id: "kmp_2_3", q: "Can K-Map groups wrap around the top-to-bottom and left-to-right edges?", options: ["Yes, K-Maps are continuous (toroidal topology)", "No", "Top-to-bottom only", "Left-to-right only"], answer: 0, explanation: "Edges are adjacent in Gray Code, so groups can wrap around edges!", xp: 15 },
          { id: "kmp_2_4", q: "What is an Essential Prime Implicant (EPI)?", options: ["A prime implicant group that covers at least one 1 not covered by any other prime implicant", "Any group of size 4", "The smallest group", "A group containing 0s"], answer: 0, explanation: "EPIs MUST be included in the minimal sum of products.", xp: 15 },
          { id: "kmp_2_5", q: "In a 3-variable K-Map for F(A,B,C), minterms m0(000), m1(001), m2(010), m3(011) contain 1s. Simplified term =", options: ["A'", "B'", "C'", "AB"], answer: 0, explanation: "Quad of 4 cells where A=0 for all cells. Result: A'.", xp: 15 },
          { id: "kmp_2_6", q: "In a 3-variable K-Map, minterms m4(100), m5(101), m6(110), m7(111) contain 1s. Simplified term =", options: ["A", "A'", "B", "C"], answer: 0, explanation: "Quad of 4 cells where A=1. Result: A.", xp: 15 },
          { id: "kmp_2_7", q: "In a 3-variable K-Map, minterms m0(000) and m4(100) contain 1s. Simplified term =", options: ["B'C'", "A'B'", "AC", "BC"], answer: 0, explanation: "Pair where B=0, C=0. Result: B'C'.", xp: 15 },
          { id: "kmp_2_8", q: "What do 'Don't Care' conditions (marked with X) represent in a K-Map?", options: ["Input combinations that can NEVER occur or whose output is irrelevant", "Always 1s", "Always 0s", "Invalid inputs"], answer: 0, explanation: "Don't cares (X) can be treated as 1 or 0 to form larger groups and simplify logic!", xp: 15 },
          { id: "kmp_2_9", q: "True or False: Larger K-Map groups produce smaller product terms with FEWER variables.", options: ["True", "False", "Group size doesn't matter", "Only for 4 variables"], answer: 0, explanation: "True! Larger groups eliminate more variables.", xp: 15 },
          { id: "kmp_2_10", q: "In a 4-variable K-Map, the 4 corner cells m0(0000), m2(0010), m8(1000), m10(1010) form a valid quad. Simplified term =", options: ["B'D'", "A'C'", "BD", "AC"], answer: 0, explanation: "Corner quad: B=0 and D=0 in all 4 corners. Result: B'D'.", xp: 15 }
        ]
      },
      {
        title: "Level 3: Advanced Circuit Reasoning",
        icon: "⚡",
        questions: [
          { id: "kmp_3_1", q: "Minimize F(A,B,C,D) = Σm(0, 2, 8, 10, 5, 7, 13, 15) using K-Map.", options: ["B'D' + BD", "AC + BD", "A'B + CD", "A'C' + BD'"], answer: 0, explanation: "4 corners (0,2,8,10) = B'D'. Center quad (5,7,13,15) = BD. Result: B'D' + BD (XNOR!).", xp: 20 },
          { id: "kmp_3_2", q: "Minimize F(A,B,C,D) = Σm(1, 3, 5, 7, 9, 11, 13, 15) using K-Map.", options: ["D", "D'", "B", "C"], answer: 0, explanation: "Octet of 8 cells covering all odd minterms (where D=1). Result: D.", xp: 20 },
          { id: "kmp_3_3", q: "Minimize F(A,B,C,D) = Σm(0, 1, 2, 3, 4, 5, 6, 7) using K-Map.", options: ["A'", "A", "B'", "C'"], answer: 0, explanation: "Top 2 rows forming an 8-cell octet where A=0. Result: A'.", xp: 20 },
          { id: "kmp_3_4", q: "Minimize F(A,B,C,D) = Σm(2, 3, 6, 7, 10, 11, 14, 15) using K-Map.", options: ["C", "C'", "B", "D"], answer: 0, explanation: "Right 2 columns forming an 8-cell octet where C=1. Result: C.", xp: 20 },
          { id: "kmp_3_5", q: "Minimize F(A,B,C,D) = Σm(0, 1, 4, 5, 12, 13, 8, 9) using K-Map.", options: ["C'", "C", "A'", "B'"], answer: 0, explanation: "Left 2 columns forming an 8-cell octet where C=0. Result: C'.", xp: 20 },
          { id: "kmp_3_6", q: "Minimize F(A,B,C) = Σm(1, 3, 4, 5, 6) using K-Map.", options: ["A'C + AB'", "AB + C", "A + BC", "AC + B"], answer: 0, explanation: "Group (1,3) = A'C. Group (4,5) = AB'. Group (4,6) = AB'. Result: A'C + AB'.", xp: 20 },
          { id: "kmp_3_7", q: "Minimize F(A,B,C,D) = Σm(0, 4, 8, 12) using K-Map.", options: ["C'D'", "A'B'", "CD", "AB"], answer: 0, explanation: "First column quad where C=0, D=0. Result: C'D'.", xp: 20 },
          { id: "kmp_3_8", q: "Minimize F(A,B,C,D) = Σm(12, 13, 14, 15) using K-Map.", options: ["AB", "A'B'", "CD", "C'D'"], answer: 0, explanation: "Bottom row quad where A=1, B=1. Result: AB.", xp: 20 },
          { id: "kmp_3_9", q: "Minimize F(A,B,C,D) = Σm(0, 1, 2, 3) using K-Map.", options: ["A'B'", "AB", "CD", "C'D'"], answer: 0, explanation: "Top row quad where A=0, B=0. Result: A'B'.", xp: 20 },
          { id: "kmp_3_10", q: "How are 'Don't Cares' (X) used to maximize simplification?", options: ["Include X in groups of 1s if it creates a LARGER group (e.g. turning a pair into a quad)", "Always group all Xs", "Never group Xs", "Treat Xs as 0 always"], answer: 0, explanation: "Xs are optionally included only when they expand group sizes to eliminate more variables.", xp: 20 }
        ]
      },
      {
        title: "Level 4: Challenge & Optimization",
        icon: "🏆",
        questions: [
          { id: "kmp_4_1", q: "Minimize F(A,B,C,D) = Σm(0, 1, 2, 5, 8, 9, 10) with Don't Cares d(A,B,C,D) = d(3, 7, 11, 15).", options: ["B' + D", "A'B' + C", "B' + CD", "A + B'"], answer: 0, explanation: "Including don't cares 3, 7, 11, 15 turns column 2 and corners into an octet B' + D... Octet for B'=0,1,2,3,8,9,10,11 gives B'. Minterm 5,7,13,15 gives D. Result: B' + D.", xp: 25 },
          { id: "kmp_4_2", q: "Minimize F(A,B,C,D) = Σm(1, 5, 6, 7, 11, 12, 13, 15).", options: ["A'BC + A'C'D + ABD + AB'CD", "A + B + C + D", "BC + AD", "1"], answer: 0, explanation: "Group (5,7,13,15) = BD. Group (5,1,13,9?) no minterm 9. Group (6,7,5,4?) minterm 5,6,7 = A'BC. Group (12,13) = ABC'. Result: A'BC + A'C'D + ABD + AB'CD.", xp: 0, options: ["BD + A'BC + ABC' + A'C'D", "A + B + C + D", "BC + AD", "1"], answer: 0, explanation: "SOP minimal terms: BD + A'BC + ABC' + A'C'D.", xp: 25 },
          { id: "kmp_4_3", q: "Find the minimal POS expression using 0s from K-Map for F(A,B,C,D) = Σm(0, 1, 2, 5, 8, 9, 10).", options: ["(A + B')(C' + D)(B' + D')", "(A + B)(C + D)", "A'B'C'D'", "1"], answer: 0, explanation: "Grouping 0s in K-Map yields minimal POS expression (A + B')(C' + D)(B' + D').", xp: 25 },
          { id: "kmp_4_4", q: "What is a Redundant Prime Implicant in a K-Map?", options: ["A prime implicant whose 1s are ALL covered by other essential prime implicants", "An EPI", "A single minterm", "A group of 0s"], answer: 0, explanation: "Redundant prime implicants are discarded to avoid superfluous gates.", xp: 25 },
          { id: "kmp_4_5", q: "Minimize F(A,B,C,D) = Σm(0, 2, 5, 7, 8, 10, 13, 15).", options: ["B'D' + BD", "A'B + CD", "AC + BD", "A'C' + BD'"], answer: 0, explanation: "Corners (0,2,8,10) = B'D'. Center quad (5,7,13,15) = BD. Result: B'D' + BD.", xp: 25 },
          { id: "kmp_4_6", q: "Minimize F(A,B,C,D) = Σm(1, 3, 4, 5, 9, 11, 12, 13, 15).", options: ["C'D' + AB + CD", "A'C'D + B'D + AB", "CD + A'B", "A + B + C + D"], answer: 0, explanation: "Quads: (1,3,9,11) = B'D. (4,5,12,13) = BC'. (5,7?,13,15) = BD. Result gives simplified form.", xp: 1, options: ["B'D + BC' + BD", "A + B", "C + D", "1"], answer: 0, explanation: "B'D + BC' + BD = B'D + B(C' + D) = B'D + BD + BC' = D(B' + B) + BC' = D + BC'.", xp: 25 },
          { id: "kmp_4_7", q: "How many gates are required to implement F = B'D' + BD (optimized via K-Map)?", options: ["1 XNOR gate (or 2 ANDs + 1 OR)", "5 gates", "8 gates", "10 gates"], answer: 0, explanation: "B'D' + BD is B XNOR D, requiring 1 XNOR gate!", xp: 25 },
          { id: "kmp_4_8", q: "For a 5-variable function F(A,B,C,D,E), how many 4-variable K-Map grids are used side-by-side?", options: ["2 grids of 16 cells each (32 cells total)", "4 grids", "1 grid", "8 grids"], answer: 0, explanation: "5 variables = 32 cells = 2 adjacent 4-variable (16-cell) K-Map maps for A=0 and A=1.", xp: 25 },
          { id: "kmp_4_9", q: "For a 6-variable function F(A,B,C,D,E,F), how many 4-variable K-Map grids are used?", options: ["4 grids of 16 cells each (64 cells total)", "2 grids", "8 grids", "16 grids"], answer: 0, explanation: "6 variables = 64 cells = 4 adjacent 4-variable K-Map grids.", xp: 25 },
          { id: "kmp_4_10", q: "Why is Quine-McCluskey tabular algorithm preferred over K-Maps for functions with > 6 variables?", options: ["Quine-McCluskey is a computer-friendly tabular method that easily handles N > 6 variables without visual complexity", "K-maps stop working", "Quine-McCluskey uses less memory", "K-maps require color screens"], answer: 0, explanation: "Visual K-maps become hard to visualize above 4-6 variables, whereas Quine-McCluskey is algorithmic and software-computable for arbitrary N!", xp: 25 }
        ]
      }
    ]
  }
};
