"""
LogicPath Final Project Report Builder
Matches exactly the format of the VoxPop / CET / Don Bosco project report:
- Cover page with college emblem
- Declaration, Certificate, Acknowledgement, Abstract
- Table of Contents (with page numbers)
- Chapter divider pages (full page, centered, as in VoxPop)
- All chapter content with proper headings
- Page numbers at bottom
- Headers on content pages
- All sections: Intro, System Analysis, System Design (DFD/ER/Use Case/Table Design),
  Coding, Testing, System Implementation, Conclusion, References, Appendix
"""

import os, sys
import docx
from docx.shared import Inches, Pt, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUT = os.path.abspath(r"..\LogicPath_Project_Report.docx")
FIG_DIR  = os.path.abspath(r"report_figures")

# ─────────────────────────────────────────────────────────────
# UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────
def set_cell_bg(cell, hex_color):
    tcp = cell._tc.get_or_add_tcPr()
    tcp.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))

def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
    tcp = cell._tc.get_or_add_tcPr()
    tcp.append(parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    ))

def add_page_number(paragraph):
    """Inserts PAGE / NUMPAGES fields into a paragraph."""
    run = paragraph.add_run()
    fldChar = OxmlElement('w:fldChar')
    fldChar.set(qn('w:fldCharType'), 'begin')
    run._r.append(fldChar)

    instrText = OxmlElement('w:instrText')
    instrText.text = 'PAGE'
    run._r.append(instrText)

    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'end')
    run._r.append(fldChar2)

def add_footer_page_numbers(doc):
    """Add page number footer to all sections."""
    for section in doc.sections:
        footer = section.footer
        footer.is_linked_to_previous = False
        # Clear existing
        for p in footer.paragraphs:
            p.clear()
        fp = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        fp.paragraph_format.space_before = Pt(4)
        run = fp.add_run()
        run.font.name = "Times New Roman"
        run.font.size = Pt(10)
        add_page_number(fp)

def add_header_text(doc, text):
    """Add running header with project title."""
    for section in doc.sections:
        header = section.header
        header.is_linked_to_previous = False
        for p in header.paragraphs:
            p.clear()
        hp = header.paragraphs[0] if header.paragraphs else header.add_paragraph()
        hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        hp.paragraph_format.space_after = Pt(0)
        hp.paragraph_format.space_before = Pt(0)
        run = hp.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(10)
        # Add a bottom border to header
        pPr = hp._p.get_or_add_pPr()
        pBdr = OxmlElement('w:pBdr')
        bottom = OxmlElement('w:bottom')
        bottom.set(qn('w:val'), 'single')
        bottom.set(qn('w:sz'), '6')
        bottom.set(qn('w:space'), '1')
        bottom.set(qn('w:color'), '000000')
        pBdr.append(bottom)
        pPr.append(pBdr)

def para(doc, text="", bold=False, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
         space_before=2, space_after=6, line_spacing=1.3, indent=0, color=None):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if indent:
        p.paragraph_format.left_indent = Inches(indent)
    if text:
        run = p.add_run(text)
        run.bold = bold
        run.font.name = "Times New Roman"
        run.font.size = Pt(size)
        if color:
            run.font.color.rgb = RGBColor(*color)
    return p

def heading(doc, text, level=1):
    sizes = {1: 15, 2: 13, 3: 12}
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_before = Pt({1: 18, 2: 14, 3: 11}[level])
    p.paragraph_format.space_after = Pt({1: 10, 2: 8, 3: 6}[level])
    run = p.add_run(text)
    run.bold = True
    run.font.name = "Times New Roman"
    run.font.size = Pt(sizes[level])
    return p

def chapter_divider(doc, num, title):
    """Full-page chapter divider matching VoxPop style."""
    doc.add_page_break()
    # Blank space at top
    for _ in range(8):
        para(doc, space_before=0, space_after=0)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(30)
    run = p.add_run(f"{num}  {title.upper()}")
    run.font.name = "Times New Roman"
    run.font.size = Pt(22)
    run.bold = True
    doc.add_page_break()

def bullet(doc, text, indent=0.25):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent = Inches(indent)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)
    return p

