import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("report_figures", exist_ok=True)

# Choose font
try:
    font_bold_lg = ImageFont.truetype("arialbd.ttf", 24)
    font_bold = ImageFont.truetype("arialbd.ttf", 18)
    font_bold_sm = ImageFont.truetype("arialbd.ttf", 14)
    font_regular = ImageFont.truetype("arial.ttf", 15)
    font_regular_sm = ImageFont.truetype("arial.ttf", 13)
    font_mono = ImageFont.truetype("consola.ttf", 13)
except Exception:
    font_bold_lg = ImageFont.load_default()
    font_bold = ImageFont.load_default()
    font_bold_sm = ImageFont.load_default()
    font_regular = ImageFont.load_default()
    font_regular_sm = ImageFont.load_default()
    font_mono = ImageFont.load_default()

def draw_rounded_rect(draw, coords, radius, fill, outline, width=2):
    draw.rounded_rectangle(coords, radius=radius, fill=fill, outline=outline, width=width)

# -------------------------------------------------------------
# Figure 4.1: High-Level System Architecture
# -------------------------------------------------------------
def generate_fig4_1():
    w, h = 1000, 520
    img = Image.new("RGB", (w, h), "#FFFFFF")
    draw = ImageDraw.Draw(img)

    # 1. Client Layer
    draw_rounded_rect(draw, (80, 40, 920, 110), 12, "#E8F5E9", "#2E7D32", 2)
    draw.text((500, 60), "Client Layer (Frontend Presentation)", fill="#1B5E20", font=font_bold, anchor="mm")
    draw.text((500, 88), "React 18  |  Vite SPA  |  Interactive Circuit Canvas  |  SVG Wiring  |  Learning & Teacher Dashboards", fill="#2E7D32", font=font_regular, anchor="mm")

    # Arrow down
    draw.line([(500, 110), (500, 150)], fill="#37474F", width=2)
    draw.polygon([(495, 142), (505, 142), (500, 152)], fill="#37474F")

    # 2. API Gateway Layer
    draw_rounded_rect(draw, (80, 150, 920, 230), 12, "#E1F5FE", "#0288D1", 2)
    draw.text((500, 172), "API Gateway & Application Server (Python / Flask 3.1)", fill="#01579B", font=font_bold, anchor="mm")
    draw.text((500, 202), "REST Endpoints:  /api/auth  |  /api/circuits  |  /api/learning  |  /api/teacher  |  /api/student  |  /api/discussions", fill="#0277BD", font=font_regular, anchor="mm")

    # Arrow down
    draw.line([(500, 230), (500, 270)], fill="#37474F", width=2)
    draw.polygon([(495, 262), (505, 262), (500, 272)], fill="#37474F")

    # 3. Core Logic & Verification Engines
    draw_rounded_rect(draw, (80, 270, 920, 360), 12, "#FFF8E1", "#FFA000", 2)
    draw.text((500, 292), "Core Logic, Simulation & Verification Engines (Custom Algorithms)", fill="#E65100", font=font_bold, anchor="mm")
    draw.text((500, 325), "Graph Validator (Cycle/DFS)  |  Topological Simulator  |  2^N Truth Table Engine  |  Boolean Optimizer  |  Equivalence Verifier", fill="#EF6C00", font=font_regular, anchor="mm")

    # Arrow down
    draw.line([(500, 360), (500, 400)], fill="#37474F", width=2)
    draw.polygon([(495, 392), (505, 392), (500, 402)], fill="#37474F")

    # 4. Persistence Layer
    draw_rounded_rect(draw, (80, 400, 920, 480), 12, "#EDE7F6", "#512DA8", 2)
    draw.text((500, 422), "Data Persistence Layer (MongoDB / PyMongo)", fill="#311B92", font=font_bold, anchor="mm")
    draw.text((500, 452), "Collections:  users  |  circuits  |  questions (Teacher & Seed)  |  submissions  |  learning_progress  |  discussions", fill="#4527A0", font=font_regular, anchor="mm")

    img.save("report_figures/fig4_1_architecture.png")
    print("Generated fig4_1_architecture.png")

