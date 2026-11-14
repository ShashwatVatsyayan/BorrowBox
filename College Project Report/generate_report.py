import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
import pypdf

PAGE_W, PAGE_H = A4
MARGIN = 46
CONTENT_W = PAGE_W - 2 * MARGIN

class AcademicNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, num_pages):
        p = self._pageNumber
        self.saveState()
        self.setFont("Times-Roman", 8.5)
        self.setFillColor(colors.HexColor("#475569"))
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)

        # Footer horizontal rule
        self.line(MARGIN, 32, PAGE_W - MARGIN, 32)

        header_title = "BorrowBox: Campus Peer-to-Peer Rental Marketplace"

        if p == 1:
            self.drawString(MARGIN, 20, "Chandigarh University")
            self.drawRightString(PAGE_W - MARGIN, 20, "Page i")
        elif p == 2:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page ii")
        elif p == 3:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 4")
        elif p == 4:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page iv")
        elif p == 5:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page vi")
        elif p == 6:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 8")
        elif p == 7:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 8")
        elif p == 8:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 12")
        elif p == 9:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 14")
        elif p == 10:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, "Page 16")
        else:
            self.drawString(MARGIN, 20, header_title)
            self.drawRightString(PAGE_W - MARGIN, 20, f"Page {p}")

        self.restoreState()