def bold_bullet(doc, title, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r1 = p.add_run(title)
    r1.bold = True
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(12)
    r2 = p.add_run(text)
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(12)
    return p

def figure(doc, img_path, num, caption, width=5.5):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(12)
    p_img.paragraph_format.space_after = Pt(6)
    p_img.paragraph_format.keep_with_next = True
    p_img.add_run().add_picture(img_path, width=Inches(width))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(4)
    p_cap.paragraph_format.space_after = Pt(16)
    r1 = p_cap.add_run(f"Figure {num}: ")
    r1.bold = True; r1.font.name = "Times New Roman"; r1.font.size = Pt(11)
    r2 = p_cap.add_run(caption)
    r2.font.name = "Times New Roman"; r2.font.size = Pt(11)

def table(doc, headers, rows, col_widths=None, caption_num=None, caption=None):
    if caption_num:
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(10)
        p_cap.paragraph_format.space_after = Pt(4)
        p_cap.paragraph_format.keep_with_next = True
        r1 = p_cap.add_run(f"Table {caption_num}: ")
        r1.bold = True; r1.font.name="Times New Roman"; r1.font.size=Pt(11)
        r2 = p_cap.add_run(caption)
        r2.font.name="Times New Roman"; r2.font.size=Pt(11)

    t = doc.add_table(rows=len(rows)+1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    # Header row
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        set_cell_bg(c, "2C3E50")
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True; r.font.name="Times New Roman"; r.font.size=Pt(10)
        r.font.color.rgb = RGBColor(255,255,255)
    # Data rows
    for ri, row in enumerate(rows):
        bg = "FFFFFF" if ri%2==0 else "F4F6F7"
        for ci, val in enumerate(row):
            c = t.rows[ri+1].cells[ci]
            set_cell_bg(c, bg)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(str(val))
            r.font.name="Times New Roman"; r.font.size=Pt(10)
    if col_widths:
        for row in t.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def code_block(doc, code):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    t.columns[0].width = Inches(6.2)
    c = t.cell(0, 0)
    set_cell_bg(c, "F5F5F5")
    set_cell_margins(c, top=120, bottom=120, left=180, right=180)
    p = c.paragraphs[0]
    p.paragraph_format.line_spacing = 1.1
    run = p.add_run(code.strip())
    run.font.name = "Consolas"
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(33,37,41)
    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(6)


# ─────────────────────────────────────────────────────────────
# BUILD DOCUMENT
# ─────────────────────────────────────────────────────────────
print("Initialising document...")
doc = docx.Document()
doc.styles['Normal'].font.name = 'Times New Roman'
doc.styles['Normal'].font.size = Pt(12)

for sec in doc.sections:
    sec.top_margin    = Inches(1.0)
    sec.bottom_margin = Inches(1.0)
    sec.left_margin   = Inches(1.25)
    sec.right_margin  = Inches(1.0)

# ═══════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════
para(doc, "A PROJECT REPORT ON", bold=True, size=14,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=30, space_after=16)

para(doc, "LOGICPATH", bold=True, size=22,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=16,
     color=(0, 51, 153))

para(doc, "Design and Implementation of an Interactive Digital Circuit\nDesign, Simulation, and Optimization Platform",
     bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22)

para(doc, "Submitted in partial fulfilment of the requirement for award of the degree",
     size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4)
para(doc, "Of", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4)
para(doc, "Master of Computer Applications", bold=True, size=13,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4)
para(doc, "Of", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4)
para(doc, "APJ Abdul Kalam Technological University", bold=True, size=13,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22)

para(doc, "By", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=8)
para(doc, "NANDHANA SUDHEER C", bold=True, size=15,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4)
para(doc, "REG. NO: TVE25MCA-2051", bold=True, size=13,
     align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22)

para(doc, "UNDER THE SUPERVISION AND GUIDANCE OF",
     size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6)
para(doc, "Prof. Sunitha D\nAssistant Professor, Department of Computer Applications",
     bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22)

# College Emblem
logo_path = os.path.join(FIG_DIR, "cet_logo.png")
if os.path.exists(logo_path):
    pl = doc.add_paragraph()
    pl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pl.paragraph_format.space_before = Pt(6)
    pl.paragraph_format.space_after = Pt(14)
    pl.add_run().add_picture(logo_path, width=Inches(1.4))

para(doc, "DEPARTMENT OF COMPUTER APPLICATIONS\nCOLLEGE OF ENGINEERING TRIVANDRUM\nTHIRUVANANTHAPURAM — 695016\n2026",
     bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=0)

# ═══════════════════════════════════════════════════════════════
# DECLARATION
# ═══════════════════════════════════════════════════════════════
doc.add_page_break()
for _ in range(6): para(doc)
para(doc, "DECLARATION", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=0, space_after=30)

para(doc,
    'I, NANDHANA SUDHEER C, second semester MCA student of College of Engineering Trivandrum '
    'under APJ Abdul Kalam Technological University, do hereby declare that the project titled '
    '"LOGICPATH: Design and Implementation of an Interactive Digital Circuit Design, Simulation, '
    'and Optimization Platform" is the original work carried out by me under the supervision of '
    'Prof. Sunitha D, Assistant Professor, Department of Computer Applications, College of '
    'Engineering Trivandrum, in partial fulfilment of the requirement for the award of the degree '
    'of Master of Computer Applications, APJ Abdul Kalam Technological University.',
    size=12, space_before=0, space_after=12)

para(doc,
    'This project has not previously formed the basis for the award of any degree, diploma, or '
    'similar title of any University or Institution.',
    size=12, space_before=0, space_after=60)

# Sign-off
p_loc = para(doc, "Place : Thiruvananthapuram", size=12, space_before=0, space_after=4)
p_date = para(doc, "Date  : ", size=12, space_before=0, space_after=40)

p_name = doc.add_paragraph()
p_name.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = p_name.add_run("NANDHANA SUDHEER C")
r.bold = True; r.font.name="Times New Roman"; r.font.size=Pt(12)

# ═══════════════════════════════════════════════════════════════
# CERTIFICATE
# ═══════════════════════════════════════════════════════════════
doc.add_page_break()
para(doc, "COLLEGE OF ENGINEERING TRIVANDRUM\nTHIRUVANANTHAPURAM\n695016",
     bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=20, space_after=10)

if os.path.exists(logo_path):
    pl = doc.add_paragraph()
    pl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pl.paragraph_format.space_before = Pt(0)
    pl.paragraph_format.space_after = Pt(10)
    pl.add_run().add_picture(logo_path, width=Inches(1.2))

para(doc, "CERTIFICATE", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=0, space_after=20)

para(doc,
    'This is to certify that the project report titled "LogicPath: Design and Implementation of '
    'an Interactive Digital Circuit Design, Simulation, and Optimization Platform" submitted by '
    'Nandhana Sudheer C (Reg. No. TVE25MCA-2051) to the APJ Abdul Kalam Technological University '
    'in partial fulfilment of the requirements for the award of the Degree of Master of Computer '
    'Applications is a Bonafide record of the project work carried out by her under my guidance '
    'and supervision. This report in any form has not been submitted to any other University or '
    'Institute for any purpose.',
    size=12, space_before=0, space_after=60)

# Signature table
sig_tbl = doc.add_table(rows=2, cols=2)
sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
sig_tbl.autofit = False
for row in sig_tbl.rows:
    for cell in row.cells:
        cell.width = Inches(3.0)

def sig_cell(cell, lines, align=WD_ALIGN_PARAGRAPH.LEFT):
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    for i, line in enumerate(lines):
        if i > 0:
            p.add_run("\n")
        r = p.add_run(line)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)

sig_cell(sig_tbl.cell(0, 0), ["Project Guide", "Prof. Sunitha D", "Assistant Professor",
                                "Dept. of Computer Applications", "CET Thiruvananthapuram"])
sig_cell(sig_tbl.cell(0, 1), ["External Examiner", "", "", ""],
         WD_ALIGN_PARAGRAPH.RIGHT)
sig_cell(sig_tbl.cell(1, 0), ["Head of the Department", "Dr. Liji P I",
                                "Department of Computer Applications",
                                "College of Engineering Trivandrum"])

# ═══════════════════════════════════════════════════════════════
# ACKNOWLEDGEMENT
# ═══════════════════════════════════════════════════════════════
doc.add_page_break()
for _ in range(2): para(doc)
para(doc, "ACKNOWLEDGEMENT", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=0, space_after=24)

ack_paras = [
    "First and foremost, I thank God Almighty and my parents for their constant blessings and "
    "support throughout the successful completion of this project.",
    "I am extremely thankful to Dr. Suresh K, Principal, College of Engineering Trivandrum, for "
    "providing the best academic facilities and infrastructure for carrying out this project work.",
    "I express my sincere gratitude to Dr. Liji P I, Head of the Department of Computer "
    "Applications, for her constant encouragement and invaluable guidance during the course of "
    "this project.",
    "I owe my deepest gratitude to Prof. Sunitha D, Assistant Professor, Department of Computer "
    "Applications, College of Engineering Trivandrum, for her expert supervision, constant "
    "support, and constructive advice, which were instrumental in the successful completion of "
    "this project.",
    "I profusely thank all the faculty members of the Department of Computer Applications, "
    "College of Engineering Trivandrum, for their encouragement and inspiration throughout the "
    "course of this study.",
    "I also express heartfelt thanks to my friends and classmates for their moral support and "
    "for sharing their knowledge whenever needed. I am grateful to my beloved parents and "
    "relatives, whose unwavering encouragement and blessings have been a constant source of "
    "strength at every step of this project.",
]
for t in ack_paras:
    para(doc, t, size=12, space_before=0, space_after=10)

for _ in range(3): para(doc)
p_ack = doc.add_paragraph()
p_ack.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = p_ack.add_run("Nandhana Sudheer C")
r.bold = True; r.font.name="Times New Roman"; r.font.size=Pt(12)

# ═══════════════════════════════════════════════════════════════
# ABSTRACT
# ═══════════════════════════════════════════════════════════════
doc.add_page_break()
for _ in range(2): para(doc)
para(doc, "ABSTRACT", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=0, space_after=20)

abstract_paras = [
    "LogicPath is an interactive, browser-based digital circuit design, simulation, and "
    "optimization platform developed to bridge theoretical digital electronics education with "
    "hands-on computer-aided engineering experimentation. Traditional digital logic simulators "
    "are either platform-dependent desktop applications lacking structured pedagogy, or simple "
    "web-based drawing tools without automated circuit verification. LogicPath addresses these "
    "limitations through a full-stack web architecture comprising a Python Flask REST application "
    "server, a custom Directed Acyclic Graph (DAG) simulation engine, and a React 18 single-page "
    "application with an interactive drag-and-drop circuit canvas.",

    "The core logic engine converts user-constructed circuit schematics into directed graph "
    "representations. Circuit structural integrity is enforced through port-degree validation and "
    "combinational cycle detection using Tarjan's Depth-First Search algorithm. Valid circuits are "
    "topologically sorted and simulated across all 2^N binary input combinations, generating "
    "dynamic truth tables and extracting canonical Boolean algebraic expressions. An automated "
    "Boolean Optimization Engine applies algebraic laws including Absorption, Identity, "
    "Annihilation, and De Morgan's theorems to synthesize simplified circuit structures.",

    "LogicPath integrates a dual-role Learning Management System. The Student Portal provides a "
    "15-topic curriculum across 4 mastery tiers governed by an 80% competency unlock gate. An "
    "automated circuit verifier validates student submissions through deterministic truth table "
    "equivalence checking. The Instructor Portal allows teachers to create circuit challenges, "
    "verify them before publishing, grade student submissions, and manage threaded discussion "
    "forums. All data is persisted via MongoDB with automatic local fallback.",

    "The platform achieved 100% pass rate across all 40 automated backend tests and 24 "
    "teacher-student integration tests. This report documents the complete engineering lifecycle "
    "of LogicPath covering system analysis, design, implementation, testing, and future scope.",
]
for t in abstract_paras:
    para(doc, t, size=12, space_before=0, space_after=10)

p_kw = doc.add_paragraph()
p_kw.paragraph_format.space_before = Pt(12)
p_kw.paragraph_format.space_after = Pt(10)
p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
rk = p_kw.add_run("Keywords: ")
rk.bold = True; rk.font.name="Times New Roman"; rk.font.size=Pt(12)
rkt = p_kw.add_run(
    "Digital Logic Simulation, Boolean Optimization, Graph-Based Circuit Engine, "
    "Truth Table Generation, STEM Education, React, Flask, MongoDB"
)
rkt.font.name="Times New Roman"; rkt.font.size=Pt(12)

# ═══════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════
doc.add_page_break()
para(doc, "CONTENTS", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=20, space_after=16)

# Column header
toc_hdr = doc.add_table(rows=1, cols=3)
toc_hdr.alignment = WD_TABLE_ALIGNMENT.CENTER
toc_hdr.autofit = False
for cell, text, w in zip(toc_hdr.rows[0].cells, ["Chapters", "Contents", "Page No"], [1.0, 4.5, 1.0]):
    set_cell_bg(cell, "2C3E50")
    set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
    cell.width = Inches(w)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    r.bold = True; r.font.name="Times New Roman"; r.font.size=Pt(11)
    r.font.color.rgb = RGBColor(255,255,255)

toc_entries = [
    ("", "Declaration",                        ""),
    ("", "Certificate",                        ""),
    ("", "Acknowledgement",                    ""),
    ("", "Abstract",                           ""),
    ("", "List of Figures",                    ""),
    ("", "List of Tables",                     ""),
    ("1", "INTRODUCTION",                      "1"),
    ("2", "SYSTEM ANALYSIS",                   "7"),
    ("2.1", "Existing System",                 "8"),
    ("2.1.1", "Disadvantages of Existing System", "8"),
    ("2.2", "Proposed System",                 "9"),
    ("2.2.1", "Advantages of Proposed System", "10"),
    ("2.3", "Feasibility Study",               "11"),
    ("2.3.1", "Technical & Operational Feasibility", "11"),
    ("2.3.2", "Economic Feasibility",          "12"),
    ("2.3.3", "Operational Feasibility",       "12"),
    ("2.4", "System Specification",            "13"),
    ("2.4.1", "Software Specification",        "13"),
    ("2.4.2", "Hardware Specification",        "14"),
    ("2.5", "Identification of Actors",        "15"),
    ("2.6", "Identification of Use Cases",     "15"),
    ("2.6.1", "Use Case Diagram",              "17"),
    ("3", "SYSTEM DESIGN",                     "19"),
    ("3.1", "Introduction",                    "20"),
    ("3.2", "Database Design",                 "20"),
    ("3.3", "Table Design",                    "21"),
    ("3.4", "Data Flow Diagram",               "25"),
    ("3.5", "ER Diagram",                      "33"),
    ("4", "CODING",                            "36"),
    ("4.1", "Input Interface",                 "37"),
    ("4.2", "Output Interface",                "37"),
    ("4.3", "Software Description",            "37"),
    ("4.3.1", "Python",                        "37"),
    ("4.3.2", "Flask",                         "38"),
    ("4.3.3", "React",                         "39"),
    ("4.3.4", "MongoDB",                       "40"),
    ("4.4", "Frontend Pages",                  "42"),
    ("4.5", "Backend Implementation",          "48"),
    ("5", "CODING (SOURCE CODE)",              "54"),
    ("5.1", "Logic Engine Module",             "55"),
    ("5.2", "Circuit Verifier Module",         "60"),
    ("5.3", "Authentication Module",           "63"),
    ("6", "SYSTEM TESTING",                    "66"),
    ("6.1", "Testing and Evaluation",          "67"),
    ("6.2", "Testing Strategies",              "68"),
    ("6.3", "Testing Techniques",              "69"),
    ("6.3.1", "Black Box Testing",             "69"),
    ("6.3.2", "Unit Testing",                  "70"),
    ("6.3.3", "Integration Testing",           "70"),
    ("6.3.4", "Acceptance Testing",            "71"),
    ("6.3.5", "Output Testing",                "72"),
    ("7", "SYSTEM IMPLEMENTATION AND DEPLOYMENT", "73"),
    ("8", "CONCLUSION",                        "75"),
    ("9", "REFERENCES",                        "79"),
    ("10", "APPENDIX",                         "81"),
]

for ch, content, pg in toc_entries:
    row_tbl = doc.add_table(rows=1, cols=3)
    row_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    row_tbl.autofit = False
    for cell, val, w, align in [
        (row_tbl.rows[0].cells[0], ch, 1.0, WD_ALIGN_PARAGRAPH.CENTER),
        (row_tbl.rows[0].cells[1], content, 4.5, WD_ALIGN_PARAGRAPH.LEFT),
        (row_tbl.rows[0].cells[2], pg, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    ]:
        cell.width = Inches(w)
        set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = align
        r = p.add_run(val)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        is_major = ch in [str(i) for i in range(1, 11)] and len(ch) <= 2
        if is_major:
            r.bold = True
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(0)

# LIST OF FIGURES
doc.add_page_break()
para(doc, "LIST OF FIGURES", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=20, space_after=16)

figs = [
    ("2.1", "Use Case Diagram — LogicPath Platform"),
    ("3.1", "Data Flow Diagram (Level 0 — Context Diagram)"),
    ("3.2", "Data Flow Diagram (Level 1 — LogicPath Subsystems)"),
    ("3.3", "Entity-Relationship Diagram"),
    ("4.1", "High-Level System Architecture"),
    ("4.2", "Circuit Processing Lifecycle Data Flow"),
    ("4.3", "User Interface — Authentication and Student Dashboard"),
    ("4.4", "User Interface — Circuit Canvas and Simulation Analysis"),
    ("4.5", "Instructor Observability and Discussion Dashboard"),
]
for num, caption in figs:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(f"Fig {num}  —  {caption}")
    r.font.name = "Times New Roman"; r.font.size = Pt(11)

# LIST OF TABLES
para(doc, "", space_before=20)
para(doc, "LIST OF TABLES", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER,
     space_before=0, space_after=16)
tbls = [
    ("2.1", "Software Specification"),
    ("2.2", "Hardware Specification"),
    ("3.1", "User Collection Schema"),
    ("3.2", "Circuits Collection Schema"),
    ("3.3", "Questions Collection Schema"),
    ("3.4", "Submissions Collection Schema"),
    ("3.5", "Learning Progress Collection Schema"),
    ("3.6", "Discussions Collection Schema"),
    ("3.7", "Logic Gate Specifications"),
    ("6.1", "Test Cases — Authentication and User Management"),
    ("6.2", "Test Cases — Circuit Simulation and Verification"),
    ("6.3", "Test Cases — Challenge and Learning System"),
]
for num, caption in tbls:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(f"Table {num}  —  {caption}")
    r.font.name = "Times New Roman"; r.font.size = Pt(11)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 1: INTRODUCTION
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 1, "INTRODUCTION")

para(doc, "Software Development Model Used : AGILE MODEL", bold=True, size=13,
     space_before=0, space_after=10)

para(doc,
    "The Agile development model is an iterative and incremental approach to software engineering "
    "that prioritises customer collaboration, working deliverables, and rapid adaptability over "
    "rigid upfront planning. LogicPath was developed using the Agile methodology, progressing "
    "through short development sprints that each produced a functional, testable increment of the "
    "platform.",
    size=12, space_before=0, space_after=8)

heading(doc, "Phases of Agile Development Applied to LogicPath", 2)
numbered_items = [
    ("1. Concept and Planning Phase",
     "Identified the core problem — fragmented digital logic education — and defined project goals, "
     "user roles (Student, Teacher), key features (simulation engine, LMS, circuit canvas), "
     "and technology choices (Flask, React, MongoDB)."),
    ("2. Design Phase",
     "Designed the circuit graph data model, REST API contract, MongoDB collection schemas, "
     "React component hierarchy, and SVG-based wiring renderer architecture."),
    ("3. Development Sprints",
     "Sprint 1: Core logic engine (gate evaluation, cycle detection, topological simulation). "
     "Sprint 2: REST API, authentication, and MongoDB integration. "
     "Sprint 3: React circuit canvas and simulation UI. "
     "Sprint 4: Learning LMS, challenge system, and teacher portal. "
     "Sprint 5: Optimization engine, discussion forums, and end-to-end testing."),
    ("4. Testing Phase",
     "Each sprint included automated unit and integration tests. Final end-to-end system tests "
     "verified 100% functional coverage across all platform features."),
    ("5. Review and Feedback Phase",
     "Sprint reviews evaluated circuit simulation accuracy, verifier precision, and UI usability. "
     "Feedback was incorporated into subsequent iterations."),
    ("6. Maintenance Phase",
     "Post-delivery maintenance includes database seeding, performance profiling, and "
     "documentation of the RESTful API contract for future contributors."),
]
for title, content in numbered_items:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.line_spacing = 1.25
    r1 = p.add_run(title + "\n")
    r1.bold = True; r1.font.name="Times New Roman"; r1.font.size=Pt(12)
    r2 = p.add_run(content)
    r2.font.name="Times New Roman"; r2.font.size=Pt(12)

heading(doc, "Project Overview", 2)
para(doc,
    "LogicPath is a full-stack, browser-native digital circuit design, simulation, and "
    "optimization platform designed specifically for computer science and engineering education. "
    "It eliminates the traditional gap between textbook Boolean algebra and practical circuit "
    "experimentation by providing an all-in-one environment for designing, simulating, debugging, "
    "and optimising digital logic circuits directly in the web browser.",
    size=12, space_before=0, space_after=8)

para(doc,
    "At its core, LogicPath models every user-constructed circuit as a formal Directed Acyclic "
    "Graph (DAG) data structure. Gate components become graph nodes carrying type, label, and "
    "coordinate metadata, while signal wires become directed edges encoding source-to-destination "
    "connectivity. This graph-theoretic foundation enables the platform to perform rigorous "
    "combinational cycle detection using Tarjan's algorithm, determine valid evaluation orders "
    "through topological sorting (Kahn's algorithm), propagate binary signal values "
    "level-by-level from primary inputs to primary outputs, generate exhaustive 2^N truth "
    "tables, and extract canonical Boolean algebraic expressions through recursive tree traversal.",
    size=12, space_before=0, space_after=8)

para(doc,
    "The platform integrates a dual-role academic management system built directly into the "
    "application. Students follow a structured, 15-topic digital logic curriculum spanning four "
    "increasing difficulty tiers (Beginner, Intermediate, Advanced, Master). Each level is "
    "unlocked only after achieving at least 80% on the preceding tier's assessment, "
    "ensuring genuine competency before progression. Teachers use a dedicated instructor portal "
    "to author circuit design challenges, verify the solvability of their reference solutions "
    "through automated equivalence testing, publish problems to enrolled students, and review "
    "student submissions with numerical scores and written feedback.",
    size=12, space_before=0, space_after=8)

heading(doc, "Motivation or Relevance", 2)
motivations = [
    ("Efficiency and Accuracy — ", "Traditional paper-based circuit analysis is slow and prone to "
     "human error. LogicPath automates signal propagation and truth table evaluation, providing "
     "immediate and accurate feedback."),
    ("Security and Integrity — ", "Academic circuit challenges are protected by role-based JWT "
     "authentication. Reference solutions are cryptographically withheld from student API "
     "responses until submissions are evaluated."),
    ("Accessibility — ", "Students access the full platform from any modern web browser without "
     "installing Java runtimes, EDA tools, or any client-side software."),
    ("Transparency and Trust — ", "Boolean optimization steps are explicitly explained with rule "
     "names and quantitative metrics, building learner understanding rather than treating "
     "minimization as an opaque black box."),
    ("Environmental Sustainability — ", "Eliminating physical breadboarding laboratories and "
     "paper-based assessments reduces resource consumption significantly."),
    ("Automated Assessment Analytics — ", "The platform continuously tracks student XP, "
     "quiz scores, circuit submission pass rates, and topic completion, enabling data-driven "
     "instructional interventions."),
]
for title, text in motivations:
    bold_bullet(doc, title, text)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 2: SYSTEM ANALYSIS
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 2, "SYSTEM ANALYSIS")