# -------------------------------------------------------------
# Figure 4.2: Data Flow Diagram
# -------------------------------------------------------------
def generate_fig4_2():
    w, h = 800, 880
    img = Image.new("RGB", (w, h), "#FFFFFF")
    draw = ImageDraw.Draw(img)

    steps = [
        ("User Input / Circuit Design", "Canvas UI: Component drag-and-drop, wiring & toggle state", "#E8F5E9", "#2E7D32"),
        ("REST API Submission", "POST /api/circuits/simulate or /verify with nodes & wires JSON", "#E1F5FE", "#0288D1"),
        ("JWT Authentication & Role Validation", "Verify bearer token, enforce student/teacher role boundaries", "#EDE7F6", "#512DA8"),
        ("Circuit Structure Validation", "Detect disconnected ports, unknown gates, and combinational cycles (Tarjan's DFS)", "#FFF3E0", "#E65100"),
        ("Topological Sorting & Dependency Resolution", "Order DAG gate nodes from primary INPUTs to OUTPUTs", "#E0F2F1", "#00695C"),
        ("Multi-Level Gate Simulation", "Evaluate Boolean logic operations and propagate binary signal levels", "#FCE4EC", "#AD1457"),
        ("Dynamic 2^N Truth Table & Boolean Extraction", "Evaluate all 2^N input vectors; extract Boolean algebraic expressions", "#F3E5F5", "#7B1FA2"),
        ("Optimization & Equivalence Verification", "Boolean minimization (Absorption, De Morgan); check metric savings & equivalence", "#FFF9C4", "#F57F17"),
        ("Database Persistence & Audit Recording", "Store verified circuit, submission history, XP points, and progress in MongoDB", "#EFEBE9", "#4E342E"),
        ("JSON Response to Client", "Structured result: truth table, gate reduction, verification status, and visual states", "#E8F5E9", "#2E7D32")
    ]

    y = 30
    box_h = 56
    box_w = 640
    x0 = 80

    for idx, (title, desc, fill, outline) in enumerate(steps):
        draw_rounded_rect(draw, (x0, y, x0 + box_w, y + box_h), 8, fill, outline, 2)
        draw.text((x0 + box_w / 2, y + 18), title, fill=outline, font=font_bold_sm, anchor="mm")
        draw.text((x0 + box_w / 2, y + 38), desc, fill="#37474F", font=font_regular_sm, anchor="mm")

        if idx < len(steps) - 1:
            draw.line([(x0 + box_w / 2, y + box_h), (x0 + box_w / 2, y + box_h + 26)], fill="#455A64", width=2)
            draw.polygon([
                (x0 + box_w / 2 - 5, y + box_h + 18),
                (x0 + box_w / 2 + 5, y + box_h + 18),
                (x0 + box_w / 2, y + box_h + 26)
            ], fill="#455A64")

        y += box_h + 26

    img.save("report_figures/fig4_2_dataflow.png")
    print("Generated fig4_2_dataflow.png")

