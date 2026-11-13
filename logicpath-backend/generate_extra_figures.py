"""
generate_extra_figures.py
Generates additional diagrams for LogicPath Project Report:
 - Use Case Diagram (Fig 3.1)
 - ER Diagram (Fig 3.2)
 - DFD Level 0 (Fig 3.3)
 - DFD Level 1 (Fig 3.4)
"""

import os
from PIL import Image, ImageDraw, ImageFont

FIG_DIR = "report_figures"
os.makedirs(FIG_DIR, exist_ok=True)

try:
    FB = ImageFont.truetype("arialbd.ttf", 18)
    FM = ImageFont.truetype("arialbd.ttf", 14)
    FS = ImageFont.truetype("arial.ttf", 13)
    FSS = ImageFont.truetype("arial.ttf", 11)
    FT = ImageFont.truetype("arial.ttf", 15)
except Exception:
    FB = FM = FS = FSS = FT = ImageFont.load_default()


def rr(draw, xy, r, fill, outline, w=2):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=w)

def text_centered(draw, xy, text, font, fill):
    draw.text(xy, text, fill=fill, font=font, anchor="mm")

def arrow(draw, x1, y1, x2, y2, fill="#555"):
    draw.line([(x1, y1), (x2, y2)], fill=fill, width=2)
    # Arrowhead
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    sz = 10
    ax1 = x2 - sz * math.cos(ang - 0.4)
    ay1 = y2 - sz * math.sin(ang - 0.4)
    ax2 = x2 - sz * math.cos(ang + 0.4)
    ay2 = y2 - sz * math.sin(ang + 0.4)
    draw.polygon([(x2, y2), (ax1, ay1), (ax2, ay2)], fill=fill)

# =========================================================
# Use Case Diagram
# =========================================================
def gen_use_case():
    w, h = 1000, 760
    img = Image.new("RGB", (w, h), "#FAFAFA")
    d = ImageDraw.Draw(img)

    # Title
    d.rectangle([(0,0),(w,50)], fill="#1A237E")
    text_centered(d, (500, 25), "Use Case Diagram — LogicPath Platform", FB, "#FFFFFF")

    # System boundary box
    rr(d, (140, 70, 860, 700), 12, "#F0F4FF", "#3949AB", 2)
    text_centered(d, (500, 90), "LogicPath Learning & Circuit Design System", FM, "#283593")

    # Actor: Student (left)
    actor_fill = "#E3F2FD"
    d.ellipse((25, 140, 95, 200), fill=actor_fill, outline="#1565C0", width=2)
    text_centered(d, (60, 170), "S", FM, "#1565C0")
    # Body lines
    d.line([(60, 200), (60, 280)], fill="#1565C0", width=2)
    d.line([(20, 230), (100, 230)], fill="#1565C0", width=2)
    d.line([(60, 280), (30, 340)], fill="#1565C0", width=2)
    d.line([(60, 280), (90, 340)], fill="#1565C0", width=2)
    text_centered(d, (60, 360), "Student /", FS, "#1A237E")
    text_centered(d, (60, 378), "Learner", FS, "#1A237E")

    # Actor: Teacher (right)
    d.ellipse((905, 140, 975, 200), fill="#FFF3E0", outline="#E65100", width=2)
    text_centered(d, (940, 170), "T", FM, "#E65100")
    d.line([(940, 200), (940, 280)], fill="#E65100", width=2)
    d.line([(900, 230), (980, 230)], fill="#E65100", width=2)
    d.line([(940, 280), (910, 340)], fill="#E65100", width=2)
    d.line([(940, 280), (970, 340)], fill="#E65100", width=2)
    text_centered(d, (940, 360), "Teacher /", FS, "#E65100")
    text_centered(d, (940, 378), "Instructor", FS, "#E65100")

    # Use cases — column layout
    student_cases = [
        (330, 140, "UC01: Register & Login"),
        (330, 200, "UC02: Study Learning Path"),
        (330, 260, "UC03: Attempt Quiz"),
        (330, 320, "UC04: Design Circuit"),
        (330, 380, "UC05: Simulate Circuit"),
        (330, 440, "UC06: View Truth Table"),
        (330, 500, "UC07: Optimize Circuit"),
        (330, 560, "UC08: Submit Challenge"),
        (330, 620, "UC09: Post Discussion"),
        (330, 680, "UC10: Save / Load Circuit"),
    ]
    teacher_cases = [
        (630, 140, "UC11: Register & Login"),
        (630, 200, "UC12: Create Challenge"),
        (630, 260, "UC13: Verify Circuit"),
        (630, 320, "UC14: Publish Challenge"),
        (630, 380, "UC15: Review Submissions"),
        (630, 440, "UC16: Grade & Feedback"),
        (630, 500, "UC17: Reply Discussion"),
        (630, 560, "UC18: Manage Topics"),
        (630, 620, "UC19: View Dashboard"),
    ]

    for cx, cy, label in student_cases:
        d.ellipse((cx - 120, cy - 18, cx + 120, cy + 18), fill="#E8F5E9", outline="#2E7D32", width=1)
        text_centered(d, (cx, cy), label, FSS, "#1B5E20")
        d.line([(100, cy), (cx - 120, cy)], fill="#1565C0", width=1)

    for cx, cy, label in teacher_cases:
        d.ellipse((cx - 120, cy - 18, cx + 120, cy + 18), fill="#FFF8E1", outline="#F57F17", width=1)
        text_centered(d, (cx, cy), label, FSS, "#E65100")
        d.line([(cx + 120, cy), (900, cy)], fill="#E65100", width=1)

    # Shared use cases
    for cx, cy, label in [(330, 140, ""), (630, 140, "")]:
        # UC01 is shared
        pass

    img.save(os.path.join(FIG_DIR, "fig_usecase.png"))
    print("Generated fig_usecase.png")