heading(doc, "Introduction", 2)
para(doc,
    "System analysis is the process of examining and evaluating a system to understand its "
    "components, interactions, and effectiveness. It involves gathering requirements, identifying "
    "problems in existing approaches, and defining specifications for an improved solution. This "
    "chapter analyses the existing digital circuit simulation ecosystem, identifies its "
    "limitations, proposes LogicPath as a comprehensive improvement, and conducts a detailed "
    "feasibility study.",
    size=12, space_before=0, space_after=8)

heading(doc, "2.1   Existing System", 1)
para(doc,
    "The existing digital electronics education ecosystem relies on three major tool categories:",
    size=12, space_before=0, space_after=6)

bold_bullet(doc, "Desktop Simulators (Logisim, Logisim-Evolution): ",
    "Require Java runtime installation. Suffer from platform incompatibilities on modern operating "
    "systems. Lack server integration for cloud saving, curriculum management, or automated grading.")

bold_bullet(doc, "Industrial EDA Suites (Quartus Prime, Xilinx Vivado): ",
    "Designed for experienced VHDL/Verilog engineers. Multi-gigabyte footprints and steep learning "
    "curves overwhelm undergraduate students learning gate-level Boolean logic.")

bold_bullet(doc, "Basic Web Simulators (CircuitVerse): ",
    "Provide canvas drawing but operate as isolated tools without curriculum alignment, mastery "
    "gating, automated equivalence grading, or explainable optimization.")

heading(doc, "2.1.1   Disadvantages of the Existing System", 2)
for d_text in [
    "Absence of automated circuit verification — instructors manually inspect each student schematic.",
    "Lack of explainable optimization — simplification is opaque with no algebraic step-by-step explanation.",
    "No structured pedagogical progression — beginners face overwhelming component libraries without scaffolding.",
    "Unstructured teacher-student feedback loops — require external messaging platforms.",
    "Platform dependency — Java-based tools malfunction on modern OS versions.",
    "Vulnerability to simulation hangs — combinational feedback loops cause infinite loops or crashes.",
    "No integrated learning assessment — quiz systems, XP tracking, and curriculum gating are absent.",
]:
    bullet(doc, d_text)

heading(doc, "2.2   Proposed System", 1)
para(doc,
    "LogicPath is proposed as an integrated, web-native platform combining a high-performance "
    "graph simulation engine with a full-fledged educational management system. Key innovations include:",
    size=12, space_before=0, space_after=6)

bold_bullet(doc, "Graph-Theoretic Circuit Simulation: ",
    "Circuits are modelled as DAGs G = (V, E). Tarjan's DFS detects cyclic dependencies in "
    "O(V + E) time, Kahn's algorithm determines topological evaluation order.")

bold_bullet(doc, "Exhaustive 2^N Truth Table Generation: ",
    "The simulator evaluates all binary input combinations, producing complete truth tables and "
    "multi-output Boolean expression extraction.")

bold_bullet(doc, "Explainable Boolean Optimization: ",
    "Rule-based simplification engine applies Absorption, Identity, De Morgan's, and Annihilation "
    "laws with transparent gate-count and depth comparison.")

bold_bullet(doc, "Dual-Role Academic LMS: ",
    "Students progress through 15-topic, 4-tier curriculum with 80% competency gating. Teachers "
    "author, verify, publish, and grade circuit challenges.")

bold_bullet(doc, "In-Platform Discussion Forums: ",
    "Threaded Q&A linked directly to circuit problems enables direct instructor mentoring.")