# -------------------------------------------------------------
# Figure 4.3: User Interface — Authentication and Home Screens
# -------------------------------------------------------------
def generate_fig4_3():
    w, h = 1000, 620
    img = Image.new("RGB", (w, h), "#FAFAFA")
    draw = ImageDraw.Draw(img)

    # Panel A: Login Screen
    p1_x, p1_y, p1_w, p1_h = 40, 30, 440, 520
    draw_rounded_rect(draw, (p1_x, p1_y, p1_x + p1_w, p1_y + p1_h), 10, "#1E293B", "#0EA5E9", 2)
    # Header
    draw.text((p1_x + p1_w/2, p1_y + 50), "LogicPath", fill="#38BDF8", font=font_bold_lg, anchor="mm")
    draw.text((p1_x + p1_w/2, p1_y + 80), "Digital Circuit Design & Optimization", fill="#94A3B8", font=font_regular_sm, anchor="mm")

    # Inputs
    draw_rounded_rect(draw, (p1_x + 40, p1_y + 130, p1_x + p1_w - 40, p1_y + 180), 6, "#0F172A", "#334155", 1)
    draw.text((p1_x + 55, p1_y + 155), "Email: student@logicpath.io", fill="#E2E8F0", font=font_regular_sm, anchor="lm")

    draw_rounded_rect(draw, (p1_x + 40, p1_y + 200, p1_x + p1_w - 40, p1_y + 250), 6, "#0F172A", "#334155", 1)
    draw.text((p1_x + 55, p1_y + 225), "Password: ************", fill="#E2E8F0", font=font_regular_sm, anchor="lm")

    # Role selector
    draw.text((p1_x + 40, p1_y + 280), "Select Role:", fill="#94A3B8", font=font_regular_sm, anchor="lm")
    draw_rounded_rect(draw, (p1_x + 130, p1_y + 265, p1_x + 230, p1_y + 295), 4, "#0284C7", "#38BDF8", 1)
    draw.text((p1_x + 180, p1_y + 280), "Student", fill="#FFFFFF", font=font_bold_sm, anchor="mm")
    draw_rounded_rect(draw, (p1_x + 245, p1_y + 265, p1_x + 345, p1_y + 295), 4, "#334155", "#475569", 1)
    draw.text((p1_x + 295, p1_y + 280), "Teacher", fill="#94A3B8", font=font_regular_sm, anchor="mm")

    # Login Button
    draw_rounded_rect(draw, (p1_x + 40, p1_y + 330, p1_x + p1_w - 40, p1_y + 380), 8, "#2563EB", "#3B82F6", 1)
    draw.text((p1_x + p1_w/2, p1_y + 355), "Sign In to LogicPath", fill="#FFFFFF", font=font_bold, anchor="mm")

    # Subtext
    draw.text((p1_x + p1_w/2, p1_y + 420), "Pre-seeded accounts: student / teacher demo available", fill="#64748B", font=font_regular_sm, anchor="mm")
    draw.text((p1_x + p1_w/2, p1_y + 450), "JWT Secured Bearer Authentication with SHA-256", fill="#64748B", font=font_regular_sm, anchor="mm")

    # Caption A
    draw.text((p1_x + p1_w/2, p1_y + p1_h + 30), "(a) Login Screen — Role-Based JWT Authentication", fill="#0F172A", font=font_bold_sm, anchor="mm")

    # Panel B: Student Dashboard / Learning Path
    p2_x = 520
    draw_rounded_rect(draw, (p2_x, p1_y, p2_x + p1_w, p1_y + p1_h), 10, "#0F172A", "#10B981", 2)
    # Header
    draw.text((p2_x + 30, p1_y + 40), "Welcome back, Learner!", fill="#F8FAFC", font=font_bold, anchor="lm")
    draw.text((p2_x + 30, p1_y + 65), "Mastery: 72% | XP: 1,450 | Solved: 28 Circuits", fill="#10B981", font=font_bold_sm, anchor="lm")

    # Stats cards
    draw_rounded_rect(draw, (p2_x + 25, p1_y + 90, p2_x + 145, p1_y + 155), 6, "#1E293B", "#334155", 1)
    draw.text((p2_x + 85, p1_y + 112), "15 Topics", fill="#38BDF8", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 85, p1_y + 135), "Curriculum", fill="#94A3B8", font=font_regular_sm, anchor="mm")

    draw_rounded_rect(draw, (p2_x + 160, p1_y + 90, p2_x + 280, p1_y + 155), 6, "#1E293B", "#334155", 1)
    draw.text((p2_x + 220, p1_y + 112), "4 Levels", fill="#A855F7", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 220, p1_y + 135), "Progression", fill="#94A3B8", font=font_regular_sm, anchor="mm")

    draw_rounded_rect(draw, (p2_x + 295, p1_y + 90, p2_x + 415, p1_y + 155), 6, "#1E293B", "#334155", 1)
    draw.text((p2_x + 355, p1_y + 112), "80% Pass", fill="#22C55E", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 355, p1_y + 135), "Gate Lock", fill="#94A3B8", font=font_regular_sm, anchor="mm")

    # Topic cards
    topics = [
        ("1. Basic Logic Gates (AND, OR, NOT)", "Level 1: 100% Completed (Unlocked)", "#065F46", "#34D399"),
        ("2. Universal Gates (NAND, NOR Logic)", "Level 2: 85% Score (In Progress)", "#1E3A8A", "#60A5FA"),
        ("3. Boolean Algebra & De Morgan's Laws", "Level 3: Locked (Requires Level 2 >= 80%)", "#374151", "#9CA3AF"),
        ("4. Combinational Circuits (Adders, MUX)", "Level 4: Master Level (Locked)", "#374151", "#9CA3AF"),
    ]
    ty = p1_y + 175
    for t_title, t_status, bg, border in topics:
        draw_rounded_rect(draw, (p2_x + 25, ty, p2_x + p1_w - 25, ty + 68), 6, bg, border, 1)
        draw.text((p2_x + 40, ty + 24), t_title, fill="#FFFFFF", font=font_bold_sm, anchor="lm")
        draw.text((p2_x + 40, ty + 46), t_status, fill=border, font=font_regular_sm, anchor="lm")
        ty += 80

    # Caption B
    draw.text((p2_x + p1_w/2, p1_y + p1_h + 30), "(b) Student Dashboard — Progressive Topic & Level Mastery", fill="#0F172A", font=font_bold_sm, anchor="mm")

    img.save("report_figures/fig4_3_screens.png")
    print("Generated fig4_3_screens.png")