def build_pdf():
    pdf_filename = os.path.join("College Project Report", "BorrowBox_Project_Report.pdf")
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=38,
        bottomMargin=44
    )

    styles = getSampleStyleSheet()

    # Custom academic styles matching Chandigarh University template
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=17,
        leading=22,
        alignment=1, # Center
        textColor=colors.HexColor("#0F172A")
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12.5,
        leading=17,
        alignment=1,
        textColor=colors.HexColor("#1E293B")
    )

    center_text = ParagraphStyle(
        'CoverCenter',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10.5,
        leading=15,
        alignment=1,
        textColor=colors.HexColor("#0F172A")
    )

    center_bold = ParagraphStyle(
        'CoverCenterBold',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11.5,
        leading=15,
        alignment=1,
        textColor=colors.HexColor("#0F172A")
    )

    h1_style = ParagraphStyle(
        'AcadH1',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=12.5,
        leading=16,
        alignment=1,
        spaceAfter=3,
        textColor=colors.HexColor("#0F172A")
    )

    chap_style = ParagraphStyle(
        'ChapTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=14.5,
        spaceBefore=5,
        spaceAfter=3,
        textColor=colors.HexColor("#0F172A")
    )

    h2_style = ParagraphStyle(
        'AcadH2',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=9.8,
        leading=12.5,
        spaceBefore=4,
        spaceAfter=2.5,
        textColor=colors.HexColor("#0F172A")
    )

    body_style = ParagraphStyle(
        'AcadBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.0,
        leading=12.4,
        alignment=4, # Justified
        spaceAfter=4,
        textColor=colors.HexColor("#1E293B")
    )

    bullet_style = ParagraphStyle(
        'AcadBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=12.0,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=2.0,
        textColor=colors.HexColor("#1E293B")
    )

    caption_style = ParagraphStyle(
        'AcadCaption',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=8.2,
        leading=10.5,
        alignment=1,
        spaceBefore=2.5,
        spaceAfter=5,
        textColor=colors.HexColor("#334155")
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.0,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=8.2,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    # BorrowBox Logo at the top
    bb_logo_path = os.path.join("College Project Report", "extracted_images", "borrowbox_logo.png")
    if os.path.exists(bb_logo_path):
        story.append(Spacer(1, 12))
        story.append(Image(bb_logo_path, width=95, height=68))
        story.append(Spacer(1, 16))
    else:
        story.append(Spacer(1, 35))

    story.append(Paragraph("BORROWBOX: CAMPUS PEER-TO-PEER RENTAL MARKETPLACE AND ASSET SHARING PLATFORM", title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("A PROJECT REPORT", subtitle_style))
    story.append(Spacer(1, 45))

    story.append(Paragraph("Submitted by:", center_text))
    story.append(Spacer(1, 5))
    story.append(Paragraph("Shashwat Vatsyayan (24BCS12850)", center_bold))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Harshit Kulhari (24BCS10424)", center_bold))
    story.append(Spacer(1, 45))

    story.append(Paragraph("in partial fulfillment for the award of the degree of", center_text))
    story.append(Spacer(1, 4))
    story.append(Paragraph("BACHELOR OF ENGINEERING", center_bold))
    story.append(Paragraph("IN", center_text))
    story.append(Paragraph("COMPUTER SCIENCE ENGINEERING", center_bold))
    story.append(Spacer(1, 35))

    # Chandigarh University Logo
    cu_logo_path = os.path.join("College Project Report", "extracted_images", "page_1_X6.png")
    if os.path.exists(cu_logo_path):
        story.append(Image(cu_logo_path, width=220, height=71))
    story.append(Spacer(1, 32))

    story.append(Paragraph("CHANDIGARH UNIVERSITY", center_bold))
    story.append(Spacer(1, 4))
    story.append(Paragraph("MAY-2026", center_text))
    story.append(PageBreak())

    # ==========================================
    # PAGE 2: BONAFIDE CERTIFICATE & ACKNOWLEDGEMENT
    # ==========================================
    story.append(Spacer(1, 8))
    story.append(Paragraph("BONAFIDE CERTIFICATE", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=10))

    cert_text = (
        'Certified that the project report entitled <b>"BorrowBox: Campus Peer-to-Peer Rental Marketplace and Asset Sharing Platform"</b> is the '
        'bonafide work submitted by <b>Shashwat Vatsyayan (24BCS12850)</b> and <b>Harshit Kulhari (24BCS10424)</b> as part of '
        'the academic requirements of the Bachelor of Engineering in Computer Science Engineering at Chandigarh University.<br/><br/>'
        'The report describes the analysis, design, and implementation of a full-stack campus peer-to-peer rental marketplace and '
        'asset sharing application built with React 18, Vite, JavaScript, Node.js, Express, Supabase PostgreSQL with Row Level Security, '
        'platform-enforced category price ceilings, 20% commission economics, real-time in-chat negotiation, and high-contrast '
        'holographic campus identity passes.'
    )
    story.append(Paragraph(cert_text, body_style))
    story.append(Spacer(1, 32))

    story.append(Paragraph("<b>HEAD OF DEPARTMENT</b>", ParagraphStyle('HOD', parent=body_style, fontName='Times-Bold', fontSize=9.2)))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Signature: ______________________", body_style))
    story.append(Paragraph("Name: <b>Er. Gagandeep Singh</b>", body_style))
    story.append(Spacer(1, 20))

    story.append(Paragraph("ACKNOWLEDGEMENT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=10))

    ack_text = (
        'We express our sincere gratitude to our project supervisor, faculty members, and the Department of Computer Science '
        'Engineering, Chandigarh University, for their guidance and academic support during the development of <b>BorrowBox: '
        'Campus Peer-to-Peer Rental Marketplace and Asset Sharing Platform</b>.<br/><br/>'
        'This project provided practical engineering experience in transforming student asset sharing into a regulated peer rental '
        'marketplace. Key contributions include building a responsive React interface, connecting it to an enterprise Supabase '
        'PostgreSQL backend, establishing mandatory category price caps (Rs. 10 - Rs. 100/day), executing 20% platform commission economics, '
        'integrating real-time direct messaging with in-chat custom rate and permanent trade negotiation, and enforcing atomic '
        'PostgreSQL date-range overlap exclusion locks alongside a two-phase mutual return handshake protocol.<br/><br/>'
        'We also acknowledge the official documentation and developer resources that supported implementation and debugging. '
        'Finally, we thank our families and friends for their constant encouragement throughout the project.'
    )
    story.append(Paragraph(ack_text, body_style))
    story.append(PageBreak())

    # ==========================================
    # PAGE 3: TABLE OF CONTENTS
    # ==========================================
    story.append(Spacer(1, 8))
    story.append(Paragraph("TABLE OF CONTENTS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=8))

    toc_data = [
        [Paragraph("<b>S.No.</b>", table_header), Paragraph("<b>Topic / Section</b>", table_header), Paragraph("<b>Page No.</b>", table_header)],
        ["", Paragraph("Bonafide Certificate", table_cell), "ii"],
        ["", Paragraph("Acknowledgement", table_cell), "iii"],
        ["1.", Paragraph("Abstract", table_cell), "iv"],
        ["2.", Paragraph("Graphical Abstract", table_cell), "v"],
        ["3.", Paragraph("Abbreviations and Symbols", table_cell), "vi"],
        ["4.", Paragraph("CHAPTER 1 - INTRODUCTION", table_cell), "7"],
        ["5.", Paragraph("1.1 Identification of Need / Contemporary Issue", table_cell), "7"],
        ["6.", Paragraph("1.2 Identification of Problem", table_cell), "7"],
        ["7.", Paragraph("1.3 Identification of Tasks", table_cell), "7"],
        ["8.", Paragraph("1.4 Timeline", table_cell), "8"],
        ["9.", Paragraph("CHAPTER 2 - LITERATURE REVIEW/BACKGROUND STUDY", table_cell), "9"],
        ["10.", Paragraph("2.1 Evolution of Campus Peer Sharing Systems", table_cell), "9"],
        ["11.", Paragraph("2.2 Existing Solutions & Comparative Analysis", table_cell), "10"],
        ["12.", Paragraph("2.3 Review Summary & Goals", table_cell), "10"],
        ["13.", Paragraph("CHAPTER 3 - DESIGN FLOW/PROCESS", table_cell), "11"],
        ["14.", Paragraph("3.1 Selected Features & Design Constraints", table_cell), "11"],
        ["15.", Paragraph("3.2 Alternative Design Flows & Methodology", table_cell), "12"],
        ["16.", Paragraph("CHAPTER 4 - RESULTS ANALYSIS AND VALIDATION", table_cell), "13"],
        ["17.", Paragraph("4.1 Implementation of Solution & Tech Stack", table_cell), "13"],
        ["18.", Paragraph("4.2 Database Design & Validation Rules", table_cell), "14"],
        ["19.", Paragraph("4.3 Testing and Characterization", table_cell), "15"],
        ["20.", Paragraph("4.4 Output Screens - Rental Marketplace, Duration Pricing, In-Chat Negotiation, & Holographic Pass", table_cell), "16"],
        ["21.", Paragraph("CHAPTER 5 - CONCLUSION AND FUTURE WORK", table_cell), "17"],
    ]

    t_toc = Table(toc_data, colWidths=[34, 404, 62])
    t_toc.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('ALIGN', (2,0), (2,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_toc)
    story.append(PageBreak())

    # ==========================================
    # PAGE 4: ABSTRACT & GRAPHICAL ABSTRACT
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("ABSTRACT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=6))

    abs_p1 = (
        '<b>BorrowBox</b> is a responsive full-stack Campus Peer-to-Peer Rental Marketplace and Asset Sharing Platform designed to '
        'facilitate affordable, verified student equipment rentals and exchanges across university faculties. Rooted in the core philosophy '
        '<i>"Rent What You Need. Earn From What You Own,"</i> BorrowBox empowers students to monetize idle academic equipment while providing '
        'peers with low-cost, on-demand access to essential semester gear.'
    )
    abs_p2 = (
        'To prevent exploitative student pricing, BorrowBox introduces a platform-enforced <b>Category-Based Rental Price Control System</b> '
        'with mandatory daily price ceilings ranging from Rs. 10 to Rs. 100 across categories such as Scientific Calculators (Rs. 25/d), Lab Equipment '
        '(Rs. 30/d), Electronics (Rs. 75/d), and Photography (Rs. 100/d). The financial model features a configurable 20% platform commission and 80% '
        'owner payout, complemented by multi-day duration discounts (10% to 20% for 3 to 14 days).'
    )
    abs_p3 = (
        'The portal integrates real-time <b>Direct Messaging (DM)</b> with an in-chat negotiation protocol enabling students to propose custom '
        'rates or counter-offer permanent barter swaps. Unlisted needs are served through a <b>Requested Items ("Wanted" Board)</b>. Platform '
        'trust is secured through an institutional domain gate (@cuchd.in), an accessibility-first <b>High-Contrast Holographic Campus Identity '
        'Pass</b> with Code-128 barcodes and verification QR codes, atomic PostgreSQL double-booking exclusion constraints, and a two-phase '
        'mutual handshake return protocol.'
    )
    story.append(Paragraph(abs_p1, body_style))
    story.append(Paragraph(abs_p2, body_style))
    story.append(Paragraph(abs_p3, body_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("GRAPHICAL ABSTRACT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=6))
    story.append(Paragraph(
        "The graphical abstract illustrates the four-tier architectural pipeline of <b>BorrowBox</b>: Client Layer, Pricing & Market Rules, "
        "Negotiation Services, and Persistence & Integrity.",
        body_style
    ))
    story.append(Spacer(1, 4))

    ga_img = os.path.join("College Project Report", "extracted_images", "graphical_abstract.png")
    if os.path.exists(ga_img):
        story.append(Image(ga_img, width=475, height=185))
    story.append(Paragraph("<i>Figure — BorrowBox system architecture, rental price control rules, and peer exchange workflow</i>", caption_style))
    story.append(PageBreak())

    # ==========================================
    # PAGE 5: ABBREVIATIONS & CHAPTER 1 (1.1, 1.2)
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("ABBREVIATIONS AND SYMBOLS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=6))

    abbr_data = [
        [Paragraph("<b>Term</b>", table_header), Paragraph("<b>Meaning</b>", table_header)],
        [Paragraph("API", table_cell), Paragraph("Application Programming Interface", table_cell)],
        [Paragraph("CRUD", table_cell), Paragraph("Create, Read, Update, Delete", table_cell)],
        [Paragraph("CSS", table_cell), Paragraph("Cascading Style Sheets", table_cell)],
        [Paragraph("DM", table_cell), Paragraph("Direct Messaging (Peer-to-Peer In-App Communication)", table_cell)],
        [Paragraph("HTTP", table_cell), Paragraph("Hypertext Transfer Protocol", table_cell)],
        [Paragraph("JSON", table_cell), Paragraph("JavaScript Object Notation", table_cell)],
        [Paragraph("JSX", table_cell), Paragraph("JavaScript XML syntax extension", table_cell)],
        [Paragraph("P2P", table_cell), Paragraph("Peer-to-Peer Distributed Marketplace Architecture", table_cell)],
        [Paragraph("REST", table_cell), Paragraph("Representational State Transfer", table_cell)],
        [Paragraph("RLS", table_cell), Paragraph("Row Level Security (PostgreSQL Access Control)", table_cell)],
        [Paragraph("UI / UX", table_cell), Paragraph("User Interface / User Experience", table_cell)],
        [Paragraph("Vite", table_cell), Paragraph("Next-Generation Frontend Build and Bundling Tool", table_cell)],
    ]
    t_abbr = Table(abbr_data, colWidths=[90, 410])
    t_abbr.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_abbr)
    story.append(Spacer(1, 8))

    story.append(Paragraph("CHAPTER 1 - INTRODUCTION", chap_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=6))

    story.append(Paragraph("1.1 IDENTIFICATION OF NEED / CONTEMPORARY ISSUE", h2_style))
    intro_1 = (
        'Engineering and higher education curricula mandate the procurement of specialized instruments, tools, and reference materials '
        'such as scientific calculators (Casio fx-991CW), laboratory coats, safety glasses, mini-drafters, electronic breadboards, sensor '
        'kits, and high-resolution cameras. In practice, students require these items for a single academic semester or specific project '
        'milestones, after which the equipment remains permanently idle and depreciates.<br/><br/>'
        'Informal channels—such as unmoderated social media chat groups and physical notice boards—suffer from rampant price gouging, lack of '
        'standardized pricing, unverified identities, and no scheduling guarantees. University students urgently require an affordable, '
        'structured, and campus-moderated rental marketplace that protects borrowers from inflated fees while offering owners a safe, '
        'dependable method to earn secondary income on campus.'
    )
    story.append(Paragraph(intro_1, body_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("1.2 IDENTIFICATION OF PROBLEM", h2_style))
    intro_2 = (
        'The core problem is the absence of an integrated, peer-to-peer campus rental system that combines strictly regulated pricing '
        'limits, verified student identity authentication, dispute-free physical handoffs, and concurrency-safe booking logic.<br/><br/>'
        'From an architectural standpoint, the system must enforce platform-level price caps per category, calculate multi-tier duration '
        'discounts alongside a 20% platform commission, provide real-time in-chat rate negotiation and permanent trade proposals, '
        'eliminate double-booking race conditions through atomic PostgreSQL exclusion locks, and maintain absolute geometric UI stability '
        'across dual theme states.'
    )
    story.append(Paragraph(intro_2, body_style))
    story.append(PageBreak())

    # ==========================================
    # PAGE 6: 1.3 TASKS, 1.4 TIMELINE, CHAPTER 2 (2.1, 2.2)
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("1.3 IDENTIFICATION OF TASKS", h2_style))
    tasks = [
        "Analyze campus rental economics, category price ceilings, and university domain authentication rules (@cuchd.in).",
        "Design a modern, zero-emoji React interface with dual-theme geometric stability and Plus Jakarta Sans typography.",
        "Implement a platform-enforced category pricing engine with daily caps (Rs. 10 - Rs. 100/day) and multi-day duration discounts.",
        "Build a transparent 20% platform commission and 80% owner payout calculation model with escrow security deposits.",
        "Develop real-time Direct Messaging (DM) with in-chat custom rate proposals and permanent barter swap workflows.",
        "Create a Requested Items ('Wanted' Board) enabling students to post unlisted asset needs and receive peer offers.",
        "Construct a high-contrast Holographic Campus Identity Pass with scannable Code-128 barcodes and verification QR codes.",
        "Enforce atomic PostgreSQL date-range overlap exclusion locks and a two-phase mutual handshake return protocol."
    ]
    for tk in tasks:
        story.append(Paragraph(f"• {tk}", bullet_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1.4 TIMELINE", h2_style))
    timeline_data = [
        [Paragraph("<b>Stage</b>", table_header), Paragraph("<b>Activities</b>", table_header), Paragraph("<b>Deliverable</b>", table_header)],
        [Paragraph("Requirement Analysis", table_cell), Paragraph("Define student rental workflows, category price caps, and commission model", table_cell), Paragraph("SRS Document", table_cell)],
        [Paragraph("UI/UX Engineering", table_cell), Paragraph("React component architecture, zero-emoji tokens, and stable dual-theme layout", table_cell), Paragraph("Responsive Interface", table_cell)],
        [Paragraph("Pricing & Logic Engine", table_cell), Paragraph("Category ceiling validation, multi-day discounts, and commission splits", table_cell), Paragraph("Pricing Subsystem", table_cell)],
        [Paragraph("In-Chat Negotiation", table_cell), Paragraph("Direct messaging with embedded rental proposals and permanent trade offers", table_cell), Paragraph("Chat Engine", table_cell)],
        [Paragraph("Holographic Identity", table_cell), Paragraph("High-contrast campus pass with Code-128 barcode and QR verification", table_cell), Paragraph("Campus Pass", table_cell)],
        [Paragraph("Backend & Integrity", table_cell), Paragraph("Express REST API, Supabase RLS, and atomic date-overlap locks", table_cell), Paragraph("Secure API & DB", table_cell)],
        [Paragraph("Testing & CI", table_cell), Paragraph("Multi-suite automated test harness verifying pricing, chat, trades, and locks", table_cell), Paragraph("Test Evidence", table_cell)],
        [Paragraph("Documentation", table_cell), Paragraph("Prepare comprehensive technical project report and deployment manual", table_cell), Paragraph("Final Report", table_cell)],
    ]
    t_time = Table(timeline_data, colWidths=[95, 280, 125])
    t_time.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_time)
    story.append(Spacer(1, 6))

    story.append(Paragraph("CHAPTER 2 - LITERATURE REVIEW / BACKGROUND STUDY", chap_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=5))

    story.append(Paragraph("2.1 EVOLUTION OF CAMPUS PEER SHARING SYSTEMS", h2_style))
    lit_text = (
        'Peer asset exchange traditionally operated via informal noticeboards or student instant messaging groups. While accessible, '
        'these systems suffer from zero pricing regulation, unverified participants, zero scheduling conflict prevention, and high dispute rates. '
        'Conversely, commercial equipment rental portals target enterprise or public markets, charge steep commission rates, and present severe '
        'physical safety risks for student meetups off campus.<br/><br/>'
        'BorrowBox bridges this gap by providing an authenticated, intra-campus rental marketplace governed by automated price ceilings, '
        'transparent 20% platform fees, and verifiable landmark handoffs within university grounds.'
    )
    story.append(Paragraph(lit_text, body_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("2.2 EXISTING SOLUTIONS & COMPARATIVE ANALYSIS", h2_style))
    comp_data = [
        [Paragraph("<b>Approach</b>", table_header), Paragraph("<b>Advantages</b>", table_header), Paragraph("<b>Limitations</b>", table_header), Paragraph("<b>Relevance</b>", table_header)],
        [Paragraph("Campus Noticeboards", table_cell), Paragraph("Zero software dependency", table_cell), Paragraph("No search index, manual contact, no audit log", table_cell), Paragraph("Baseline", table_cell)],
        [Paragraph("Social Chat Groups", table_cell), Paragraph("Broad student reach", table_cell), Paragraph("Price gouging, spam, zero reservation locks", table_cell), Paragraph("Informal", table_cell)],
        [Paragraph("Commercial Rental Apps", table_cell), Paragraph("Large commercial inventory", table_cell), Paragraph("High commercial fees, non-student safety risks", table_cell), Paragraph("Reference", table_cell)],
    ]
    t_comp = Table(comp_data, colWidths=[85, 120, 205, 90])
    t_comp.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_comp)
    story.append(PageBreak())

    # ==========================================
    # PAGE 7: 2.2 CONTINUED, 2.3 GOALS, CHAPTER 3
    # ==========================================
    story.append(Spacer(1, 5))
    comp_cont = [
        [Paragraph("<b>Approach</b>", table_header), Paragraph("<b>Advantages</b>", table_header), Paragraph("<b>Limitations</b>", table_header), Paragraph("<b>Relevance</b>", table_header)],
        [Paragraph("BorrowBox (Selected)", table_cell), Paragraph("Category price caps, 20% commission, in-chat negotiation, verified @cuchd.in domain, holographic pass, atomic locks", table_cell), Paragraph("Restricted exclusively to verified campus student domain", table_cell), Paragraph("Selected Approach", table_cell)],
    ]
    t_cont = Table(comp_cont, colWidths=[85, 235, 90, 90])
    t_cont.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_cont)
    story.append(Spacer(1, 6))

    story.append(Paragraph("2.3 GOALS / OBJECTIVES", h2_style))
    goals = [
        "Transform campus asset sharing into an affordable, regulated peer-to-peer rental marketplace.",
        "Enforce category-based daily price caps (Rs. 10 - Rs. 100/day) to completely eliminate student price gouging.",
        "Implement a transparent 20% platform commission with 80% owner earnings and duration discounts.",
        "Deliver real-time direct messaging with embedded custom rate negotiation and permanent trade proposals.",
        "Provide an accessibility-first Holographic Campus Identity Pass with Code-128 barcode and QR verification.",
        "Guarantee 100% atomic double-booking prevention through PostgreSQL exclusion constraints and two-phase returns."
    ]
    for g in goals:
        story.append(Paragraph(f"• {g}", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("CHAPTER 3 - DESIGN FLOW / PROCESS", chap_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=5))

    story.append(Paragraph("3.1 SELECTED FEATURES & PRIORITY", h2_style))
    feat_data = [
        [Paragraph("<b>Feature</b>", table_header), Paragraph("<b>Priority</b>", table_header), Paragraph("<b>Technical Role & Implementation</b>", table_header)],
        [Paragraph("Rental Marketplace & Price Caps", table_cell), Paragraph("High", table_cell), Paragraph("Enforces category ceilings (Rs. 10-100/d) and duration discounts (10-20%)", table_cell)],
        [Paragraph("In-Chat Negotiation & Trades", table_cell), Paragraph("High", table_cell), Paragraph("Direct messaging with custom rental rate proposals and permanent barter swaps", table_cell)],
        [Paragraph("Requested Items ('Wanted' Board)", table_cell), Paragraph("High", table_cell), Paragraph("Allows students to post unlisted needs and receive offers from item owners", table_cell)],
        [Paragraph("Holographic Campus Identity Pass", table_cell), Paragraph("High", table_cell), Paragraph("High-contrast student ID with Code-128 barcode and QR code verification", table_cell)],
        [Paragraph("Atomic Overlap Lock Engine", table_cell), Paragraph("High", table_cell), Paragraph("PostgreSQL exclusion constraints eliminating concurrent double-booking conflicts", table_cell)],
        [Paragraph("Two-Phase Handshake Return", table_cell), Paragraph("High", table_cell), Paragraph("Enforces mutual borrower landmark return and owner physical inspection", table_cell)],
    ]
    t_feat = Table(feat_data, colWidths=[120, 65, 315])
    t_feat.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_feat)
    story.append(Spacer(1, 5))

    story.append(Paragraph("3.2 DESIGN CONSTRAINTS", h2_style))
    story.append(Paragraph("<b>3.2.1 Economic:</b> Student-friendly rate controls. Built entirely on open-source technologies (React 18, Node.js, Express, Supabase).", body_style))
    story.append(Paragraph("<b>3.2.2 Security & Usability:</b> Strict domain authentication (@cuchd.in). Dual-theme geometric stability preventing layout shifts.", body_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("3.3 IMPLEMENTATION METHODOLOGY", h2_style))
    meths = [
        "Modular architecture separating React 18 client, Node.js Express REST API, and Supabase PostgreSQL services.",
        "Integrated category rental price ceiling validator executing client-side and server-side checks on all listings.",
        "Built-in financial fee calculator computing duration discounts, 20% platform commission, and 80% owner payout.",
        "Real-time peer messaging protocol embedding stateful negotiation action cards directly into chat streams.",
        "SVG and canvas-based holographic campus pass rendering high-contrast metadata, Code-128 barcode, and QR token.",
        "Transactional PostgreSQL engine with atomic exclusion constraints preventing double-booking race conditions."
    ]
    for m in meths:
        story.append(Paragraph(f"• {m}", bullet_style))
    story.append(PageBreak())

    # ==========================================
    # PAGE 8: CHAPTER 4 RESULTS ANALYSIS
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("CHAPTER 4 - RESULTS ANALYSIS AND VALIDATION", chap_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=5))

    story.append(Paragraph("4.1 IMPLEMENTATION OF SOLUTION & TECH STACK", h2_style))
    tech_data = [
        [Paragraph("<b>Layer</b>", table_header), Paragraph("<b>Technology</b>", table_header), Paragraph("<b>Architecture Role & Specification</b>", table_header)],
        [Paragraph("Frontend Client", table_cell), Paragraph("React 18 + Vite", table_cell), Paragraph("Component-based reactive UI, Plus Jakarta Sans typography, Lucide icons", table_cell)],
        [Paragraph("Styling System", table_cell), Paragraph("Tailwind CSS", table_cell), Paragraph("Dual-theme tokens, zero-emoji visual language, zero layout-shift geometry", table_cell)],
        [Paragraph("Backend API", table_cell), Paragraph("Node.js + Express", table_cell), Paragraph("REST API routing, price cap validation, in-chat negotiation state machine", table_cell)],
        [Paragraph("Database & Auth", table_cell), Paragraph("Supabase PostgreSQL", table_cell), Paragraph("Row Level Security (RLS), atomic date overlap locks, @cuchd.in domain gate", table_cell)],
        [Paragraph("Test Harness", table_cell), Paragraph("Node Test Runner (6 Suites)", table_cell), Paragraph("Automated CI suites for pricing, negotiations, trades, holo-pass, and locks", table_cell)],
    ]
    t_tech = Table(tech_data, colWidths=[80, 125, 295])
    t_tech.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 5))

    story.append(Paragraph("4.2 PRICING CONTROLS, COMMISSION FORMULAS & ATOMIC LOCKS", h2_style))
    story.append(Paragraph(
        "BorrowBox computes rental financials and atomic booking locks through formal mathematical rules:",
        body_style
    ))
    story.append(Spacer(1, 2))

    formula_box = [
        [Paragraph("<b>Net Rental Price = (Daily Rate &times; Days) &times; (1 - Discount Rate)<br/>"
                   "Platform Fee (20%) = Net Rental Price &times; 0.20  |  Owner Payout (80%) = Net Rental Price &times; 0.80<br/>"
                   "Atomic Lock Rule = NOT (new_start &gt; existing_end OR new_end &lt; existing_start)</b>",
                   ParagraphStyle('Rule', parent=table_cell, fontName='Times-Bold', alignment=1))]
    ]
    t_form = Table(formula_box, colWidths=[500])
    t_form.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_form)
    story.append(Spacer(1, 4))

    # Category Price Caps Table
    cap_data = [
        [Paragraph("<b>Category</b>", table_header), Paragraph("<b>Max Daily Limit</b>", table_header), Paragraph("<b>Category</b>", table_header), Paragraph("<b>Max Daily Limit</b>", table_header)],
        [Paragraph("Books & Textbooks", table_cell), Paragraph("Rs. 15 / day", table_cell), Paragraph("Sports Equipment", table_cell), Paragraph("Rs. 40 / day", table_cell)],
        [Paragraph("Stationery", table_cell), Paragraph("Rs. 10 / day", table_cell), Paragraph("Electronics & Gadgets", table_cell), Paragraph("Rs. 75 / day", table_cell)],
        [Paragraph("Scientific Calculators", table_cell), Paragraph("Rs. 25 / day", table_cell), Paragraph("Photography Equipment", table_cell), Paragraph("Rs. 100 / day", table_cell)],
        [Paragraph("Lab Equipment", table_cell), Paragraph("Rs. 30 / day", table_cell), Paragraph("Project & Hardware Tools", table_cell), Paragraph("Rs. 50 / day", table_cell)],
    ]
    t_caps = Table(cap_data, colWidths=[150, 100, 150, 100])
    t_caps.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 1.8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_caps)
    story.append(Spacer(1, 5))

    story.append(Paragraph("4.3 TESTING AND CHARACTERIZATION", h2_style))
    test_data = [
        [Paragraph("<b>Test ID</b>", table_header), Paragraph("<b>Verification Test Case</b>", table_header), Paragraph("<b>Observed Execution Result</b>", table_header)],
        [Paragraph("TC-01", table_cell), Paragraph("Category Price Ceiling Enforcement", table_cell), Paragraph("Rejects listings exceeding configured limits (e.g., Rs. 30 for calculator)", table_cell)],
        [Paragraph("TC-02", table_cell), Paragraph("Multi-Day Duration Discount Calculation", table_cell), Paragraph("Applies 10% for 3d, 15% for 7d, 20% for 14d accurately", table_cell)],
        [Paragraph("TC-03", table_cell), Paragraph("20% Platform Commission Split", table_cell), Paragraph("Accurately routes 20% to platform ledger and 80% to owner wallet", table_cell)],
        [Paragraph("TC-04", table_cell), Paragraph("In-Chat Rate Proposal Negotiation", table_cell), Paragraph("Supports custom rate proposals with accept/counter/decline transitions", table_cell)],
        [Paragraph("TC-05", table_cell), Paragraph("Permanent Trade Barter Counter-Offer", table_cell), Paragraph("Enables permanent item swap proposals accepted directly in chat", table_cell)],
        [Paragraph("TC-06", table_cell), Paragraph("Requested Items ('Wanted') Workflow", table_cell), Paragraph("Allows posting unlisted requests and submitting owner fulfillment offers", table_cell)],
        [Paragraph("TC-07", table_cell), Paragraph("Holographic Campus Pass Readability", table_cell), Paragraph("Renders high-contrast student info, Code-128 barcode, and QR token", table_cell)],
        [Paragraph("TC-08", table_cell), Paragraph("Atomic Overlap Lock & Two-Phase Handshake", table_cell), Paragraph("Blocks concurrent double-booking and requires mutual return confirmation", table_cell)],
    ]
    t_test = Table(test_data, colWidths=[50, 185, 265])
    t_test.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0F172A")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0,0), (-1,-1), 1.8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_test)
    story.append(PageBreak())

    # ==========================================
    # PAGE 9: 4.4 OUTPUT SCREENS (FIGURES 4.1 & 4.2)
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("4.4 OUTPUT SCREEN - RENTAL MARKETPLACE DASHBOARD OVERVIEW", h2_style))
    story.append(Paragraph(
        "Figure 4.1 illustrates the BorrowBox Peer-to-Peer Rental Marketplace dashboard. It displays the verified university banner, "
        "KPI metrics, category-based price cap tags, zero-emoji navigation, and live rental equipment feed.",
        body_style
    ))
    story.append(Spacer(1, 2))

    fig1_path = os.path.join("College Project Report", "extracted_images", "borrowbox_fig1_dashboard.png")
    if os.path.exists(fig1_path):
        story.append(Image(fig1_path, width=475, height=188))
    story.append(Paragraph("<i>Figure 4.1 — BorrowBox Rental Marketplace Dashboard with Category Price Caps and Verified Peer Badges</i>", caption_style))
    story.append(Spacer(1, 5))

    story.append(Paragraph("4.5 OUTPUT SCREEN - RENTAL DURATION PRICING & FEE BREAKDOWN", h2_style))
    story.append(Paragraph(
        "Figure 4.2 displays the rental item inspection view, highlighting category price compliance, duration selector (1, 3, 7, 14 days), "
        "transparent 20% platform commission split, designated landmark handoff, and atomic date-lock protection.",
        body_style
    ))
    story.append(Spacer(1, 2))

    fig2_path = os.path.join("College Project Report", "extracted_images", "borrowbox_fig2_item_details.png")
    if os.path.exists(fig2_path):
        story.append(Image(fig2_path, width=475, height=188))
    story.append(Paragraph("<i>Figure 4.2 — Rental Duration Pricing Breakdown with Multi-Day Discounts and 20% Commission Calculation</i>", caption_style))
    story.append(PageBreak())

    # ==========================================
    # PAGE 10: 4.6 OUTPUT SCREENS & CHAPTER 5
    # ==========================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("4.6 OUTPUT SCREEN - IN-CHAT NEGOTIATION & TWO-PHASE HANDSHAKE", h2_style))
    story.append(Paragraph(
        "Figure 4.3 showcases real-time Direct Messaging with embedded custom rental rate proposals and permanent trade counter-offers, "
        "alongside the atomic Two-Phase Mutual Return Handshake protocol.",
        body_style
    ))
    story.append(Spacer(1, 1))

    fig3_path = os.path.join("College Project Report", "extracted_images", "borrowbox_fig3_handshake.png")
    if os.path.exists(fig3_path):
        story.append(Image(fig3_path, width=475, height=136))
    story.append(Paragraph("<i>Figure 4.3 — Direct Messaging Rental Negotiation and Two-Phase Return Handshake Protocol</i>", caption_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("4.7 OUTPUT SCREEN - HOLOGRAPHIC CAMPUS PASS & SECURITY SETTINGS", h2_style))
    story.append(Paragraph(
        "Figure 4.4 depicts the high-contrast Holographic Campus Identity Pass featuring edge-bounded foil attenuation, Code-128 barcode, "
        "and verification QR code, alongside the platform security controls and zero-shift theme engine.",
        body_style
    ))
    story.append(Spacer(1, 1))

    fig4_path = os.path.join("College Project Report", "extracted_images", "borrowbox_fig4_settings.png")
    if os.path.exists(fig4_path):
        story.append(Image(fig4_path, width=475, height=136))
    story.append(Paragraph("<i>Figure 4.4 — High-Contrast Holographic Campus Identity Pass and Platform Security Settings</i>", caption_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("CHAPTER 5 - CONCLUSION AND FUTURE WORK", chap_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=1, spaceAfter=4))

    story.append(Paragraph("5.1 CONCLUSION", h2_style))
    concl_text = (
        '<b>BorrowBox: Campus Peer-to-Peer Rental Marketplace and Asset Sharing Platform</b> successfully delivers an enterprise-grade, '
        'student-centric rental ecosystem tailored for university campuses. By integrating platform-enforced category price caps, '
        'transparent 20% commission economics, real-time in-chat rate and trade negotiation, a Requested Items board, and a high-contrast '
        'holographic campus pass, BorrowBox eliminates predatory pricing, builds peer trust, and guarantees conflict-free asset circulation.'
    )
    story.append(Paragraph(concl_text, body_style))
    story.append(Spacer(1, 2))

    story.append(Paragraph("5.2 FUTURE WORK", h2_style))
    fw = [
        "Integration with university ERP databases for automatic course-wise student verification.",
        "Automated push notifications and SMS alerts for upcoming return handshakes and overdue equipment.",
        "Cross-campus federated exchange between affiliated university regional centers."
    ]
    for item in fw:
        story.append(Paragraph(f"• {item}", bullet_style))

    doc.build(story, canvasmaker=AcademicNumberedCanvas)
    print(f"Generated PDF successfully: {pdf_filename}")

    # Verify total page count
    reader = pypdf.PdfReader(pdf_filename)
    num_pages = len(reader.pages)
    print(f"Total pages generated: {num_pages}")
    if num_pages == 10:
        print("PERFECT: Document matches exact 10-page academic structure.")
    else:
        print(f"WARNING: Expected 10 pages, got {num_pages}")

if __name__ == '__main__':
    build_pdf()