heading(doc, "2.2.1   Advantages of Proposed System", 2)
for a_text in [
    "Zero-installation access — runs in any modern web browser.",
    "Deterministic equivalence grading — 2^N state verification against hidden reference designs.",
    "Educational transparency — step-by-step Boolean optimization with algebraic rule naming.",
    "Robust cycle guard — combinational loops caught before simulation without runtime crashes.",
    "JWT security and bcrypt password hashing for enterprise-grade data protection.",
    "Persistent circuit saving, version history, and MongoDB cloud storage.",
    "Gamified XP system motivates student engagement and progress tracking.",
]:
    bullet(doc, a_text)

heading(doc, "2.3   Feasibility Study", 1)
para(doc,
    "A feasibility study evaluates the practicality and viability of a proposed project across "
    "technical, economic, and operational dimensions.",
    size=12, space_before=0, space_after=8)

heading(doc, "2.3.1   Technical and Operational Feasibility", 2)
para(doc,
    "LogicPath is built entirely on mature, well-documented open-source technologies: Python 3.13, "
    "Flask 3.1, React 18, Vite 8.2, and MongoDB 6. All components are cross-platform and run "
    "on standard cloud infrastructure. The custom simulation engine requires only standard Python "
    "data structures (collections.deque, defaultdict, itertools.product) — no specialised "
    "hardware or proprietary libraries are needed. The React frontend runs in any ES6+ browser "
    "without plugins.",
    size=12, space_before=0, space_after=8)

para(doc,
    "Operationally, both the backend Flask server and frontend Vite SPA can be deployed within "
    "minutes on standard college servers or cloud platforms. Local MongoDB fallback ensures the "
    "system remains functional even during cloud connectivity interruptions.",
    size=12, space_before=0, space_after=8)

heading(doc, "2.3.2   Economic Feasibility", 2)
para(doc,
    "The entire technology stack is open-source with zero licensing costs: Python (PSF licence), "
    "Flask (BSD), React (MIT), Vite (MIT), MongoDB Community Edition (SSPL). Development was "
    "carried out on existing academic hardware. Deployment requires only a standard web server "
    "(e.g., Linux VPS costing approximately Rs. 500–1,000 per month) and a free MongoDB Atlas "
    "cluster tier. The return on investment is high — the platform replaces expensive physical "
    "breadboarding laboratories and manual grading overhead.",
    size=12, space_before=0, space_after=8)

heading(doc, "2.3.3   Operational Feasibility", 2)
para(doc,
    "The platform is designed for straightforward adoption in academic curricula. Students require "
    "only a modern web browser and basic computer literacy. Teachers need no specialised EDA "
    "training — the intuitive authoring interface guides challenge creation through structured "
    "forms. System administrators manage user roles and platform data through standard MongoDB "
    "administrative tools. The REST API is fully documented with typed request/response schemas, "
    "enabling future integration with college learning management systems.",
    size=12, space_before=0, space_after=8)

heading(doc, "2.4   System Specification", 1)
heading(doc, "2.4.1   Software Specification", 2)
table(doc,
    ["Layer", "Technology", "Version", "Role"],
    [
        ["Backend Runtime", "Python", "3.13+", "Application logic and algorithm execution"],
        ["Web Framework", "Flask", "3.1.3", "REST API gateway and endpoint routing"],
        ["Database", "MongoDB / PyMongo", "6.0+ / 4.17", "Persistent document storage"],
        ["Authentication", "PyJWT / bcrypt", "2.14 / 5.0", "Token auth and password hashing"],
        ["Frontend", "React", "18.3+", "Component-based SPA user interface"],
        ["Build Tool", "Vite", "8.2+", "Fast bundling and Hot Module Replacement"],
        ["Styling", "CSS3 / Custom SVG", "Standard", "Responsive UI and gate symbols"],
        ["Browser", "Chrome / Edge / Firefox", "Latest", "Client runtime environment"],
    ],
    col_widths=[1.4, 1.6, 1.1, 2.1],
    caption_num="2.1",
    caption="Software Specification"
)

heading(doc, "2.4.2   Hardware Specification", 2)
table(doc,
    ["Component", "Minimum", "Recommended"],
    [
        ["Processor", "Dual-core x86-64 @ 2.0 GHz", "Quad-core Intel Core i5 / AMD Ryzen 5"],
        ["RAM", "4 GB", "8 GB – 16 GB"],
        ["Storage", "2 GB free disk space", "10 GB SSD"],
        ["Display", "1280 × 720 (HD)", "1920 × 1080 (Full HD)"],
        ["Network", "Broadband (1 Mbps)", "High-speed broadband (10+ Mbps)"],
        ["OS", "Windows 10 / macOS / Linux", "Windows 11 / Ubuntu 22.04 LTS"],
    ],
    col_widths=[1.5, 2.3, 2.4],
    caption_num="2.2",
    caption="Hardware Specification"
)

heading(doc, "2.5   Identification of Actors", 1)
para(doc,
    "A use case represents a function performed by the system that yields an observable result "
    "for one or more actors. Actors are identified by examining who interacts with the system "
    "and what roles they fulfil:",
    size=12, space_before=0, space_after=6)

bold_bullet(doc, "Student / Learner: ",
    "Registers, logs in, studies the learning curriculum, attempts quizzes, designs circuits "
    "on the canvas, simulates and optimizes circuits, submits challenge solutions, and "
    "participates in discussion forums.")

bold_bullet(doc, "Teacher / Instructor: ",
    "Registers, logs in, creates and verifies circuit challenge questions, publishes challenges, "
    "reviews student submissions, provides scores and feedback, and replies to student discussions.")

heading(doc, "2.6   Identification of Use Cases", 1)
para(doc,
    "The following use cases are identified for the LogicPath platform:",
    size=12, space_before=0, space_after=6)

student_ucs = [
    "UC01: Register and Login (Student)",
    "UC02: Study Learning Path — browse topics and view digital logic theory",
    "UC03: Attempt Level Quiz — answer MCQs, unlock next level on >= 80% score",
    "UC04: Design Circuit — drag-and-drop gates and wires on the canvas",
    "UC05: Simulate Circuit — trigger graph-based signal propagation",
    "UC06: View Truth Table — examine all 2^N input-output combinations",
    "UC07: Optimize Circuit — apply Boolean rules and view gate savings",
    "UC08: Submit Challenge Solution — submit circuit to automated verifier",
    "UC09: Post Discussion — ask questions linked to a circuit challenge",
    "UC10: Save and Load Circuit — persist circuit to MongoDB and retrieve",
]
teacher_ucs = [
    "UC11: Register and Login (Teacher)",
    "UC12: Create Challenge — author circuit problem with constraints",
    "UC13: Verify Circuit — automated pre-publication equivalence check",
    "UC14: Publish Challenge — make verified challenge available to students",
    "UC15: Review Submissions — view all student circuit submissions",
    "UC16: Grade and Feedback — assign score and written comments",
    "UC17: Reply to Discussion — respond to student forum questions",
    "UC18: Manage Topics — control curriculum content and levels",
    "UC19: View Dashboard — monitor submission statistics and pass rates",
]

heading(doc, "2.6.1   Use Cases for the Actor: Student", 2)
for uc in student_ucs:
    bullet(doc, uc)

heading(doc, "2.6.2   Use Cases for the Actor: Teacher", 2)
for uc in teacher_ucs:
    bullet(doc, uc)

heading(doc, "2.6.3   Use Case Diagram", 2)
figure(doc,
    os.path.join(FIG_DIR, "fig_usecase.png"),
    "2.1", "Use Case Diagram — LogicPath Platform", width=5.8)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 3: SYSTEM DESIGN
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 3, "SYSTEM DESIGN")

heading(doc, "3.1   Introduction", 1)
para(doc,
    "System design translates the requirements and analysis findings into a concrete technical "
    "blueprint. This chapter presents the database design using MongoDB collection schemas, "
    "detailed table designs, Data Flow Diagrams (Level 0 and Level 1), and the Entity-Relationship "
    "Diagram for the LogicPath platform.",
    size=12, space_before=0, space_after=8)

heading(doc, "3.2   Database Design", 1)
para(doc,
    "LogicPath uses MongoDB, a document-oriented NoSQL database, for persistent storage. "
    "Circuits are stored as nested JSON documents containing arrays of gate nodes and connection "
    "edges, mirroring the internal graph representation directly. This schema-flexible approach "
    "allows the simulation engine to deserialise and process circuits with zero data transformation. "
    "The platform maintains six primary collections:",
    size=12, space_before=0, space_after=8)

for coll in [
    "users — stores user credentials, roles, and registration metadata.",
    "circuits — persists user-authored circuit schematics with nodes and connections.",
    "questions — stores teacher-created challenges with draft/published status and reference circuits.",
    "submissions — records student challenge attempts with verification results and teacher feedback.",
    "learning_progress — tracks student quiz scores, level completion, XP points, and topic unlock status.",
    "discussions — stores student questions and teacher replies threaded by challenge question.",
]:
    bullet(doc, coll)