# -------------------------------------------------------------
# Figure 4.4: User Interface — Circuit Canvas and Simulation
# -------------------------------------------------------------
def generate_fig4_4():
    w, h = 1000, 620
    img = Image.new("RGB", (w, h), "#FAFAFA")
    draw = ImageDraw.Draw(img)

    # Panel A: Circuit Canvas Editor
    p1_x, p1_y, p1_w, p1_h = 40, 30, 440, 520
    draw_rounded_rect(draw, (p1_x, p1_y, p1_x + p1_w, p1_y + p1_h), 10, "#0F172A", "#3B82F6", 2)
    # Toolbar
    draw_rounded_rect(draw, (p1_x, p1_y, p1_x + p1_w, p1_y + 50), 0, "#1E293B", "#334155", 1)
    draw.text((p1_x + 20, p1_y + 25), "Logic Canvas: Half Adder Design", fill="#F8FAFC", font=font_bold_sm, anchor="lm")
    draw_rounded_rect(draw, (p1_x + p1_w - 90, p1_y + 12, p1_x + p1_w - 15, p1_y + 38), 4, "#16A34A", "#22C55E", 1)
    draw.text((p1_x + p1_w - 52, p1_y + 25), "Simulate", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # Grid canvas
    draw_rounded_rect(draw, (p1_x + 15, p1_y + 65, p1_x + p1_w - 15, p1_y + p1_h - 20), 6, "#020617", "#1E293B", 1)

    # Gates on Canvas
    # Input A
    draw_rounded_rect(draw, (p1_x + 40, p1_y + 110, p1_x + 110, p1_y + 160), 6, "#0284C7", "#38BDF8", 1)
    draw.text((p1_x + 75, p1_y + 135), "IN: A (1)", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # Input B
    draw_rounded_rect(draw, (p1_x + 40, p1_y + 230, p1_x + 110, p1_y + 280), 6, "#0284C7", "#38BDF8", 1)
    draw.text((p1_x + 75, p1_y + 255), "IN: B (0)", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # XOR Gate (SUM)
    draw_rounded_rect(draw, (p1_x + 180, p1_y + 120, p1_x + 270, p1_y + 180), 8, "#7C3AED", "#A78BFA", 1)
    draw.text((p1_x + 225, p1_y + 150), "XOR", fill="#FFFFFF", font=font_bold, anchor="mm")

    # AND Gate (CARRY)
    draw_rounded_rect(draw, (p1_x + 180, p1_y + 240, p1_x + 270, p1_y + 300), 8, "#2563EB", "#60A5FA", 1)
    draw.text((p1_x + 225, p1_y + 270), "AND", fill="#FFFFFF", font=font_bold, anchor="mm")

    # Output SUM
    draw_rounded_rect(draw, (p1_x + 340, p1_y + 125, p1_x + 415, p1_y + 175), 6, "#059669", "#34D399", 1)
    draw.text((p1_x + 377, p1_y + 150), "SUM: 1", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # Output CARRY
    draw_rounded_rect(draw, (p1_x + 340, p1_y + 245, p1_x + 415, p1_y + 295), 6, "#D97706", "#FBBF24", 1)
    draw.text((p1_x + 377, p1_y + 270), "CARRY: 0", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # Wires (lines)
    draw.line([(p1_x + 110, p1_y + 135), (p1_x + 180, p1_y + 140)], fill="#38BDF8", width=3) # A to XOR
    draw.line([(p1_x + 110, p1_y + 135), (p1_x + 140, p1_y + 135), (p1_x + 140, p1_y + 260), (p1_x + 180, p1_y + 260)], fill="#38BDF8", width=2) # A to AND
    draw.line([(p1_x + 110, p1_y + 255), (p1_x + 155, p1_y + 255), (p1_x + 155, p1_y + 165), (p1_x + 180, p1_y + 165)], fill="#64748B", width=2) # B to XOR
    draw.line([(p1_x + 110, p1_y + 255), (p1_x + 180, p1_y + 280)], fill="#64748B", width=3) # B to AND
    draw.line([(p1_x + 270, p1_y + 150), (p1_x + 340, p1_y + 150)], fill="#34D399", width=3) # XOR to SUM
    draw.line([(p1_x + 270, p1_y + 270), (p1_x + 340, p1_y + 270)], fill="#64748B", width=2) # AND to CARRY

    # Palette preview at bottom
    draw_rounded_rect(draw, (p1_x + 25, p1_y + 360, p1_x + p1_w - 25, p1_y + 470), 6, "#1E293B", "#334155", 1)
    draw.text((p1_x + 40, p1_y + 380), "Component Palette (Drag to Canvas):", fill="#94A3B8", font=font_regular_sm, anchor="lm")
    draw.text((p1_x + 40, p1_y + 415), "[INPUT]  [OUTPUT]  [AND]  [OR]  [NOT]  [NAND]", fill="#38BDF8", font=font_mono, anchor="lm")
    draw.text((p1_x + 40, p1_y + 445), "[NOR]    [XOR]     [XNOR] [CLOCK] [LED]", fill="#38BDF8", font=font_mono, anchor="lm")

    # Caption A
    draw.text((p1_x + p1_w/2, p1_y + p1_h + 30), "(a) Circuit Canvas — Interactive Drag-and-Drop Circuit Design", fill="#0F172A", font=font_bold_sm, anchor="mm")

    # Panel B: Truth Table & Optimization Modal
    p2_x = 520
    draw_rounded_rect(draw, (p2_x, p1_y, p2_x + p1_w, p1_y + p1_h), 10, "#0F172A", "#10B981", 2)
    # Header
    draw_rounded_rect(draw, (p2_x, p1_y, p2_x + p1_w, p1_y + 50), 0, "#1E293B", "#334155", 1)
    draw.text((p2_x + 20, p1_y + 25), "Simulation & Truth Table Analysis", fill="#F8FAFC", font=font_bold_sm, anchor="lm")

    # Truth Table
    draw_rounded_rect(draw, (p2_x + 25, p1_y + 70, p2_x + p1_w - 25, p2_x - p2_x + 230), 6, "#1E293B", "#334155", 1)
    draw.text((p2_x + 40, p1_y + 90), "Generated 2^N State Truth Table (A, B -> SUM, CARRY)", fill="#38BDF8", font=font_bold_sm, anchor="lm")

    # Table Header
    draw_rounded_rect(draw, (p2_x + 40, p1_y + 110, p2_x + p1_w - 40, p1_y + 135), 0, "#334155", "#475569", 1)
    draw.text((p2_x + 70, p1_y + 122), "A", fill="#FFFFFF", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 130, p1_y + 122), "B", fill="#FFFFFF", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 220, p1_y + 122), "SUM (XOR)", fill="#34D399", font=font_bold_sm, anchor="mm")
    draw.text((p2_x + 330, p1_y + 122), "CARRY (AND)", fill="#FBBF24", font=font_bold_sm, anchor="mm")

    # Table Rows
    tt_rows = [
        ("0", "0", "0", "0"),
        ("0", "1", "1", "0"),
        ("1", "0", "1", "0"),
        ("1", "1", "0", "1"),
    ]
    r_y = p1_y + 145
    for r_a, r_b, r_s, r_c in tt_rows:
        draw.text((p2_x + 70, r_y), r_a, fill="#E2E8F0", font=font_mono, anchor="mm")
        draw.text((p2_x + 130, r_y), r_b, fill="#E2E8F0", font=font_mono, anchor="mm")
        draw.text((p2_x + 220, r_y), r_s, fill="#34D399", font=font_mono, anchor="mm")
        draw.text((p2_x + 330, r_y), r_c, fill="#FBBF24", font=font_mono, anchor="mm")
        draw.line([(p2_x + 40, r_y + 12), (p2_x + p1_w - 40, r_y + 12)], fill="#334155", width=1)
        r_y += 24

    # Boolean Expression Panel
    draw_rounded_rect(draw, (p2_x + 25, p1_y + 260, p2_x + p1_w - 25, p1_y + 350), 6, "#1E293B", "#334155", 1)
    draw.text((p2_x + 40, p1_y + 280), "Extracted Boolean Expressions:", fill="#94A3B8", font=font_regular_sm, anchor="lm")
    draw.text((p2_x + 40, p1_y + 305), "SUM   = (A & ~B) | (~A & B) = A XOR B", fill="#38BDF8", font=font_mono, anchor="lm")
    draw.text((p2_x + 40, p1_y + 330), "CARRY = A & B", fill="#FBBF24", font=font_mono, anchor="lm")

    # Optimization Comparison
    draw_rounded_rect(draw, (p2_x + 25, p1_y + 370, p2_x + p1_w - 25, p1_y + 490), 6, "#064E3B", "#059669", 1)
    draw.text((p2_x + 40, p1_y + 395), "Optimization Engine Comparison:", fill="#6EE7B7", font=font_bold_sm, anchor="lm")
    draw.text((p2_x + 40, p1_y + 422), "• Original Gate Count: 5 gates (Unoptimized Sum-of-Products)", fill="#E2E8F0", font=font_regular_sm, anchor="lm")
    draw.text((p2_x + 40, p1_y + 444), "• Optimized Gate Count: 2 gates (1 XOR + 1 AND)", fill="#34D399", font=font_bold_sm, anchor="lm")
    draw.text((p2_x + 40, p1_y + 466), "• Savings: 60% Gate Reduction | Depth Reduced: 3 -> 1 level", fill="#FDE047", font=font_bold_sm, anchor="lm")

    # Caption B
    draw.text((p2_x + p1_w/2, p1_y + p1_h + 30), "(b) Simulation Analysis — Truth Table, Boolean Extraction & Optimization", fill="#0F172A", font=font_bold_sm, anchor="mm")

    img.save("report_figures/fig4_4_simulation.png")
    print("Generated fig4_4_simulation.png")

# -------------------------------------------------------------
# Figure 4.5: Teacher Dashboard & Student Performance Analytics
# -------------------------------------------------------------
def generate_fig4_5():
    w, h = 1000, 520
    img = Image.new("RGB", (w, h), "#0F172A")
    draw = ImageDraw.Draw(img)

    # Top Navbar
    draw_rounded_rect(draw, (20, 20, 980, 70), 8, "#1E293B", "#334155", 1)
    draw.text((45, 45), "LogicPath Instructor Portal", fill="#38BDF8", font=font_bold, anchor="lm")
    draw.text((800, 45), "Prof. Sunitha D (Instructor)", fill="#E2E8F0", font=font_regular_sm, anchor="lm")

    # 4 Metric Cards
    metrics = [
        ("40 Published", "Problem Challenges", "#0284C7"),
        ("142 Submissions", "Automated Verifications", "#7C3AED"),
        ("91.4% Pass Rate", "First-Attempt Equivalence", "#059669"),
        ("24 Discussions", "Active Student Threads", "#D97706"),
    ]
    mx = 20
    for title, subtitle, color in metrics:
        draw_rounded_rect(draw, (mx, 90, mx + 225, 175), 8, "#1E293B", color, 2)
        draw.text((mx + 20, 122), title, fill="#FFFFFF", font=font_bold, anchor="lm")
        draw.text((mx + 20, 150), subtitle, fill="#94A3B8", font=font_regular_sm, anchor="lm")
        mx += 245

    # Left Section: Teacher Question Editor & Pre-publish verification
    draw_rounded_rect(draw, (20, 195, 540, 490), 8, "#1E293B", "#334155", 1)
    draw.text((40, 220), "Teacher Question Authoring & Verification", fill="#F8FAFC", font=font_bold_sm, anchor="lm")

    draw.text((40, 255), "Challenge: Distributive Law Circuit Optimization", fill="#38BDF8", font=font_bold_sm, anchor="lm")
    draw.text((40, 280), "Target: Verify that A & (B | C) == (A & B) | (A & C)", fill="#94A3B8", font=font_regular_sm, anchor="lm")

    draw_rounded_rect(draw, (40, 310, 520, 390), 6, "#020617", "#059669", 1)
    draw.text((55, 332), "[VERIFIED] Circuit equivalence confirmed across all 2^3=8 states.", fill="#34D399", font=font_bold_sm, anchor="lm")
    draw.text((55, 355), "Original: 3 gates (2 AND, 1 OR) -> Optimized: 2 gates (1 OR, 1 AND)", fill="#E2E8F0", font=font_regular_sm, anchor="lm")
    draw.text((55, 375), "Status: Published (Available to all enrolled students)", fill="#FDE047", font=font_regular_sm, anchor="lm")

    draw_rounded_rect(draw, (40, 415, 230, 460), 6, "#2563EB", "#3B82F6", 1)
    draw.text((135, 437), "+ Create New Question", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    draw_rounded_rect(draw, (250, 415, 440, 460), 6, "#059669", "#34D399", 1)
    draw.text((345, 437), "Review Submissions (8)", fill="#FFFFFF", font=font_bold_sm, anchor="mm")

    # Right Section: Real-time Discussion and Submission Feed
    draw_rounded_rect(draw, (560, 195, 980, 490), 8, "#1E293B", "#334155", 1)
    draw.text((580, 220), "Student Submissions & Discussion Thread", fill="#F8FAFC", font=font_bold_sm, anchor="lm")

    feed = [
        ("Nandhana Sudheer C (2051)", "Submitted Half Adder: 100/100 (Pass, 2 gates)", "#22C55E"),
        ("Student 102", "Submitted Full Adder: Verification error at row 7", "#EF4444"),
        ("Student 204", "Question: 'Why is NAND called a universal gate?'", "#F59E0B"),
        ("Prof. Sunitha D (Reply)", "Explained: Any Boolean function can be built using NAND.", "#38BDF8"),
    ]
    fy = 250
    for author, note, color in feed:
        draw_rounded_rect(draw, (580, fy, 960, fy + 50), 6, "#0F172A", color, 1)
        draw.text((595, fy + 17), author, fill=color, font=font_bold_sm, anchor="lm")
        draw.text((595, fy + 36), note, fill="#E2E8F0", font=font_regular_sm, anchor="lm")
        fy += 60

    img.save("report_figures/fig4_5_dashboard.png")
    print("Generated fig4_5_dashboard.png")

if __name__ == "__main__":
    generate_fig4_1()
    generate_fig4_2()
    generate_fig4_3()
    generate_fig4_4()
    generate_fig4_5()