# =========================================================
# ER Diagram
# =========================================================
def gen_er():
    w, h = 1060, 680
    img = Image.new("RGB", (w, h), "#FAFAFA")
    d = ImageDraw.Draw(img)

    d.rectangle([(0, 0), (w, 50)], fill="#1A237E")
    text_centered(d, (w//2, 25), "Entity-Relationship Diagram — LogicPath", FB, "#FFFFFF")

    # Helper: entity box
    def entity(cx, cy, name, attrs, fill="#E8EAF6", border="#3949AB"):
        bw, bh = 160, 30 + len(attrs) * 22
        x0, y0 = cx - bw//2, cy - bh//2
        rr(d, (x0, y0, x0 + bw, y0 + bh), 8, fill, border, 2)
        text_centered(d, (cx, y0 + 16), name, FM, border)
        d.line([(x0 + 6, y0 + 30), (x0 + bw - 6, y0 + 30)], fill=border, width=1)
        for i, attr in enumerate(attrs):
            d.text((x0 + 12, y0 + 34 + i * 22), attr, fill="#37474F", font=FSS)
        return x0, y0, x0 + bw, y0 + bh

    def rel(x1, y1, x2, y2, label, cx, cy):
        d.line([(x1, y1), (x2, y2)], fill="#607D8B", width=2)
        # Diamond shape for relationship
        dx, dy = (x1+x2)//2, (y1+y2)//2
        dm_sz = 20
        d.polygon([(dx, dy-dm_sz), (dx+dm_sz, dy), (dx, dy+dm_sz), (dx-dm_sz, dy)], fill="#FFF9C4", outline="#F57F17", width=1)
        d.text((cx, cy), label, fill="#4527A0", font=FSS)

    # Entities
    u = entity(160, 200, "USERS", ["user_id (PK)", "name", "email", "password_hash", "role", "created_at"])
    c = entity(430, 100, "CIRCUITS", ["circuit_id (PK)", "user_id (FK)", "name", "nodes (JSON)", "connections (JSON)", "created_at"])
    q = entity(720, 100, "QUESTIONS", ["question_id (PK)", "title", "topic_id", "level", "initial_circuit", "optimized_circuit", "status"])
    s = entity(720, 400, "SUBMISSIONS", ["submission_id (PK)", "question_id (FK)", "student_id (FK)", "circuit", "passed", "score", "teacher_feedback"])
    lp = entity(430, 580, "LEARNING_PROGRESS", ["progress_id (PK)", "user_id (FK)", "topic_id", "level", "quiz_score", "xp"])
    disc = entity(160, 500, "DISCUSSIONS", ["disc_id (PK)", "question_id (FK)", "user_id (FK)", "title", "replies (array)"])

    # Relationships with connector lines
    # User -> Circuits
    d.line([(u[2], 190), (c[0], 100)], fill="#607D8B", width=2)
    text_centered(d, (290, 140), "Owns (1..N)", FSS, "#D32F2F")

    # User -> Questions
    d.line([(u[2], 210), (q[0], 110)], fill="#607D8B", width=2)
    text_centered(d, (450, 145), "Creates (1..N)", FSS, "#D32F2F")

    # User -> Submissions
    d.line([(u[2], 230), (s[0], 380)], fill="#607D8B", width=2)
    text_centered(d, (355, 285), "Submits (1..N)", FSS, "#D32F2F")

    # User -> Progress
    d.line([(u[2], 260), (lp[0], 568)], fill="#607D8B", width=2)
    text_centered(d, (280, 420), "Tracks (1..N)", FSS, "#D32F2F")

    # User -> Discussions
    d.line([(u[2], 480), (disc[2], 500)], fill="#607D8B", width=2)
    text_centered(d, (295, 485), "Posts (1..N)", FSS, "#D32F2F")

    # Questions -> Submissions
    d.line([(q[0], 380), (s[2], 380)], fill="#607D8B", width=2)
    text_centered(d, (590, 362), "Has (1..N)", FSS, "#D32F2F")

    # Questions -> Discussions
    d.line([(q[0], 480), (disc[2], 500)], fill="#607D8B", width=2)

    img.save(os.path.join(FIG_DIR, "fig_er.png"))
    print("Generated fig_er.png")


# =========================================================
# DFD Level 0
# =========================================================
def gen_dfd0():
    w, h = 880, 480
    img = Image.new("RGB", (w, h), "#FAFAFA")
    d = ImageDraw.Draw(img)

    d.rectangle([(0, 0), (w, 50)], fill="#1A237E")
    text_centered(d, (w//2, 25), "Data Flow Diagram (Level 0 — Context Diagram) — LogicPath", FB, "#FFFFFF")

    # External entities
    def ext(cx, cy, label):
        rr(d, (cx-80, cy-28, cx+80, cy+28), 6, "#E8F5E9", "#2E7D32", 2)
        text_centered(d, (cx, cy), label, FM, "#1B5E20")

    # Central process
    d.ellipse((300, 165, 580, 315), fill="#E3F2FD", outline="#1565C0", width=3)
    text_centered(d, (440, 230), "0.0", FM, "#0D47A1")
    text_centered(d, (440, 255), "LogicPath", FM, "#0D47A1")
    text_centered(d, (440, 278), "Platform", FS, "#0D47A1")

    ext(100, 145, "Student / Learner")
    ext(100, 330, "Teacher / Instructor")
    ext(780, 240, "MongoDB Database")

    # Arrows
    arrow(d, 180, 155, 302, 210, "#388E3C")
    d.text((170, 130), "Learn, Design, Submit", fill="#388E3C", font=FSS)
    arrow(d, 302, 255, 180, 330, "#388E3C")
    d.text((155, 342), "Results, Grades, Feedback", fill="#388E3C", font=FSS)

    arrow(d, 180, 338, 302, 270, "#E65100")
    d.text((140, 370), "Create Questions, Grade", fill="#E65100", font=FSS)
    arrow(d, 302, 225, 180, 165, "#E65100")
    d.text((155, 118), "Published Challenges, Reports", fill="#E65100", font=FSS)

    arrow(d, 578, 242, 700, 242, "#1565C0")
    d.text((590, 218), "Persist Data", fill="#1565C0", font=FSS)
    arrow(d, 700, 260, 578, 260, "#1565C0")
    d.text((590, 268), "Retrieve Data", fill="#1565C0", font=FSS)

    img.save(os.path.join(FIG_DIR, "fig_dfd0.png"))
    print("Generated fig_dfd0.png")


# =========================================================
# DFD Level 1
# =========================================================
def gen_dfd1():
    w, h = 1060, 720
    img = Image.new("RGB", (w, h), "#FAFAFA")
    d = ImageDraw.Draw(img)

    d.rectangle([(0, 0), (w, 50)], fill="#1A237E")
    text_centered(d, (w//2, 25), "Data Flow Diagram (Level 1) — LogicPath Subsystems", FB, "#FFFFFF")

    # Processes (ellipses)
    processes = [
        (160, 145, "1.0\nAuth &\nUser Mgmt"),
        (400, 145, "2.0\nLearning &\nCurriculum"),
        (650, 145, "3.0\nCircuit\nCanvas"),
        (160, 430, "4.0\nSimulate &\nTruth Table"),
        (400, 430, "5.0\nOptimize &\nVerify"),
        (650, 430, "6.0\nChallenge\nEvaluation"),
    ]

    for px, py, label in processes:
        d.ellipse((px-100, py-55, px+100, py+55), fill="#E8EAF6", outline="#3949AB", width=2)
        for i, ln in enumerate(label.split("\n")):
            lh = (len(label.split("\n")) - 1) * 16
            text_centered(d, (px, py - lh//2 + i*16), ln, FSS, "#1A237E")

    # Data stores
    def store(cx, cy, name):
        d.rectangle([(cx-90, cy-16), (cx+90, cy+16)], fill="#E0F2F1", outline="#00695C", width=1)
        text_centered(d, (cx, cy), name, FSS, "#004D40")

    store(900, 145, "D1: users")
    store(900, 300, "D2: circuits")
    store(900, 430, "D3: questions")
    store(900, 560, "D4: submissions")
    store(530, 620, "D5: learning_progress")
    store(160, 600, "D6: discussions")

    # Student entity
    d.rectangle([(20, 220), (120, 260)], fill="#E8F5E9", outline="#2E7D32", width=2)
    text_centered(d, (70, 240), "Student", FS, "#1B5E20")

    # Teacher entity
    d.rectangle([(940, 220), (1040, 260)], fill="#FFF3E0", outline="#E65100", width=2)
    text_centered(d, (990, 240), "Teacher", FS, "#E65100")

    # Flows
    arrow(d, 70, 220, 100, 175, "#388E3C")
    arrow(d, 220, 150, 300, 150, "#555")
    arrow(d, 500, 150, 550, 150, "#555")
    arrow(d, 750, 145, 810, 145, "#555")
    arrow(d, 160, 200, 160, 375, "#555")
    arrow(d, 400, 200, 400, 375, "#555")
    arrow(d, 650, 200, 650, 375, "#555")
    arrow(d, 260, 430, 300, 430, "#555")
    arrow(d, 500, 430, 550, 430, "#555")
    arrow(d, 750, 430, 810, 430, "#555")
    arrow(d, 160, 485, 160, 585, "#555")
    arrow(d, 400, 485, 470, 608, "#555")
    arrow(d, 990, 220, 760, 145, "#E65100")

    img.save(os.path.join(FIG_DIR, "fig_dfd1.png"))
    print("Generated fig_dfd1.png")


if __name__ == "__main__":
    gen_use_case()
    gen_er()
    gen_dfd0()
    gen_dfd1()