heading(doc, "3.3   Table Design", 1)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK, Auto-generated", "Unique user identifier"],
        ["name", "String", "Required", "Full name of the user"],
        ["email", "String", "Required, Unique", "Login email address"],
        ["password_hash", "String", "Required", "bcrypt-hashed password (cost 12)"],
        ["role", "String", "Enum: student/teacher/admin", "Access control role"],
        ["created_at", "ISODate", "Auto-set", "Account registration timestamp"],
        ["reset_token", "String", "Optional", "Temporary token for password reset"],
        ["reset_expires", "ISODate", "Optional", "Password reset token expiry"],
    ],
    col_widths=[1.4, 1.3, 1.8, 1.7],
    caption_num="3.1",
    caption="users Collection Schema"
)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK", "Unique circuit identifier"],
        ["user_id", "ObjectId", "FK → users._id", "Owner of the circuit"],
        ["name", "String", "Required", "Circuit name / label"],
        ["nodes", "Array[JSON]", "Required", "Array of gate/IO node objects"],
        ["connections", "Array[JSON]", "Required", "Array of wire edge objects"],
        ["created_at", "ISODate", "Auto-set", "Creation timestamp"],
        ["updated_at", "ISODate", "Auto-set", "Last modification timestamp"],
    ],
    col_widths=[1.4, 1.3, 1.8, 1.7],
    caption_num="3.2",
    caption="circuits Collection Schema"
)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK", "Unique question identifier"],
        ["title", "String", "Required", "Challenge title"],
        ["topic_id", "Integer", "Required", "Curriculum topic number (1–15)"],
        ["level", "Integer", "1–4", "Difficulty tier"],
        ["initial_circuit", "JSON", "Required", "Starting circuit for students"],
        ["optimized_circuit", "JSON", "Required (for verify)", "Teacher's reference solution"],
        ["status", "String", "Enum: draft/published", "Visibility to students"],
        ["created_by", "ObjectId", "FK → users._id", "Teacher who created the challenge"],
        ["verified", "Boolean", "Auto-set", "Equivalence verified flag before publish"],
    ],
    col_widths=[1.5, 1.3, 1.7, 1.7],
    caption_num="3.3",
    caption="questions Collection Schema"
)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK", "Unique submission identifier"],
        ["question_id", "ObjectId", "FK → questions._id", "Challenge attempted"],
        ["student_id", "ObjectId", "FK → users._id", "Student who submitted"],
        ["circuit", "JSON", "Required", "Submitted circuit graph"],
        ["passed", "Boolean", "Auto-set", "Whether submission is functionally equivalent"],
        ["score", "Integer", "0–100", "Auto-assigned (100 if passed)"],
        ["teacher_score", "Integer", "Optional", "Manual teacher override score"],
        ["teacher_feedback", "String", "Optional", "Written feedback from instructor"],
        ["submitted_at", "ISODate", "Auto-set", "Submission timestamp"],
    ],
    col_widths=[1.5, 1.3, 1.6, 1.8],
    caption_num="3.4",
    caption="submissions Collection Schema"
)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK", "Unique progress identifier"],
        ["user_id", "ObjectId", "FK → users._id", "Student tracked"],
        ["topic_id", "Integer", "1–15", "Curriculum topic number"],
        ["level", "Integer", "1–4", "Difficulty tier"],
        ["quiz_score", "Float", "0–100", "Score on level quiz"],
        ["completed", "Boolean", "Auto-set", "Whether level is completed"],
        ["xp", "Integer", "Auto-accrued", "Experience points earned"],
        ["unlocked_at", "ISODate", "Auto-set", "When this level was unlocked"],
    ],
    col_widths=[1.5, 1.2, 1.5, 2.0],
    caption_num="3.5",
    caption="learning_progress Collection Schema"
)

table(doc,
    ["Field", "Data Type", "Constraints", "Description"],
    [
        ["_id", "ObjectId", "PK", "Unique discussion identifier"],
        ["question_id", "ObjectId", "FK → questions._id", "Linked challenge"],
        ["user_id", "ObjectId", "FK → users._id", "Student who posted"],
        ["title", "String", "Required", "Question thread title"],
        ["question_text", "String", "Required", "Full question body"],
        ["replies", "Array[JSON]", "Auto-appended", "Thread replies with author and timestamp"],
        ["created_at", "ISODate", "Auto-set", "Thread creation timestamp"],
    ],
    col_widths=[1.5, 1.2, 1.6, 1.9],
    caption_num="3.6",
    caption="discussions Collection Schema"
)

heading(doc, "3.4   Data Flow Diagram", 1)
para(doc,
    "Data Flow Diagrams graphically represent how data moves through a system. External entities "
    "supply or consume data; processes transform data; data stores hold persistent information; "
    "and data flows show directed data movement between these elements.",
    size=12, space_before=0, space_after=8)

heading(doc, "DFD Level 0 — Context Diagram", 2)
para(doc,
    "The Level 0 DFD represents LogicPath as a single process interacting with external entities: "
    "the Student/Learner, the Teacher/Instructor, and the MongoDB Database.",
    size=12, space_before=0, space_after=8)
figure(doc, os.path.join(FIG_DIR, "fig_dfd0.png"), "3.1",
    "Data Flow Diagram (Level 0 — Context Diagram)", width=5.4)

heading(doc, "DFD Level 1 — Subsystem Decomposition", 2)
para(doc,
    "The Level 1 DFD decomposes LogicPath into its six primary processing subsystems, showing "
    "data flows between authentication, learning, circuit canvas, simulation, optimization, "
    "and challenge evaluation modules.",
    size=12, space_before=0, space_after=8)
figure(doc, os.path.join(FIG_DIR, "fig_dfd1.png"), "3.2",
    "Data Flow Diagram (Level 1 — LogicPath Subsystems)", width=5.6)

heading(doc, "3.5   ER Diagram", 1)
para(doc,
    "The Entity-Relationship Diagram represents the logical data structure of the LogicPath "
    "persistence layer. Six entities (Users, Circuits, Questions, Submissions, Learning_Progress, "
    "Discussions) are connected through foreign-key relationships modelled as MongoDB ObjectId "
    "references.",
    size=12, space_before=0, space_after=8)
figure(doc, os.path.join(FIG_DIR, "fig_er.png"), "3.3",
    "Entity-Relationship Diagram — LogicPath", width=5.6)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 4: CODING (DESCRIPTION)
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 4, "CODING")

heading(doc, "4.1   Input Interface", 1)
para(doc,
    "User inputs enter the LogicPath system through two channels: the interactive React frontend "
    "and the RESTful JSON API.",
    size=12, space_before=0, space_after=6)
for item in [
    "Circuit canvas — drag-and-drop gate placement, click-to-connect wire routing, toggle switches for binary inputs.",
    "Authentication forms — email, password, and role selection for login and registration.",
    "Challenge submission — circuit graph JSON submitted via POST request with JWT Bearer token.",
    "Quiz responses — multiple-choice answer selection within timed topic assessments.",
    "Discussion posts — free-text question input submitted to forum threads.",
]:
    bullet(doc, item)

heading(doc, "4.2   Output Interface", 1)
para(doc,
    "The system produces the following outputs, displayed in the React frontend or returned as "
    "JSON responses to API consumers:",
    size=12, space_before=0, space_after=6)
for item in [
    "Live gate signal states — colour-coded binary values overlaid on canvas wires and gate outputs.",
    "Truth tables — tabular display of all 2^N input combinations and corresponding output states.",
    "Boolean expressions — algebraic formula for each circuit output extracted from the DAG.",
    "Optimization report — gate reduction count, depth improvement, and applied rule explanations.",
    "Equivalence verification result — pass/fail with failing input row detail if applicable.",
    "Submission score and teacher feedback — numeric grade and instructor comments.",
    "Learning progress — XP points, level completion status, and next topic unlock condition.",
]:
    bullet(doc, item)

heading(doc, "4.3   Software Description", 1)

heading(doc, "4.3.1   Python", 2)
para(doc,
    "Python 3.13 provides the backend computation environment. Key standard library modules used "
    "include:",
    size=12, space_before=0, space_after=6)
bold_bullet(doc, "collections.defaultdict / deque: ",
    "O(1) adjacency list construction for circuit graph representation and queue-based "
    "topological sorting.")
bold_bullet(doc, "itertools.product: ",
    "Generates all 2^N binary input combinations for exhaustive truth table evaluation.")
bold_bullet(doc, "re (Regular Expressions): ",
    "Parses and normalises Boolean expression strings during algebraic simplification.")

heading(doc, "4.3.2   Flask", 2)
para(doc,
    "Flask 3.1.3 serves as the lightweight WSGI micro-framework providing:",
    size=12, space_before=0, space_after=6)
bold_bullet(doc, "Declarative Route Decorators: ",
    "@app.route decorators map HTTP method-URL combinations to Python handler functions, "
    "supporting 54 distinct RESTful endpoints.")
bold_bullet(doc, "Custom Middleware Decorators: ",
    "@token_required validates JWT Bearer tokens and injects the authenticated user object. "
    "@roles_allowed enforces role-based access control per endpoint.")
bold_bullet(doc, "Flask-CORS: ",
    "Configured with wildcard origin policy during development, enabling the Vite React "
    "dev server to communicate cross-origin with the Flask API.")

heading(doc, "4.3.3   React", 2)
para(doc,
    "React 18 powers the single-page application with a component hierarchy comprising over "
    "fifteen page-level components and ten shared utility components. Key architectural patterns:",
    size=12, space_before=0, space_after=6)
bold_bullet(doc, "AuthContext (Context API): ",
    "Global authentication state provider storing JWT token, user object, and login/logout handlers. "
    "Persists token in localStorage for session restoration on page reload.")
bold_bullet(doc, "CircuitCanvas.jsx: ",
    "Core interactive canvas component managing node state (positions, gate types), connection "
    "state (source/target port pairs), and SVG cubic Bézier path rendering for wires.")
bold_bullet(doc, "ProtectedRoute.jsx: ",
    "HOC wrapping authenticated routes, redirecting unauthenticated users to the login page "
    "and unauthenticated API consumers to the registration form.")

heading(doc, "4.3.4   MongoDB", 2)
para(doc,
    "MongoDB 6 stores all platform data as BSON documents. PyMongo 4.17 provides the Python "
    "driver with the following key features used by LogicPath:",
    size=12, space_before=0, space_after=6)
bold_bullet(doc, "ObjectId References: ",
    "Cross-collection foreign-key relationships implemented via ObjectId fields (e.g., "
    "submission.student_id references users._id), enabling efficient aggregation queries.")
bold_bullet(doc, "Flexible Schema: ",
    "Circuit nodes and connections are stored as embedded JSON arrays without relational "
    "JOIN overhead, matching the in-memory DAG representation exactly.")
bold_bullet(doc, "Resilient Connection Manager: ",
    "The database.py module first attempts connection to the configured Atlas cluster URI; "
    "on DNS/network failure, it automatically falls back to a local MongoDB instance, "
    "ensuring zero developer downtime.")

heading(doc, "4.4   Frontend Pages", 1)
pages_desc = [
    ("Login.jsx / Register.jsx",
     "Authentication entry points providing form validation, role selection, and "
     "JWT token storage on successful login."),
    ("Dashboard.jsx",
     "Post-login landing page displaying overall student statistics, XP progress bar, "
     "and navigation cards to all platform sections."),
    ("LearningPath.jsx",
     "Visual topic roadmap showing 15 curriculum topics with colour-coded completion "
     "status and lock indicators based on quiz score gating."),
    ("LearningTopic.jsx",
     "Individual topic page rendering theory explanations, gate truth tables, worked "
     "examples, and MCQ quiz interface with immediate score feedback."),
    ("Build.jsx",
     "Circuit canvas workspace hosting the drag-and-drop gate palette, SVG wiring canvas, "
     "simulation controls, and truth table output panel."),
    ("Simulation.jsx",
     "Dedicated simulation page showing gate signal states, multi-output truth tables, "
     "and Boolean expression extraction for user-designed circuits."),
    ("Challenges.jsx",
     "Challenge browser listing available engineering problems with difficulty filters "
     "and submission history tracking."),
    ("StudentProblems.jsx / StudentProblemSolver.jsx",
     "Student-facing challenge detail and submission interface with integrated circuit "
     "canvas and automated verifier feedback."),
    ("TeacherDashboard.jsx",
     "Instructor observability panel showing submission statistics, pass rates, "
     "and pending review queue."),
    ("TeacherQuestionEditor.jsx",
     "Full-featured challenge authoring UI with reference circuit designer, "
     "constraint specification, test case management, and pre-publication verifier."),
]
for title, desc in pages_desc:
    bold_bullet(doc, f"{title}: ", desc)

