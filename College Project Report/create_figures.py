import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    for name in (['arialbd.ttf', 'calibrib.ttf', 'segoeuib.ttf'] if bold else ['arial.ttf', 'calibri.ttf', 'segoeui.ttf']):
        p = os.path.join('C:/Windows/Fonts', name)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_pill(draw, xy, text, fill, text_color, font, outline=None):
    x0, y0, x1, y1 = xy
    r = (y1 - y0) / 2
    draw.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=fill, outline=outline)
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = x0 + (x1 - x0 - tw) / 2
    ty = y0 + (y1 - y0 - th) / 2 - bbox[1]
    draw.text((tx, ty), text, fill=text_color, font=font)

def draw_card(draw, xy, fill='#FFFFFF', outline='#E2E8F0', radius=8, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

# ==============================================================================
# 1. GRAPHICAL ABSTRACT (900 x 380)
# ==============================================================================
def make_graphical_abstract():
    w, h = 900, 380
    im = Image.new('RGB', (w, h), '#F8FAFC')
    draw = ImageDraw.Draw(im)

    # Outer border
    draw.rounded_rectangle([8, 8, w-8, h-8], radius=10, fill='#FFFFFF', outline='#CBD5E1', width=1)

    # Title header
    draw.rectangle([8, 8, w-8, 48], fill='#0F172A')
    draw.text((24, 18), "BorrowBox: Campus Peer-to-Peer Rental Architecture & System Data Flow", fill='#F8FAFC', font=get_font(15, True))
    draw_pill(draw, [w-210, 16, w-24, 40], "University Verified (@cuchd.in)", '#1E293B', '#34D399', get_font(10, True), outline='#34D399')

    # 4 Architecture Columns
    cols = [
        ("1. CLIENT LAYER (React / Vite)", [
            "Tailwind CSS Responsive UI",
            "Zero-Emoji Visual Architecture",
            "Rental Catalog & Search Index",
            "Wanted Board (Requested Items)",
            "High-Contrast Holographic Pass",
            "Dual-Theme Geometrical Stability"
        ], '#0284C7', '#E0F2FE'),
        ("2. PRICING & MARKET RULES", [
            "Category Price Ceilings (₹10-100/d)",
            "Anti-Price Gouging Limits",
            "Multi-Day Duration Discounts",
            "20% Configurable Commission",
            "80% Student Owner Payout",
            "Direct Trade / Barter Counter-Offer"
        ], '#0D9488', '#CCFBF1'),
        ("3. NEGOTIATION & SERVICES", [
            "Real-Time Direct Messaging",
            "In-Chat Rental Proposal Engine",
            "Counter-Rate Acceptance Flow",
            "Designated Landmark Handoffs",
            "Two-Phase Mutual Return Handshake",
            "Express.js REST Coordination API"
        ], '#8B5CF6', '#EDE9FE'),
        ("4. PERSISTENCE & INTEGRITY", [
            "Supabase PostgreSQL DB",
            "Row Level Security (RLS) Policies",
            "Atomic Date Overlap Exclusion",
            "Zero Double-Booking Guarantee",
            "Automated Multi-Suite CI Harness",
            "Encrypted Session Tokens"
        ], '#059669', '#D1FAE5')
    ]

    col_w = 202
    gap = 14
    start_x = 24
    start_y = 62

    for i, (col_title, items, border_color, badge_bg) in enumerate(cols):
        cx = start_x + i * (col_w + gap)
        # Card container
        draw_card(draw, [cx, start_y, cx + col_w, start_y + 246], fill='#FFFFFF', outline=border_color, radius=6, width=2)
        # Header strip
        draw.rectangle([cx, start_y, cx + col_w, start_y + 34], fill=badge_bg)
        draw.text((cx + 10, start_y + 10), col_title, fill=border_color, font=get_font(10.5, True))
        
        # Items
        for j, item in enumerate(items):
            iy = start_y + 46 + j * 32
            draw.rectangle([cx + 12, iy + 4, cx + 18, iy + 10], fill=border_color)
            draw.text((cx + 24, iy), item, fill='#334155', font=get_font(9.5, False))

    # Bottom summary banner
    draw.rounded_rectangle([24, 320, w-24, 366], radius=6, fill='#F1F5F9', outline='#CBD5E1', width=1)
    draw.text((36, 332), "Core Workflow:", fill='#0F172A', font=get_font(11, True))
    workflow_steps = [
        "1. Browse Regulated Catalog",
        "2. Negotiate Rate via Direct Message",
        "3. Lock Atomic Dates",
        "4. Landmark Pickup",
        "5. Two-Phase Return Handshake"
    ]
    wx = 140
    for step in workflow_steps:
        draw_pill(draw, [wx, 328, wx + 138, 358], step, '#FFFFFF', '#0F172A', get_font(8.5, True), outline='#94A3B8')
        wx += 146

    out_p = os.path.join("College Project Report", "extracted_images", "graphical_abstract.png")
    im.save(out_p)
    print("Saved:", out_p)

# ==============================================================================
# 2. FIGURE 4.1: MARKETPLACE DASHBOARD OVERVIEW (1000 x 480)
# ==============================================================================
def make_fig1_dashboard():
    w, h = 1000, 480
    im = Image.new('RGB', (w, h), '#F8FAFC')
    draw = ImageDraw.Draw(im)

    # Sidebar (left)
    draw.rectangle([0, 0, 210, h], fill='#080F0D')
    draw.text((22, 22), "BorrowBox", fill='#10B981', font=get_font(18, True))
    draw.text((22, 45), "CAMPUS RENTAL HUB", fill='#6EE7B7', font=get_font(8.5, True))

    nav_items = [
        ("Dashboard (Active)", True),
        ("Explore Rentals", False),
        ("Wanted Board", False),
        ("Direct Messages (3)", False),
        ("My Active Rentals", False),
        ("Campus Identity Pass", False),
        ("Platform Settings", False)
    ]
    for i, (name, active) in enumerate(nav_items):
        ny = 80 + i * 36
        if active:
            draw.rounded_rectangle([14, ny, 196, ny + 30], radius=5, fill='#134E4A')
            draw.text((26, ny + 8), name, fill='#FFFFFF', font=get_font(10.5, True))
        else:
            draw.text((26, ny + 8), name, fill='#94A3B8', font=get_font(10.5, False))

    # Sidebar footer
    draw.text((22, h - 45), "Priya Verma (24BCS12850)", fill='#E2E8F0', font=get_font(9.5, True))
    draw_pill(draw, [22, h - 28, 120, h - 12], "Verified Student", '#064E3B', '#6EE7B7', get_font(8, True))

    # Main Area
    mx = 226
    # Top Bar
    draw_card(draw, [mx, 12, w - 16, 56], fill='#FFFFFF', outline='#E2E8F0', radius=6)
    draw.text((mx + 16, 22), "Campus Exchange Network - Chandigarh University", fill='#0F172A', font=get_font(12, True))
    draw_pill(draw, [w - 320, 20, w - 190, 48], "List Item for Rent", '#0D9488', '#FFFFFF', get_font(9.5, True))
    draw_pill(draw, [w - 180, 20, w - 28, 48], "Post Wanted Request", '#FFFFFF', '#0F172A', get_font(9.5, True), outline='#CBD5E1')

    # Hero Banner
    draw_card(draw, [mx, 68, w - 16, 126], fill='#042F2E', outline='#0D9488', radius=6)
    draw.text((mx + 18, 78), "Rent What You Need. Earn From What You Own.", fill='#5EEAD4', font=get_font(15, True))
    draw.text((mx + 18, 102), "Affordable, peer-regulated campus rentals with mandatory category price caps & 20% platform commission.", fill='#CCFBF1', font=get_font(10, False))

    # KPI Stat Cards
    kpis = [
        ("Available for Rent", "48 Items", "Within price cap limits", '#0284C7'),
        ("Active Rentals", "12 Active", "Locks & deposits active", '#0D9488'),
        ("Wanted Requests", "19 Open", "Student equipment needs", '#8B5CF6'),
        ("Platform Fee", "20%", "80% direct owner payout", '#059669')
    ]
    kw = 180
    kgap = 12
    for i, (title, val, sub, col) in enumerate(kpis):
        kx = mx + i * (kw + kgap)
        draw_card(draw, [kx, 138, kx + kw, 204], fill='#FFFFFF', outline='#E2E8F0', radius=6)
        draw.text((kx + 12, 146), title, fill='#64748B', font=get_font(9, True))
        draw.text((kx + 12, 164), val, fill=col, font=get_font(14, True))
        draw.text((kx + 12, 186), sub, fill='#94A3B8', font=get_font(8, False))

    # Category Price Caps Bar
    draw.text((mx, 216), "Category Daily Rental Price Limits (Platform Enforced)", fill='#0F172A', font=get_font(11, True))
    caps = [
        ("Books: Max ₹15/d", '#EFF6FF', '#1D4ED8'),
        ("Calculators: Max ₹25/d", '#F0FDF4', '#15803D'),
        ("Lab Equip: Max ₹30/d", '#FEF3C7', '#B45309'),
        ("Sports: Max ₹40/d", '#F5F3FF', '#6D28D9'),
        ("Electronics: Max ₹75/d", '#ECFDF5', '#047857'),
        ("Photography: Max ₹100/d", '#FFF1F2', '#BE123C')
    ]
    px = mx
    for text, bg, fg in caps:
        draw_pill(draw, [px, 234, px + 120, 256], text, bg, fg, get_font(8.5, True), outline=fg)
        px += 126

    # 3 Item Listing Cards
    draw.text((mx, 268), "Live Campus Rental Feed", fill='#0F172A', font=get_font(11.5, True))
    items = [
        ("Casio fx-991CW ClassWiz", "Scientific Calculators", "₹20 / day", "Central Library Handoff", "Verified: 24BCS12850", '#0D9488'),
        ("Lab Apron & Safety Goggles", "Lab Equipment", "₹12 / day", "Chemistry Block Handoff", "Verified: 24BCS10424", '#0284C7'),
        ("Canon EOS 1500D Kit", "Photography", "₹95 / day", "Student Center Handoff", "Verified: 23BCS11200", '#B45309')
    ]
    iw = 246
    igap = 12
    for i, (iname, icat, iprice, iloc, iowner, col) in enumerate(items):
        ix = mx + i * (iw + igap)
        draw_card(draw, [ix, 288, ix + iw, 468], fill='#FFFFFF', outline='#CBD5E1', radius=6)
        # Card header image placeholder
        draw.rectangle([ix + 1, 289, ix + iw - 1, 355], fill='#F1F5F9')
        draw.text((ix + 12, 316), f"[ {icat} Asset ]", fill='#64748B', font=get_font(10, True))
        
        # Details
        draw.text((ix + 10, 362), iname, fill='#0F172A', font=get_font(10.5, True))
        draw.text((ix + 10, 380), icat, fill='#64748B', font=get_font(8.5, False))
        draw.text((ix + 10, 396), iprice, fill=col, font=get_font(12, True))
        draw.text((ix + 10, 416), iloc, fill='#475569', font=get_font(8.5, False))
        draw.text((ix + 10, 432), iowner, fill='#059669', font=get_font(8, True))
        draw_pill(draw, [ix + iw - 84, 436, ix + iw - 10, 460], "Rent Now", '#0D9488', '#FFFFFF', get_font(8.5, True))

    out_p = os.path.join("College Project Report", "extracted_images", "borrowbox_fig1_dashboard.png")
    im.save(out_p)
    print("Saved:", out_p)

# ==============================================================================
# 3. FIGURE 4.2: ITEM DETAILS & RENTAL DURATION PRICING (1000 x 480)
# ==============================================================================
def make_fig2_item_details():
    w, h = 1000, 480
    im = Image.new('RGB', (w, h), '#F8FAFC')
    draw = ImageDraw.Draw(im)

    # Outer modal background
    draw_card(draw, [16, 12, w - 16, h - 12], fill='#FFFFFF', outline='#CBD5E1', radius=8, width=2)
    # Header
    draw.rectangle([16, 12, w - 16, 52], fill='#0F172A')
    draw.text((36, 22), "Rental Item Inspection & Multi-Day Pricing Breakdown", fill='#FFFFFF', font=get_font(14, True))
    draw_pill(draw, [w - 180, 20, w - 36, 44], "Category Cap Compliant", '#064E3B', '#6EE7B7', get_font(9, True))

    # Left Column: Item Photos & Verification
    lx = 36
    draw_card(draw, [lx, 66, lx + 420, 452], fill='#F8FAFC', outline='#E2E8F0', radius=6)
    draw.rectangle([lx + 12, 78, lx + 408, 220], fill='#E2E8F0')
    draw.text((lx + 100, 140), "Casio fx-991CW ClassWiz Scientific Calculator", fill='#475569', font=get_font(10.5, True))
    draw.text((lx + 124, 160), "[ Verified Physical Condition: Excellent / Like-New ]", fill='#64748B', font=get_font(9, False))

    # Thumbnail strip
    for t in range(4):
        tx = lx + 12 + t * 102
        draw.rectangle([tx, 228, tx + 94, 280], fill='#CBD5E1', outline='#94A3B8')
        draw.text((tx + 16, 248), f"Angle {t+1}", fill='#334155', font=get_font(8.5, True))

    draw.text((lx + 12, 296), "Item Metadata & Security Checks:", fill='#0F172A', font=get_font(11, True))
    specs = [
        ("Platform Category:", "Scientific Calculators (Max Cap: ₹25 / day)"),
        ("Listed Daily Rate:", "₹20 / day (₹5 under platform ceiling)"),
        ("Campus Landmark:", "Central Library Ground Floor Entrance"),
        ("Owner Identity:", "Shashwat Vatsyayan (24BCS12850) - CU Verified"),
        ("Security Deposit:", "₹150 (Held in escrow, refundable upon return)")
    ]
    for k, (lbl, val) in enumerate(specs):
        sy = 318 + k * 24
        draw.text((lx + 12, sy), lbl, fill='#64748B', font=get_font(9, True))
        draw.text((lx + 130, sy), val, fill='#0F172A', font=get_font(9, False))

    # Right Column: Pricing Engine & Booking
    rx = 478
    draw.text((rx, 66), "Rental Duration & Transparent Fee Calculation", fill='#0F172A', font=get_font(13, True))
    
    # Duration selector buttons
    draw.text((rx, 90), "Select Rental Duration:", fill='#475569', font=get_font(10, True))
    durs = [
        ("1 Day", "No Discount", False),
        ("3 Days", "10% Discount (Active)", True),
        ("7 Days", "15% Discount", False),
        ("14 Days", "20% Discount", False)
    ]
    for d, (dtext, ddisc, dactive) in enumerate(durs):
        dx = rx + d * 122
        if dactive:
            draw_card(draw, [dx, 110, dx + 116, 162], fill='#0D9488', outline='#0F766E', radius=6)
            draw.text((dx + 12, 118), dtext, fill='#FFFFFF', font=get_font(11, True))
            draw.text((dx + 8, 138), ddisc, fill='#CCFBF1', font=get_font(8, True))
        else:
            draw_card(draw, [dx, 110, dx + 116, 162], fill='#FFFFFF', outline='#CBD5E1', radius=6)
            draw.text((dx + 12, 118), dtext, fill='#0F172A', font=get_font(11, True))
            draw.text((dx + 12, 138), ddisc, fill='#64748B', font=get_font(8, False))

    # Fee Breakdown Table Card
    draw_card(draw, [rx, 176, w - 36, 360], fill='#F8FAFC', outline='#CBD5E1', radius=6)
    draw.text((rx + 16, 188), "Price Breakdown & Platform Split (20% Fee)", fill='#0F172A', font=get_font(11, True))

    rows = [
        ("Daily Rental Rate", "₹20.00 / day", '#0F172A'),
        ("Selected Duration", "3 Days", '#0F172A'),
        ("Gross Base Rental", "₹60.00", '#0F172A'),
        ("Multi-Day Discount (10%)", "-₹6.00", '#059669'),
        ("Net Total Rental Payable", "₹54.00", '#0F172A'),
        ("Platform Commission (20%)", "₹10.80 (Platform Maintenance & Insurance)", '#6D28D9'),
        ("Student Owner Payout (80%)", "₹43.20 (Transferred upon successful return)", '#0D9488'),
        ("Refundable Security Deposit", "₹150.00 (Escrow lock released upon return)", '#B45309')
    ]
    for r, (label, amount, color) in enumerate(rows):
        ry = 210 + r * 18
        draw.text((rx + 16, ry), label, fill='#475569', font=get_font(8.5, False))
        draw.text((rx + 280, ry), amount, fill=color, font=get_font(8.5, True))

    # Action Buttons
    draw_pill(draw, [rx, 376, rx + 230, 420], "Pay & Reserve Asset (₹204.00)", '#0D9488', '#FFFFFF', get_font(10.5, True))
    draw_pill(draw, [rx + 242, 376, w - 36, 420], "Direct Message Owner to Negotiate", '#FFFFFF', '#0F172A', get_font(10, True), outline='#0F172A')
    draw.text((rx, 432), "Atomic Protection: Selected dates (Nov 15-18) locked against concurrent reservation race conditions.", fill='#059669', font=get_font(8.5, True))

    out_p = os.path.join("College Project Report", "extracted_images", "borrowbox_fig2_item_details.png")
    im.save(out_p)
    print("Saved:", out_p)

# ==============================================================================
# 4. FIGURE 4.3: IN-CHAT NEGOTIATION & TWO-PHASE HANDSHAKE (1000 x 480)
# ==============================================================================
def make_fig3_handshake():
    w, h = 1000, 480
    im = Image.new('RGB', (w, h), '#F8FAFC')
    draw = ImageDraw.Draw(im)

    # Outer container
    draw_card(draw, [16, 12, w - 16, h - 12], fill='#FFFFFF', outline='#CBD5E1', radius=8, width=2)
    # Header
    draw.rectangle([16, 12, w - 16, 52], fill='#0F172A')
    draw.text((36, 22), "Direct Messaging Rental Rate Negotiation & Two-Phase Handshake Return Protocol", fill='#FFFFFF', font=get_font(13.5, True))

    # LEFT PANEL: Real-Time In-Chat Negotiation (Width 460)
    lx = 36
    draw_card(draw, [lx, 66, lx + 440, 452], fill='#F8FAFC', outline='#CBD5E1', radius=6)
    draw.rectangle([lx, 66, lx + 440, 102], fill='#1E293B')
    draw.text((lx + 16, 78), "Direct Chat: Priya Verma <-> Shashwat Vatsyayan", fill='#F8FAFC', font=get_font(10.5, True))
    draw.text((lx + 340, 78), "Online", fill='#34D399', font=get_font(9.5, True))

    # Chat message 1 (Borrower)
    draw_card(draw, [lx + 14, 114, lx + 360, 154], fill='#FFFFFF', outline='#E2E8F0', radius=6)
    draw.text((lx + 22, 122), "Priya: Hi! I need the fx-991CW for 5 days for end-sem.", fill='#0F172A', font=get_font(9, False))
    draw.text((lx + 22, 136), "Can you do ₹16/day instead of ₹20/day?", fill='#0F172A', font=get_font(9, False))

    # In-Chat Custom Rate Proposal Card
    draw_card(draw, [lx + 14, 164, lx + 424, 280], fill='#F0FDFA', outline='#0D9488', radius=6, width=2)
    draw.text((lx + 26, 174), "CUSTOM RENTAL PROPOSAL OFFERED", fill='#0F766E', font=get_font(10, True))
    draw.text((lx + 26, 194), "Proposed Rate: ₹16.00 / day  |  Duration: 5 Days", fill='#0F172A', font=get_font(9.5, True))
    draw.text((lx + 26, 212), "Total: ₹80.00  |  Platform Fee (20%): ₹16.00  |  Owner: ₹64.00", fill='#334155', font=get_font(8.5, False))
    draw_pill(draw, [lx + 26, 238, lx + 146, 268], "Accept Proposal", '#0D9488', '#FFFFFF', get_font(9, True))
    draw_pill(draw, [lx + 154, 238, lx + 274, 268], "Counter-Offer", '#FFFFFF', '#0F172A', get_font(9, True), outline='#CBD5E1')
    draw_pill(draw, [lx + 282, 238, lx + 372, 268], "Decline", '#FEE2E2', '#DC2626', get_font(9, True))

    # In-Chat Permanent Trade Swap Card
    draw_card(draw, [lx + 14, 292, lx + 424, 386], fill='#FAF5FF', outline='#8B5CF6', radius=6, width=2)
    draw.text((lx + 26, 302), "PERMANENT TRADE SWAP COUNTER-OFFER", fill='#6D28D9', font=get_font(10, True))
    draw.text((lx + 26, 322), "Borrower proposes permanent trade: Engineering Mini-Drafter", fill='#0F172A', font=get_font(9, True))
    draw.text((lx + 26, 338), "Condition: Verified Good  |  Cash Adjustment: ₹0.00 (Direct Swap)", fill='#475569', font=get_font(8.5, False))
    draw_pill(draw, [lx + 26, 354, lx + 170, 380], "Accept Permanent Trade", '#7C3AED', '#FFFFFF', get_font(8.5, True))
    draw_pill(draw, [lx + 178, 354, lx + 278, 380], "Keep as Rental", '#FFFFFF', '#6D28D9', get_font(8.5, True), outline='#8B5CF6')

    # Chat input bar
    draw_card(draw, [lx + 14, 402, lx + 424, 438], fill='#FFFFFF', outline='#CBD5E1', radius=4)
    draw.text((lx + 26, 414), "Type a message or propose a rental/trade rate...", fill='#94A3B8', font=get_font(9, False))

    # RIGHT PANEL: Two-Phase Handshake Return Protocol (Width 450)
    rx = 506
    draw_card(draw, [rx, 66, w - 36, 452], fill='#F8FAFC', outline='#CBD5E1', radius=6)
    draw.rectangle([rx, 66, w - 36, 102], fill='#042F2E')
    draw.text((rx + 16, 78), "Atomic Two-Phase Return Handshake Lifecycle", fill='#6EE7B7', font=get_font(10.5, True))

    # Step 1
    draw_card(draw, [rx + 16, 118, w - 52, 192], fill='#FFFFFF', outline='#0D9488', radius=6)
    draw.text((rx + 28, 128), "Phase 1: Borrower Return Initiation", fill='#0D9488', font=get_font(10.5, True))
    draw.text((rx + 28, 146), "• Borrower arrives at designated landmark (Central Library)", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 160), "• Taps 'Initiate Return' in BorrowBox mobile/web client", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 174), "• Status changes to RETURN_INITIATED (Tamper-evident timestamp)", fill='#059669', font=get_font(8.5, True))

    # Step 2
    draw_card(draw, [rx + 16, 204, w - 52, 278], fill='#FFFFFF', outline='#8B5CF6', radius=6)
    draw.text((rx + 28, 214), "Phase 2: Owner Physical Inspection & Release", fill='#7C3AED', font=get_font(10.5, True))
    draw.text((rx + 28, 232), "• Owner checks equipment condition (no damage or missing parts)", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 246), "• Solo return completion is strictly blocked by backend security", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 260), "• Owner confirms receipt -> Triggering atomic release", fill='#6D28D9', font=get_font(8.5, True))

    # Step 3
    draw_card(draw, [rx + 16, 290, w - 52, 364], fill='#FFFFFF', outline='#059669', radius=6)
    draw.text((rx + 28, 300), "Phase 3: Financial Settlement & Deposit Release", fill='#059669', font=get_font(10.5, True))
    draw.text((rx + 28, 318), "• Refundable security deposit (₹150) returned to borrower instantly", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 332), "• Net rental payout (80%) credited to owner's earnings wallet", fill='#334155', font=get_font(8.5, False))
    draw.text((rx + 28, 346), "• 20% platform commission logged to campus administration ledger", fill='#0D9488', font=get_font(8.5, True))

    # Bottom status badge
    draw_card(draw, [rx + 16, 380, w - 52, 436], fill='#ECFDF5', outline='#10B981', radius=6)
    draw.text((rx + 28, 394), "Security Verification Status: PASSED", fill='#047857', font=get_font(10.5, True))
    draw.text((rx + 28, 414), "Both parties physically authenticated at Chandigarh University campus landmark.", fill='#065F46', font=get_font(8.5, False))

    out_p = os.path.join("College Project Report", "extracted_images", "borrowbox_fig3_handshake.png")
    im.save(out_p)
    print("Saved:", out_p)