heading(doc, "4.5   Backend Implementation", 1)
modules = [
    ("app.py",
     "Main Flask application module containing all 54 REST API route handlers. Organised "
     "into logical groups: System Health, Authentication, Circuits, Simulation, Optimization, "
     "Learning, Teacher API, Student API, Discussions, and Examples."),
    ("logic_engine.py",
     "Core algorithmic module implementing gate evaluation, circuit validation (Tarjan's DFS "
     "cycle detection), topological sorting (Kahn's algorithm), multi-level simulation, "
     "2^N truth table generation, Boolean expression extraction, and optimisation engine."),
    ("circuit_verifier.py",
     "Behavioural equivalence verification module. Compares two circuit DAGs by running "
     "both through the full 2^N simulation and comparing output states row-by-row. "
     "Also computes gate count, depth, connection count, and gate cost metrics."),
    ("auth.py",
     "Authentication utilities: bcrypt password hashing (cost 12), JWT token generation "
     "(PyJWT, SHA-256, 24-hour expiry), token decoding and validation, password reset "
     "token generation, @token_required and @roles_allowed decorators."),
    ("database.py",
     "MongoDB connection manager with Atlas-primary, local-fallback resilience. "
     "Exposes six pre-connected collection objects (users_collection, circuits_collection, "
     "questions_collection, submissions_collection, learning_progress_collection, "
     "discussions_collection) imported by app.py."),
    ("seed_questions.py",
     "Data seeding utility that programmatically generates 600 verified learning questions "
     "across 15 topics and 4 difficulty tiers, plus 40 teacher circuit challenge questions, "
     "and inserts them into MongoDB."),
]
for title, desc in modules:
    bold_bullet(doc, f"{title}: ", desc)

heading(doc, "System Architecture and Screenshots", 2)
figure(doc, os.path.join(FIG_DIR, "fig4_1_architecture.png"), "4.1",
    "High-Level System Architecture", width=5.8)
figure(doc, os.path.join(FIG_DIR, "fig4_3_screens.png"), "4.2",
    "User Interface — Authentication and Student Dashboard", width=5.8)
figure(doc, os.path.join(FIG_DIR, "fig4_4_simulation.png"), "4.3",
    "User Interface — Circuit Canvas and Simulation Analysis", width=5.8)
figure(doc, os.path.join(FIG_DIR, "fig4_5_dashboard.png"), "4.4",
    "Instructor Observability and Discussion Dashboard", width=5.8)
figure(doc, os.path.join(FIG_DIR, "fig4_2_dataflow.png"), "4.5",
    "Circuit Processing Lifecycle Data Flow", width=4.6)

# Gate specification table
table(doc,
    ["Gate", "Min In", "Max In", "Boolean Function", "Behavior"],
    [
        ["INPUT", "0", "0", "A", "User-controlled binary switch (0 or 1)"],
        ["OUTPUT", "1", "1", "Y = IN", "Display probe showing binary result"],
        ["NOT", "1", "1", "Y = ~A", "Logical complement — inverts the input"],
        ["AND", "2", "8", "Y = A ∧ B ∧ ...", "Output 1 iff all inputs are 1"],
        ["OR", "2", "8", "Y = A ∨ B ∨ ...", "Output 1 if at least one input is 1"],
        ["NAND", "2", "8", "Y = ~(A ∧ B)", "Universal gate — complement of AND"],
        ["NOR", "2", "8", "Y = ~(A ∨ B)", "Universal gate — complement of OR"],
        ["XOR", "2", "8", "Y = A ⊕ B", "Parity gate — 1 if odd number of 1s"],
        ["XNOR", "2", "8", "Y = ~(A ⊕ B)", "Equivalence — 1 if inputs are identical"],
    ],
    col_widths=[0.9, 0.7, 0.7, 1.6, 2.3],
    caption_num="3.7",
    caption="Logic Gate Specifications"
)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 5: SOURCE CODE
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 5, "CODING (SOURCE CODE)")

heading(doc, "5.1   Logic Engine Module — logic_engine.py", 1)
heading(doc, "Gate Evaluation Function", 2)
code_block(doc, """
def evaluate_gate(gate_type, inputs):
    \"\"\"Evaluates a logic gate given its type and list of binary input values.\"\"\"
    gate_type = gate_type.upper()
    if not inputs and gate_type != "INPUT":
        return 0
    if gate_type in ("INPUT", "OUTPUT"):
        return int(inputs[0]) if inputs else 0
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
        return 1 if (sum(1 for v in inputs if v == 1) % 2 == 1) else 0
    if gate_type == "XNOR":
        return 1 if (sum(1 for v in inputs if v == 1) % 2 == 0) else 0
    raise ValueError(f"Unsupported gate type: {gate_type}")
""")

heading(doc, "Topological Sort (Kahn's Algorithm)", 2)
code_block(doc, """
def topological_sort(nodes, connections):
    \"\"\"Kahn's BFS topological sort for circuit DAG evaluation ordering.\"\"\"
    in_degree = {n["id"]: 0 for n in nodes}
    adj = {n["id"]: [] for n in nodes}

    for conn in connections:
        src, dst = conn["from_node"], conn["to_node"]
        adj[src].append(dst)
        in_degree[dst] += 1

    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    order = []

    while queue:
        node_id = queue.popleft()
        order.append(node_id)
        for neighbor in adj[node_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != len(nodes):
        raise ValueError("Circuit contains a combinational cycle — cannot sort.")
    return order
""")

heading(doc, "Multi-Level Simulation Engine", 2)
code_block(doc, """
def simulate_circuit(nodes, connections, input_values):
    \"\"\"Simulates circuit by propagating binary signals in topological order.\"\"\"
    is_valid, errors, _ = validate_circuit(nodes, connections)
    if not is_valid:
        return {"success": False, "errors": errors}

    eval_order = topological_sort(nodes, connections)
    node_outputs = {}

    for node_id in eval_order:
        node = next(n for n in nodes if n["id"] == node_id)
        ntype = node["type"].upper()

        if ntype == "INPUT":
            node_outputs[node_id] = input_values.get(node_id, 0)
        else:
            in_signals = [
                node_outputs[c["from_node"]]
                for c in connections
                if c["to_node"] == node_id
                and c["from_node"] in node_outputs
            ]
            node_outputs[node_id] = evaluate_gate(ntype, in_signals)

    outputs = {
        n["id"]: node_outputs.get(n["id"], 0)
        for n in nodes if n["type"].upper() == "OUTPUT"
    }
    return {"success": True, "states": node_outputs, "outputs": outputs}
""")

heading(doc, "Dynamic 2^N Truth Table Generation", 2)
code_block(doc, """
def generate_truth_table(nodes, connections):
    \"\"\"Exhaustively evaluates all 2^N input combinations.\"\"\"
    inputs = [n for n in nodes if n["type"].upper() == "INPUT"]
    outputs = [n for n in nodes if n["type"].upper() == "OUTPUT"]

    if not inputs:
        return {"error": "No input nodes found"}

    n = len(inputs)
    rows = []

    for combo in itertools.product([0, 1], repeat=n):
        input_values = {inp["id"]: val for inp, val in zip(inputs, combo)}
        result = simulate_circuit(nodes, connections, input_values)

        if result["success"]:
            output_vals = {
                out["label"]: result["states"].get(out["id"], 0)
                for out in outputs
            }
            rows.append({
                "inputs": {inp["label"]: val for inp, val in zip(inputs, combo)},
                "outputs": output_vals
            })

    return {
        "input_labels": [i["label"] for i in inputs],
        "output_labels": [o["label"] for o in outputs],
        "rows": rows
    }
""")

heading(doc, "5.2   Circuit Verifier Module — circuit_verifier.py", 1)
heading(doc, "Deterministic Equivalence Verification", 2)
code_block(doc, """
def verify_circuit_pair(base_nodes, base_conns, test_nodes, test_conns):
    \"\"\"Verifies that two circuits are behaviourally equivalent across all 2^N states.\"\"\"
    # Validate both circuits structurally
    val_b, err_b, _ = validate_circuit(base_nodes, base_conns)
    val_t, err_t, _ = validate_circuit(test_nodes, test_conns)

    if not val_b:
        return {"equivalent": False, "error": "Base circuit invalid: " + str(err_b)}
    if not val_t:
        return {"equivalent": False, "error": "Test circuit invalid: " + str(err_t)}

    # Generate complete truth tables for both circuits
    tt_base = generate_truth_table(base_nodes, base_conns)
    tt_test = generate_truth_table(test_nodes, test_conns)

    # Check row-by-row output equivalence
    for row_b, row_t in zip(tt_base["rows"], tt_test["rows"]):
        if row_b["outputs"] != row_t["outputs"]:
            return {
                "equivalent": False,
                "discrepancy": {
                    "inputs": row_b["inputs"],
                    "base_outputs": row_b["outputs"],
                    "test_outputs": row_t["outputs"]
                }
            }

    # Compute metric improvements
    m_base = calculate_circuit_metrics(base_nodes, base_conns)
    m_test = calculate_circuit_metrics(test_nodes, test_conns)
    gate_delta = m_base["gate_count"] - m_test["gate_count"]
    depth_delta = m_base["circuit_depth"] - m_test["circuit_depth"]

    return {
        "equivalent": True,
        "improved": (gate_delta > 0 or depth_delta > 0),
        "gate_savings": gate_delta,
        "depth_savings": depth_delta,
        "base_metrics": m_base,
        "test_metrics": m_test
    }
""")

heading(doc, "5.3   Authentication Module — auth.py", 1)
heading(doc, "JWT Token Generation and Role Decorator", 2)
code_block(doc, """
import jwt, bcrypt
from functools import wraps
from flask import request, jsonify
from config import JWT_SECRET
from database import users_collection
from bson import ObjectId

def register_user(name, email, password, role="student"):
    if users_collection.find_one({"email": email}):
        return {"error": "Email already registered", "status_code": 400}
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12)).decode()
    user_doc = {"name": name, "email": email,
                "password_hash": password_hash, "role": role}
    users_collection.insert_one(user_doc)
    return {"message": "User registered successfully", "status_code": 201}

def login_user(email, password):
    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode(),
                                       user["password_hash"].encode()):
        return {"error": "Invalid credentials", "status_code": 401}
    token = jwt.encode({"user_id": str(user["_id"]), "role": user["role"]},
                        JWT_SECRET, algorithm="HS256")
    return {"token": token, "user": {"name": user["name"], "role": user["role"]},
            "status_code": 200}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = (request.headers.get("Authorization", "").replace("Bearer ", "")
                 or request.headers.get("x-access-token", ""))
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = users_collection.find_one(
                {"_id": ObjectId(data["user_id"])})
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except Exception:
            return jsonify({"error": "Token is invalid"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def roles_allowed(*roles):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(current_user, *args, **kwargs):
            if current_user.get("role") not in roles:
                return jsonify({"error": f"Role {roles} required"}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator
""")

# ═══════════════════════════════════════════════════════════════
# CHAPTER 6: SYSTEM TESTING
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 6, "SYSTEM TESTING")

heading(doc, "6.1   Testing and Evaluation", 1)
para(doc,
    "Testing is the process of executing a program with the intent of finding errors and verifying "
    "that the software functions correctly according to specifications. LogicPath underwent "
    "comprehensive automated testing at the unit, integration, and system levels. Three dedicated "
    "test suite files were developed, achieving 100% pass rates across all functional areas.",
    size=12, space_before=0, space_after=8)

heading(doc, "6.2   Testing Strategies", 1)
para(doc,
    "The primary objectives of software testing as applied to LogicPath were:",
    size=12, space_before=0, space_after=6)
for t in [
    "Verify that each logic gate evaluates binary inputs to correct output values.",
    "Confirm that topological sorting correctly orders multi-level gate dependencies.",
    "Validate that Tarjan's cycle detection reliably blocks combinational feedback loops.",
    "Ensure that truth table generation produces the correct 2^N rows for all supported circuits.",
    "Verify that the equivalence engine correctly identifies functionally identical and non-identical circuits.",
    "Confirm that JWT authentication and role-based access control are enforced on all protected endpoints.",
    "Ensure that student submission verifier awards correct scores and grades.",
    "Validate curriculum mastery gating — confirm 80% threshold enforcement for level unlocking.",
]:
    bullet(doc, t)

heading(doc, "6.3   Testing Techniques", 1)
heading(doc, "6.3.1   Black Box Testing", 2)
para(doc,
    "Black box testing validates system behaviour against inputs and expected outputs without "
    "examining internal source code. All REST API endpoints were black-box tested by submitting "
    "structured HTTP requests and verifying JSON response codes, payloads, and database state. "
    "Black box testing was performed on authentication, circuit CRUD operations, simulation, "
    "truth table generation, challenge submission, and discussion forum endpoints.",
    size=12, space_before=0, space_after=8)

heading(doc, "6.3.2   Unit Testing", 2)
para(doc,
    "Unit testing validates individual Python functions in isolation. The test_suite.py file "
    "executes 40 unit tests across logic_engine.py, auth.py, database.py, and all REST API "
    "route handlers. Tests confirm gate evaluation correctness, cycle detection precision, "
    "Boolean expression extraction, and CRUD security isolation.",
    size=12, space_before=0, space_after=8)

heading(doc, "6.3.3   Integration Testing", 2)
para(doc,
    "Integration testing validates complete multi-module workflows. The test_teacher_student.py "
    "file runs 24 tests spanning the full teacher-student workflow: registration, role enforcement, "
    "question authoring, pre-publication verification, publishing, student submission, automated "
    "grading, teacher feedback, and discussion thread management. The test_complete_platform.py "
    "file validates the complete platform lifecycle including curriculum seeding, progress "
    "tracking, and XP accumulation.",
    size=12, space_before=0, space_after=8)

heading(doc, "6.3.4   Acceptance Testing", 2)
para(doc,
    "Acceptance testing confirmed that the platform meets all functional requirements from the "
    "student and teacher perspectives. Key acceptance criteria verified: a student can register, "
    "design a Half Adder circuit, simulate it, view the correct truth table, submit it as a "
    "challenge solution, and receive 100/100 with 125 XP. A teacher can create a challenge, "
    "verify and publish it, and see student submission statistics on the dashboard.",
    size=12, space_before=0, space_after=8)

heading(doc, "6.3.5   Output Testing", 2)
para(doc,
    "Output testing confirmed that all system-generated outputs match expected values. "
    "Truth tables were verified row-by-row against hand-computed values for AND, OR, XOR, "
    "NAND, NOR, and XNOR gates. Boolean expression strings were validated against known "
    "algebraic forms. Optimization metric reports were verified to correctly compute gate "
    "reduction percentages.",
    size=12, space_before=0, space_after=8)

heading(doc, "Test Cases", 1)
test_data = [
    ("TC01", "User Registration", "name, email, password, role=student", "HTTP 201, user saved with bcrypt hash", "PASS"),
    ("TC02", "Duplicate Email", "Already-registered email", "HTTP 400: 'Email already registered'", "PASS"),
    ("TC03", "Valid Login", "Correct email and password", "HTTP 200, JWT token returned", "PASS"),
    ("TC04", "Invalid Password", "Valid email, wrong password", "HTTP 401: 'Invalid credentials'", "PASS"),
    ("TC05", "No Token Access", "GET /api/auth/me with no header", "HTTP 401: 'Token is missing'", "PASS"),
    ("TC06", "AND Gate", "A=1, B=1", "Output: 1", "PASS"),
    ("TC07", "XOR Gate", "A=1, B=0", "Output: 1 (inputs differ)", "PASS"),
    ("TC08", "NOR Gate", "A=0, B=0", "Output: 1", "PASS"),
    ("TC09", "Cycle Detection", "Feedback loop G1→G2→G1", "Validation error: 'Cycle detected'", "PASS"),
    ("TC10", "Float Port Detection", "AND with 1 input only", "Warning: 'Unconnected input port'", "PASS"),
    ("TC11", "Truth Table 2-input", "Half Adder (A, B)", "4 rows: SUM and CARRY correct", "PASS"),
    ("TC12", "Boolean Expression", "A & (B | C)", "Expression: 'A & (B | C)' returned", "PASS"),
    ("TC13", "Absorption Optimisation", "A | (A & B)", "Optimised to 'A', gate saved", "PASS"),
    ("TC14", "Circuit Save", "POST /api/circuits with nodes/connections", "Circuit saved, ObjectId returned", "PASS"),
    ("TC15", "Foreign Circuit Block", "User A reads User B's circuit", "HTTP 403: 'Access denied'", "PASS"),
    ("TC16", "Student Role Block", "Student POST /api/teacher/questions", "HTTP 403: 'Role teacher required'", "PASS"),
    ("TC17", "Unverified Draft Block", "Teacher publishes unverified circuit", "HTTP 400: verify before publishing", "PASS"),
    ("TC18", "Publish Verified Challenge", "Teacher publishes verified design", "Status updated to 'published'", "PASS"),
    ("TC19", "Reference Solution Hiding", "Student GET published question", "optimized_circuit field absent from JSON", "PASS"),
    ("TC20", "E2E Submission & Grade", "Student submits correct Half Adder", "100/100, 125 XP awarded", "PASS"),
]
table(doc,
    ["TC#", "Scenario", "Input", "Expected Output", "Result"],
    test_data,
    col_widths=[0.6, 1.4, 1.7, 1.9, 0.6],
    caption_num="6.1",
    caption="Comprehensive Test Cases — LogicPath Platform"
)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 7: SYSTEM IMPLEMENTATION AND DEPLOYMENT
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 7, "SYSTEM IMPLEMENTATION AND DEPLOYMENT")

para(doc,
    "Implementation is the process of deploying the fully tested system into its operational "
    "production environment. LogicPath is designed for straightforward deployment using standard "
    "open-source tooling on commodity web server hardware or cloud virtual machines.",
    size=12, space_before=0, space_after=8)

heading(doc, "Deployment Architecture", 2)
for step in [
    ("Backend Deployment (Flask): ",
     "The Flask application server is started using python app.py or via a WSGI server such "
     "as Gunicorn (gunicorn -w 4 app:app). In production, a reverse proxy (Nginx) sits in front "
     "to handle HTTPS termination and static file serving. The .env file configures "
     "MONGO_URI, JWT_SECRET, PORT, and DEBUG settings."),
    ("Frontend Deployment (React/Vite): ",
     "npm run build compiles the React SPA into optimised static assets in the dist/ directory. "
     "These files are served by Nginx or any static file CDN. The .env sets "
     "VITE_API_URL to the production Flask endpoint."),
    ("Database (MongoDB): ",
     "A MongoDB Atlas M0 free-tier cluster handles production persistence. The automatic "
     "local fallback (mongodb://127.0.0.1:27017) ensures developer environments remain "
     "fully functional without internet access."),
    ("Data Seeding: ",
     "python seed_questions.py populates the MongoDB database with 600 curriculum quiz "
     "questions across 15 topics and 4 levels, plus 40 teacher circuit challenge problems. "
     "Seeding is idempotent — existing documents are not duplicated."),
]:
    bold_bullet(doc, step[0], step[1])

heading(doc, "Advantages and Limitations", 2)
para(doc, "Advantages:", bold=True, size=12, space_before=8, space_after=4)
for adv in [
    "Interactive real-time circuit simulation with sub-millisecond gate evaluation.",
    "Deterministic 2^N equivalence grading eliminates manual instructor circuit inspection.",
    "Explainable Boolean optimization builds algebraic reasoning skills in learners.",
    "Zero-installation browser-based access with no platform dependency.",
    "Scalable REST architecture easily extended with new gate types or optimization rules.",
    "Resilient dual MongoDB connection ensures system availability during network issues.",
]:
    bullet(doc, adv)

para(doc, "Limitations:", bold=True, size=12, space_before=8, space_after=4)
for lim in [
    "Current simulation scope limited to combinational logic — clocked sequential circuits (flip-flops, registers) are not yet supported.",
    "Exhaustive 2^N truth table generation scales exponentially — circuits with more than 14 inputs require heuristic methods.",
    "Single-user canvas — real-time collaborative circuit editing is not yet implemented.",
    "No HDL export — circuits cannot be compiled to synthesisable VHDL or Verilog for FPGA deployment.",
]:
    bullet(doc, lim)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 8: CONCLUSION
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 8, "CONCLUSION")