# ==============================================================================
# 5. FIGURE 4.4: HOLOGRAPHIC CAMPUS PASS & SYSTEM SETTINGS (1000 x 480)
# ==============================================================================
def make_fig4_settings():
    w, h = 1000, 480
    im = Image.new('RGB', (w, h), '#F8FAFC')
    draw = ImageDraw.Draw(im)

    # Outer container
    draw_card(draw, [16, 12, w - 16, h - 12], fill='#FFFFFF', outline='#CBD5E1', radius=8, width=2)
    # Header
    draw.rectangle([16, 12, w - 16, 52], fill='#0F172A')
    draw.text((36, 22), "High-Contrast Holographic Campus Identity Pass & Account Security Settings", fill='#FFFFFF', font=get_font(13.5, True))

    # LEFT PANEL: Holographic Pass Mockup (Width 440)
    lx = 36
    # Holographic card with dark background and emerald foil perimeter
    draw_card(draw, [lx, 66, lx + 440, 452], fill='#080F0D', outline='#10B981', radius=8, width=2)
    
    # Top Pass Header
    draw.text((lx + 20, 80), "BORROWBOX CAMPUS PASS", fill='#34D399', font=get_font(13, True))
    draw.text((lx + 20, 98), "Chandigarh University Verified Identity", fill='#94A3B8', font=get_font(8.5, False))
    draw_pill(draw, [lx + 310, 80, lx + 420, 106], "ACTIVE PASS", '#064E3B', '#6EE7B7', get_font(8.5, True), outline='#10B981')

    # Student Photo & Identity Details
    draw_card(draw, [lx + 20, 120, lx + 120, 240], fill='#1E293B', outline='#34D399', radius=6)
    draw.text((lx + 36, 170), "STUDENT", fill='#94A3B8', font=get_font(10, True))
    draw.text((lx + 38, 186), "PHOTO", fill='#94A3B8', font=get_font(10, True))

    draw.text((lx + 136, 124), "SHASHWAT VATSYAYAN", fill='#FFFFFF', font=get_font(14, True))
    draw.text((lx + 136, 146), "UID: 24BCS12850", fill='#38BDF8', font=get_font(11, True))
    draw.text((lx + 136, 166), "Dept: Computer Science Engineering", fill='#CBD5E1', font=get_font(9, False))
    draw.text((lx + 136, 184), "Degree: Bachelor of Engineering (BE CSE)", fill='#CBD5E1', font=get_font(9, False))
    draw.text((lx + 136, 202), "Domain Email: 24bcs12850@cuchd.in", fill='#A7F3D0', font=get_font(8.5, True))
    draw_pill(draw, [lx + 136, 220, lx + 270, 242], "CU Verified Member", '#064E3B', '#34D399', get_font(8, True))

    # Security Chip & High-Contrast Attributes
    draw_card(draw, [lx + 20, 252, lx + 420, 330], fill='#101A17', outline='#1E3A34', radius=6)
    draw.text((lx + 32, 260), "Holographic Security Shield & Pass Credentials:", fill='#6EE7B7', font=get_font(9.5, True))
    pass_attrs = [
        ("Reputation Score:", "99.4% (58 Successful Rentals)", '#34D399'),
        ("Permitted Categories:", "All (Books, Lab, Electronics, Photography)", '#FFFFFF'),
        ("Foil Attenuation:", "Edge-bounded; 0% text occlusion", '#38BDF8'),
        ("Issue Date / Expiry:", "Aug 2024 / June 2028 (Valid 4 Years)", '#94A3B8')
    ]
    for a, (at, av, ac) in enumerate(pass_attrs):
        ay = 280 + a * 16
        draw.text((lx + 32, ay), at, fill='#94A3B8', font=get_font(8, False))
        draw.text((lx + 150, ay), av, fill=ac, font=get_font(8, True))

    # Barcode & QR Code Footer
    draw_card(draw, [lx + 20, 342, lx + 420, 436], fill='#FFFFFF', outline='#CBD5E1', radius=6)
    # Simulated Code-128 Barcode lines
    bx = lx + 36
    for b in range(48):
        bw = 2 if b % 3 == 0 else (3 if b % 5 == 0 else 1)
        draw.rectangle([bx, 354, bx + bw, 394], fill='#000000')
        bx += bw + 3
    draw.text((lx + 70, 402), "* BBX-24BCS12850-VERIFIED-CU *", fill='#000000', font=get_font(8.5, True))

    # Simulated QR Code
    draw.rectangle([lx + 340, 350, lx + 404, 414], fill='#000000')
    draw.rectangle([lx + 346, 356, lx + 398, 408], fill='#FFFFFF')
    draw.rectangle([lx + 352, 362, lx + 392, 402], fill='#000000')
    draw.rectangle([lx + 358, 368, lx + 386, 396], fill='#FFFFFF')
    draw.rectangle([lx + 364, 374, lx + 380, 390], fill='#000000')
    draw.text((lx + 342, 420), "Scan to Verify", fill='#334155', font=get_font(7.5, True))

    # RIGHT PANEL: Security & Geometrical Stability Settings (Width 450)
    rx = 506
    draw_card(draw, [rx, 66, w - 36, 452], fill='#F8FAFC', outline='#CBD5E1', radius=6)
    draw.rectangle([rx, 66, w - 36, 102], fill='#1E293B')
    draw.text((rx + 16, 78), "Platform Security Controls & Architecture Engine", fill='#F8FAFC', font=get_font(11, True))

    settings_cards = [
        ("Institutional Domain Gate (@cuchd.in)", "Enforces strict student verification. Outside public signups without authenticated Chandigarh University email credentials are rejected at the edge.", '#0284C7'),
        ("Geometrically Stable Dual-Theme Engine", "Synchronizes light and dark themes using CSS token geometry clamps. Guarantees 0px layout shift during mode switches while preserving tactile ink-bleed transitions.", '#0D9488'),
        ("Supabase Row Level Security (RLS)", "PostgreSQL security policies restrict write operations to verified item owners and active transaction participants. Atomic overlap locks eliminate double-booking race conditions.", '#059669'),
        ("Platform Fee & Escrow Configuration", "Default 20% platform commission and security deposit escrow rules enforced server-side. Payout calculation strictly follows 80/20 formula upon verified two-phase handshake return.", '#7C3AED')
    ]
    for s, (stitle, sdesc, scol) in enumerate(settings_cards):
        sy = 114 + s * 82
        draw_card(draw, [rx + 16, sy, w - 52, sy + 74], fill='#FFFFFF', outline=scol, radius=6)
        draw.text((rx + 28, sy + 10), stitle, fill=scol, font=get_font(10, True))
        # Word wrap description
        words = sdesc.split(' ')
        line1, line2 = "", ""
        for word in words:
            if len(line1 + " " + word) < 58:
                line1 += (" " if line1 else "") + word
            else:
                line2 += (" " if line2 else "") + word
        draw.text((rx + 28, sy + 30), line1, fill='#475569', font=get_font(8.5, False))
        if line2:
            draw.text((rx + 28, sy + 46), line2, fill='#475569', font=get_font(8.5, False))

    out_p = os.path.join("College Project Report", "extracted_images", "borrowbox_fig4_settings.png")
    im.save(out_p)
    print("Saved:", out_p)

if __name__ == '__main__':
    print("Generating updated figures...")
    make_graphical_abstract()
    make_fig1_dashboard()
    make_fig2_item_details()
    make_fig3_handshake()
    make_fig4_settings()
    print("All figures successfully generated!")