para(doc,
    "LogicPath successfully demonstrates the engineering and educational viability of a modern, "
    "web-native digital circuit design, simulation, and optimization platform. The system fulfils "
    "all functional requirements established during the analysis phase — from interactive circuit "
    "construction and graph-based simulation to explainable Boolean optimization and automated "
    "academic assessment.",
    size=12, space_before=0, space_after=8)

para(doc,
    "The core algorithmic contributions of LogicPath are its custom graph-theoretic simulation "
    "engine, which models circuits as Directed Acyclic Graphs and applies Tarjan's cycle "
    "detection and Kahn's topological sorting to ensure provably correct simulation order, and "
    "its deterministic 2^N equivalence verification engine, which objectively grades student "
    "circuit submissions without exposing reference solutions.",
    size=12, space_before=0, space_after=8)

para(doc,
    "The integrated dual-role Learning Management System provides a structured 15-topic digital "
    "logic curriculum with mastery-gated progression, teacher challenge authoring with "
    "pre-publication verification, and in-platform Q&A discussion threading. All components are "
    "connected through a well-designed REST API secured by JWT authentication and role-based "
    "access control.",
    size=12, space_before=0, space_after=8)

para(doc,
    "The project achieved a 100% pass rate across all 40 backend API unit tests, 24 "
    "teacher-student integration tests, and the comprehensive end-to-end platform validation "
    "suite. The production frontend build confirmed all 65 React components compile cleanly "
    "under Vite 8.2 in 2.60 seconds.",
    size=12, space_before=0, space_after=12)

heading(doc, "Future Enhancements", 2)
for fe in [
    "Sequential logic extension — integration of D/T/JK flip-flops, counters, and finite-state machine (FSM) simulation with clock signal support.",
    "Binary Decision Diagrams (BDD) — replacing exhaustive 2^N enumeration with Reduced Ordered BDDs for circuits with N > 14 inputs.",
    "Real-time collaborative canvas — WebSocket-based synchronisation enabling multiple students to edit the same circuit simultaneously.",
    "HDL code generation — automatic export of verified schematics to synthesisable Verilog and VHDL for FPGA development boards.",
    "Fault injection missions — introducing stuck-at-0 / stuck-at-1 fault models for digital hardware debugging education.",
    "Adaptive curriculum recommendations — machine learning model analysing student error patterns to recommend personalised topics.",
    "Mobile-responsive canvas — touch-optimised circuit editor for tablet and smartphone use.",
]:
    bullet(doc, fe)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 9: REFERENCES
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 9, "REFERENCES")

para(doc, "BOOKS REFERRED:", bold=True, size=13, space_before=0, space_after=10)
books = [
    "M. M. Mano and C. R. Kime, Logic and Computer Design Fundamentals, 5th ed. Pearson, 2016.",
    "C. H. Roth and L. L. Kinney, Fundamentals of Logic Design, 7th ed. Cengage Learning, 2014.",
    "S. Brown and Z. Vranesic, Fundamentals of Digital Logic with VHDL Design, 3rd ed. McGraw-Hill, 2009.",
    "A. Grinberg, Flask Web Development: Developing Web Applications with Python, 2nd ed. O'Reilly, 2018.",
    "A. Banks and E. Porcello, Learning React: Modern Patterns, 2nd ed. O'Reilly, 2020.",
    "K. Chodorow, MongoDB: The Definitive Guide, 3rd ed. O'Reilly, 2020.",
]
for b in books:
    bullet(doc, b)

para(doc, "ONLINE REFERENCES:", bold=True, size=13, space_before=14, space_after=10)
online = [
    "Google — https://www.google.com",
    "YouTube — https://www.youtube.com",
    "GitHub — https://www.github.com",
    "PyMongo Documentation — https://pymongo.readthedocs.io",
    "React Documentation — https://react.dev",
    "MongoDB Atlas — https://www.mongodb.com/atlas",
    "Flask Documentation — https://flask.palletsprojects.com",
    "Vite Documentation — https://vitejs.dev",
]
for o in online:
    bullet(doc, o)

para(doc, "RESEARCH PAPERS:", bold=True, size=13, space_before=14, space_after=10)
papers = [
    "R. E. Bryant, 'Graph-based algorithms for boolean function manipulation,' IEEE Transactions on Computers, vol. C-35, no. 8, pp. 677–691, 1986.",
    "R. Tarjan, 'Depth-first search and linear graph algorithms,' SIAM Journal on Computing, vol. 1, no. 2, pp. 146–160, 1972.",
    "A. B. Kahn, 'Topological sorting of large networks,' Communications of the ACM, vol. 5, no. 11, pp. 558–562, 1962.",
    "E. J. McCluskey, 'Minimization of boolean functions,' Bell System Technical Journal, vol. 35, no. 6, pp. 1417–1444, 1956.",
    "C. Burch, 'Logisim: A graphical system for logic circuit design and simulation,' JERIC, vol. 2, no. 1, 2002.",
]
for p in papers:
    bullet(doc, p)

# ═══════════════════════════════════════════════════════════════
# CHAPTER 10: APPENDIX
# ═══════════════════════════════════════════════════════════════
chapter_divider(doc, 10, "APPENDIX")

heading(doc, "Appendix A — API Endpoint Reference", 2)
api_endpoints = [
    ["GET /", "Public", "Health check — returns backend status string"],
    ["GET /api/test", "Public", "Online status JSON with timestamp"],
    ["POST /api/auth/register", "Public", "Register new user (name, email, password, role)"],
    ["POST /api/auth/login", "Public", "Login and receive JWT token"],
    ["GET /api/auth/me", "Auth", "Get current authenticated user profile"],
    ["POST /api/auth/forgot-password", "Public", "Request password reset token"],
    ["POST /api/auth/reset-password", "Public", "Reset password using token"],
    ["POST /api/simulate", "Auth", "Simulate circuit graph with input values"],
    ["POST /api/truth-table", "Auth", "Generate 2^N truth table for circuit"],
    ["POST /api/validate", "Auth", "Validate circuit structure"],
    ["POST /api/optimize", "Auth", "Apply Boolean optimization to circuit"],
    ["GET /api/circuits", "Auth", "List all circuits owned by current user"],
    ["POST /api/circuits", "Auth", "Save new circuit to MongoDB"],
    ["GET /api/circuits/<id>", "Auth", "Retrieve circuit by ID (owner-only)"],
    ["PUT /api/circuits/<id>", "Auth", "Update circuit by ID (owner-only)"],
    ["DELETE /api/circuits/<id>", "Auth", "Delete circuit by ID (owner-only)"],
    ["GET /api/learning/topics", "Auth", "List all 15 curriculum topics"],
    ["GET /api/learning/progress", "Auth", "Get student's curriculum progress"],
    ["POST /api/learning/quiz/submit", "Auth", "Submit quiz answers and unlock next level"],
    ["GET /api/teacher/questions", "Teacher", "List teacher's authored challenge questions"],
    ["POST /api/teacher/questions", "Teacher", "Create new challenge question"],
    ["POST /api/teacher/questions/<id>/verify", "Teacher", "Run automated pre-publication verification"],
    ["PUT /api/teacher/questions/<id>/publish", "Teacher", "Publish verified challenge to students"],
    ["GET /api/student/questions", "Student", "List all published challenge questions"],
    ["POST /api/student/questions/<id>/submit", "Student", "Submit circuit to challenge verifier"],
    ["GET /api/discussions/<qid>", "Auth", "Get discussion thread for challenge"],
    ["POST /api/discussions/<qid>", "Auth", "Post question to challenge thread"],
    ["POST /api/discussions/<qid>/reply", "Teacher", "Reply to student discussion"],
]
table(doc,
    ["Endpoint", "Access", "Description"],
    api_endpoints,
    col_widths=[2.2, 0.8, 3.2],
    caption_num=None
)

heading(doc, "Appendix B — Test Suite Summary", 2)
table(doc,
    ["Test File", "Tests", "Pass", "Coverage"],
    [
        ["test_suite.py", "40", "40", "Auth, Circuits CRUD, Simulation, Truth Tables, Optimization, Security"],
        ["test_teacher_student.py", "24", "24", "Roles, Challenge lifecycle, Verifier, Submissions, Discussions, Dashboard"],
        ["test_complete_platform.py", "16", "16", "E2E curriculum, seeding, XP, progress unlock, frontend build"],
    ],
    col_widths=[2.0, 0.8, 0.8, 2.6],
    caption_num=None
)

heading(doc, "Appendix C — Project File Structure", 2)
code_block(doc, """
LogicPath/
├── logicpath-backend/
│   ├── app.py               # Flask REST API (54 endpoints)
│   ├── logic_engine.py      # Graph simulation, truth table, optimization
│   ├── circuit_verifier.py  # Equivalence verification, circuit metrics
│   ├── auth.py              # JWT auth, bcrypt hashing, decorators
│   ├── database.py          # MongoDB connection manager (Atlas + fallback)
│   ├── examples.py          # Built-in preset circuits and challenges
│   ├── seed_questions.py    # Curriculum seeder (600 questions, 40 challenges)
│   ├── config.py            # Environment config (PORT, JWT_SECRET)
│   ├── test_suite.py        # 40 automated backend tests
│   ├── test_teacher_student.py  # 24 role-based integration tests
│   ├── test_complete_platform.py  # Full E2E validation suite
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
└── logicpath-frontend/
    ├── src/
    │   ├── App.jsx           # Root router with protected routes
    │   ├── api/client.js     # Axios-style API client with JWT headers
    │   ├── context/AuthContext.jsx  # Global auth state provider
    │   ├── components/
    │   │   ├── CircuitCanvas.jsx    # Interactive drag-drop canvas
    │   │   ├── Navbar.jsx           # Navigation bar
    │   │   └── ProtectedRoute.jsx   # Auth-guard HOC
    │   └── pages/
    │       ├── Login.jsx / Register.jsx
    │       ├── Dashboard.jsx / StudentDashboard.jsx
    │       ├── LearningPath.jsx / LearningTopic.jsx
    │       ├── Build.jsx / Simulation.jsx
    │       ├── Challenges.jsx
    │       ├── StudentProblems.jsx / StudentProblemSolver.jsx
    │       ├── TeacherDashboard.jsx / TeacherQuestionEditor.jsx
    │       └── MyAttempts.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
""")

# ─────────────────────────────────────────────────────────────
# Add header and footer
# ─────────────────────────────────────────────────────────────
add_header_text(doc, "LogicPath — Interactive Digital Circuit Design, Simulation & Optimization Platform")
add_footer_page_numbers(doc)

# Save
doc.save(DOCX_OUT)
print(f"\n✓ DOCX saved: {DOCX_OUT}")
print(f"  File size: {os.path.getsize(DOCX_OUT):,} bytes")
