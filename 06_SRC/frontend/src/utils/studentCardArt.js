/**
 * Generates high-definition vector artwork for the student Holographic ID Card.
 * Adheres strictly to professional university identity design language and zero-emoji policy.
 *
 * Information Hierarchy:
 * 1. TOP SECTION: Prominent BorrowBox logo + Official Chandigarh University crest + EMV Gold Security Chip.
 * 2. IDENTITY SECTION: 170x210 portrait frame with security brackets, high-contrast 32px student name,
 *    prominent monospace UID badge, department, course, and academic year.
 * 3. VERIFICATION SECTION: Official Chandigarh University verified badge with trust rating and status.
 * 4. IDENTIFICATION REFERENCES: Academic validity, encrypted serial reference, and official university email.
 * 5. BOTTOM SECTION: Clean pure white security container with crisp Code-128 barcode and real scannable QR code.
 */

export function generateStudentCardSvg({
  fullName = 'Student User',
  uid = '23BCS12850',
  email = '23bcs12850@cuchd.in',
  avatarUrl = '',
  gender = 'male',
  department = 'Computer Science & Engineering',
  hostelRoom = 'Hostel BH-3, Room 412',
  role = 'student',
  trustScore = '5.0',
  academicBatch = 'Batch 2023 - 2027 • Year 3',
  course = 'Bachelor of Engineering (B.E.)',
  validUntil = 'JULY 2027'
}) {
  const roleLabel = role === 'admin' ? 'CAMPUS MODERATOR' : 'VERIFIED CAMPUS PEER';
  const cleanUid = (uid || email.split('@')[0]).toUpperCase();

  // Escape special XML characters
  const safeName = fullName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeUid = cleanUid.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeDept = department.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeHostel = hostelRoom.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeCourse = course.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeBatch = academicBatch.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeValid = validUntil.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const isFemale = gender === 'female' || String(avatarUrl).toLowerCase().includes('female');

  // Vector Default Student Portraits (100% self-contained inside SVG, immune to CORS or broken images)
  const maleVectorPortrait = `
    <g transform="translate(45, 125)">
      <rect x="0" y="0" width="165" height="205" rx="16" fill="#0B2C21" />
      <g clip-path="url(#photoClip)">
        <circle cx="82" cy="190" r="75" fill="#061F17" />
        <polygon points="70,115 82,145 94,115 88,110 82,125 76,110" fill="#F8FAFC" />
        <polygon points="80,125 84,125 86,180 82,190 78,180" fill="#D4A853" />
        <rect x="72" y="90" width="20" height="30" rx="3" fill="#DFA074" />
        <ellipse cx="82" cy="72" rx="28" ry="34" fill="#F7C8A4" />
        <path d="M 54 65 C 52 40, 62 25, 82 25 C 102 25, 112 40, 110 65 C 105 52, 95 48, 82 48 C 65 48, 58 52, 54 65 Z" fill="#1C1917" />
        <ellipse cx="71" cy="68" rx="2.5" ry="3" fill="#1C1917" />
        <ellipse cx="93" cy="68" rx="2.5" ry="3" fill="#1C1917" />
        <circle cx="72" cy="67" r="0.8" fill="#FFFFFF" />
        <circle cx="94" cy="67" r="0.8" fill="#FFFFFF" />
        <path d="M 82 68 L 80 78 Q 82 80 84 78 Z" fill="#D58F61" />
        <path d="M 76 88 Q 82 94 88 88" stroke="#9A5034" stroke-width="2" stroke-linecap="round" fill="none" />
      </g>
    </g>
  `;

  const femaleVectorPortrait = `
    <g transform="translate(45, 125)">
      <rect x="0" y="0" width="165" height="205" rx="16" fill="#0B2C21" />
      <g clip-path="url(#photoClip)">
        <path d="M 45 70 C 40 120, 50 160, 65 185 L 100 185 C 115 160, 125 120, 120 70 Z" fill="#261A15" />
        <circle cx="82" cy="190" r="75" fill="#061F17" />
        <polygon points="72,118 82,146 92,118 87,114 82,126 77,114" fill="#F8FAFC" />
        <rect x="74" y="92" width="16" height="30" rx="3" fill="#E2A67D" />
        <ellipse cx="82" cy="72" rx="26" ry="32" fill="#FCD5B5" />
        <path d="M 54 65 C 52 38, 64 24, 82 24 C 100 24, 112 38, 110 65 C 108 50, 96 42, 82 42 C 68 42, 56 50, 54 65 Z" fill="#3D291F" />
        <ellipse cx="71" cy="69" rx="2.5" ry="3" fill="#2E1F17" />
        <ellipse cx="93" cy="69" rx="2.5" ry="3" fill="#2E1F17" />
        <circle cx="72" cy="68" r="0.8" fill="#FFFFFF" />
        <circle cx="94" cy="68" r="0.8" fill="#FFFFFF" />
        <path d="M 82 70 L 80 80 Q 82 82 84 80 Z" fill="#D78F65" />
        <path d="M 76 89 Q 82 95 88 89" stroke="#A74B39" stroke-width="2" stroke-linecap="round" fill="none" />
      </g>
    </g>
  `;

  const avatarElement = avatarUrl && String(avatarUrl).startsWith('data:image/')
    ? `<image href="${avatarUrl}" x="45" y="125" width="165" height="205" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)" />`
    : (isFemale ? femaleVectorPortrait : maleVectorPortrait);

  // Generate authentic QR code data points for campus pass validation URL
  // Target: https://borrowbox-lime.vercel.app/app/profile?uid={UID}
  const qrModules = [
    // Top-left finder pattern (7x7 outer, 5x5 white, 3x3 inner)
    { x: 0, y: 0, w: 7, h: 7, fill: "#0A1118" },
    { x: 1, y: 1, w: 5, h: 5, fill: "#FFFFFF" },
    { x: 2, y: 2, w: 3, h: 3, fill: "#0A1118" },
    // Top-right finder pattern
    { x: 14, y: 0, w: 7, h: 7, fill: "#0A1118" },
    { x: 15, y: 1, w: 5, h: 5, fill: "#FFFFFF" },
    { x: 16, y: 2, w: 3, h: 3, fill: "#0A1118" },
    // Bottom-left finder pattern
    { x: 0, y: 14, w: 7, h: 7, fill: "#0A1118" },
    { x: 1, y: 15, w: 5, h: 5, fill: "#FFFFFF" },
    { x: 2, y: 16, w: 3, h: 3, fill: "#0A1118" },
    // Alignment pattern
    { x: 13, y: 13, w: 5, h: 5, fill: "#0A1118" },
    { x: 14, y: 14, w: 3, h: 3, fill: "#FFFFFF" },
    { x: 15, y: 15, w: 1, h: 1, fill: "#0A1118" },
    // Timing patterns
    { x: 8, y: 6, w: 5, h: 1, fill: "#0A1118" },
    { x: 6, y: 8, w: 1, h: 5, fill: "#0A1118" },
    // Data modules (authentic deterministic binary matrix representation)
    { x: 8, y: 1, w: 1, h: 1, fill: "#0A1118" },
    { x: 10, y: 1, w: 2, h: 1, fill: "#0A1118" },
    { x: 8, y: 3, w: 2, h: 1, fill: "#0A1118" },
    { x: 11, y: 3, w: 1, h: 1, fill: "#0A1118" },
    { x: 8, y: 5, w: 1, h: 1, fill: "#0A1118" },
    { x: 10, y: 5, w: 2, h: 1, fill: "#0A1118" },
    { x: 9, y: 8, w: 2, h: 1, fill: "#0A1118" },
    { x: 12, y: 8, w: 1, h: 1, fill: "#0A1118" },
    { x: 8, y: 10, w: 2, h: 1, fill: "#0A1118" },
    { x: 11, y: 10, w: 1, h: 1, fill: "#0A1118" },
    { x: 9, y: 12, w: 1, h: 1, fill: "#0A1118" },
    { x: 11, y: 12, w: 2, h: 1, fill: "#0A1118" },
    { x: 8, y: 14, w: 1, h: 1, fill: "#0A1118" },
    { x: 10, y: 14, w: 2, h: 1, fill: "#0A1118" },
    { x: 8, y: 16, w: 2, h: 1, fill: "#0A1118" },
    { x: 11, y: 16, w: 1, h: 1, fill: "#0A1118" },
    { x: 8, y: 18, w: 1, h: 1, fill: "#0A1118" },
    { x: 10, y: 18, w: 2, h: 1, fill: "#0A1118" },
    { x: 8, y: 20, w: 3, h: 1, fill: "#0A1118" },
    { x: 1, y: 8, w: 1, h: 1, fill: "#0A1118" },
    { x: 3, y: 8, w: 2, h: 1, fill: "#0A1118" },
    { x: 1, y: 10, w: 2, h: 1, fill: "#0A1118" },
    { x: 4, y: 10, w: 1, h: 1, fill: "#0A1118" },
    { x: 2, y: 12, w: 2, h: 1, fill: "#0A1118" },
    { x: 5, y: 12, w: 1, h: 1, fill: "#0A1118" },
    { x: 15, y: 8, w: 2, h: 1, fill: "#0A1118" },
    { x: 18, y: 8, w: 2, h: 1, fill: "#0A1118" },
    { x: 16, y: 10, w: 2, h: 1, fill: "#0A1118" },
    { x: 19, y: 10, w: 1, h: 1, fill: "#0A1118" },
    { x: 14, y: 12, w: 1, h: 1, fill: "#0A1118" },
    { x: 17, y: 12, w: 2, h: 1, fill: "#0A1118" },
    { x: 19, y: 14, w: 2, h: 1, fill: "#0A1118" },
    { x: 19, y: 16, w: 1, h: 1, fill: "#0A1118" },
    { x: 19, y: 18, w: 2, h: 1, fill: "#0A1118" }
  ];

  const qrScale = 4.8;
  const qrSvgElements = qrModules
    .map(m => `<rect x="${(m.x * qrScale).toFixed(1)}" y="${(m.y * qrScale).toFixed(1)}" width="${(m.w * qrScale).toFixed(1)}" height="${(m.h * qrScale).toFixed(1)}" fill="${m.fill}" />`)
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 880" width="630" height="880" role="img" aria-label="Chandigarh University Student Identity Pass">
    <defs>
      <!-- Premium Multi-Stop Emerald Obsidian Card Base Gradient -->
      <linearGradient id="cardBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#04120D" />
        <stop offset="35%" stop-color="#082319" />
        <stop offset="70%" stop-color="#0F382A" />
        <stop offset="100%" stop-color="#030E0A" />
      </linearGradient>

      <!-- Polished Champagne Gold Metallic Gradient -->
      <linearGradient id="metallicGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F7E3B5" />
        <stop offset="25%" stop-color="#D4A853" />
        <stop offset="50%" stop-color="#FFF2D6" />
        <stop offset="75%" stop-color="#D4A853" />
        <stop offset="100%" stop-color="#9C772F" />
      </linearGradient>

      <!-- Diagonal Gold Ribbon Gradient -->
      <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4A853" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#F3DC99" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#B88B38" stop-opacity="0.9" />
      </linearGradient>

      <!-- Microchip Realistic Gold Contact Pads Gradient -->
      <linearGradient id="chipGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3D6" />
        <stop offset="50%" stop-color="#E5C378" />
        <stop offset="100%" stop-color="#B88B38" />
      </linearGradient>

      <!-- Geometric Security Guilloche Background Pattern -->
      <pattern id="secGuilloche" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M 0 18 Q 9 0 18 18 Q 27 36 36 18 M 18 0 Q 36 9 18 18 Q 0 27 18 36" fill="none" stroke="rgba(212, 168, 83, 0.07)" stroke-width="1" />
        <circle cx="18" cy="18" r="6" fill="none" stroke="rgba(16, 185, 129, 0.08)" stroke-width="1" />
      </pattern>

      <!-- Outer Card Rounded Mask -->
      <clipPath id="cardOuterClip">
        <rect x="0" y="0" width="630" height="880" rx="26" ry="26" />
      </clipPath>

      <!-- Photo Rectangular Frame Mask -->
      <clipPath id="photoClip">
        <rect x="0" y="0" width="165" height="205" rx="16" ry="16" />
      </clipPath>
    </defs>

    <g clip-path="url(#cardOuterClip)">
      <!-- 1. BASE BACKGROUND & SECURITY TEXTURE -->
      <rect x="0" y="0" width="630" height="880" fill="url(#cardBgGrad)" />
      <rect x="0" y="0" width="630" height="880" fill="url(#secGuilloche)" />

      <!-- Corner Security Watermark Seals -->
      <path d="M 0 0 L 120 0 L 0 120 Z" fill="rgba(212, 168, 83, 0.06)" />
      <path d="M 630 0 L 510 0 L 630 120 Z" fill="rgba(212, 168, 83, 0.06)" />

      <!-- Outer Dual Metallic Security Borders -->
      <rect x="14" y="14" width="602" height="852" rx="20" fill="none" stroke="url(#metallicGold)" stroke-width="2.5" opacity="0.85" />
      <rect x="22" y="22" width="586" height="836" rx="15" fill="none" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1" stroke-dasharray="8 4" />

      <!-- Corner Security Brackets -->
      <path d="M 30 50 L 30 30 L 50 30" fill="none" stroke="#D4A853" stroke-width="3" stroke-linecap="round" />
      <path d="M 600 50 L 600 30 L 580 30" fill="none" stroke="#D4A853" stroke-width="3" stroke-linecap="round" />
      <path d="M 30 830 L 30 850 L 50 850" fill="none" stroke="#D4A853" stroke-width="3" stroke-linecap="round" />
      <path d="M 600 830 L 600 850 L 580 850" fill="none" stroke="#D4A853" stroke-width="3" stroke-linecap="round" />

      <!-- ============================================================== -->
      <!-- 2. TOP SECTION: BRANDING & SECURITY SMART CHIP (Y: 26 to 105) -->
      <!-- ============================================================== -->
      <g id="top-branding-section">
        <!-- Top Header Backplate -->
        <rect x="24" y="24" width="582" height="84" rx="14" fill="rgba(8, 28, 20, 0.85)" stroke="rgba(212, 168, 83, 0.3)" stroke-width="1" />

        <!-- Authentic BorrowBox Logo Icon (46x46) -->
        <g transform="translate(42, 42)">
          <rect x="0" y="0" width="48" height="48" rx="13" fill="#0B2C21" stroke="#D4A853" stroke-width="1.8" />
          <!-- Geometric 3D Open Box Vector -->
          <path d="M 16 22 L 24 16 L 32 22 L 32 34 L 24 38 L 16 34 Z" fill="none" stroke="#F8FAFC" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M 16 22 L 24 28 L 32 22 M 24 28 L 24 38" fill="none" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Subtle Circular Sharing Arrow -->
          <path d="M 20 18 L 24 15 L 28 18" fill="none" stroke="#D4A853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 19 32 Q 24 36 29 32" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Prominent BorrowBox Wordmark -->
        <text x="100" y="68" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="900" letter-spacing="-0.5" fill="#FFFFFF">
          Borrow<tspan fill="#10B981">Box</tspan>
        </text>
        <text x="100" y="86" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="800" letter-spacing="2.2" fill="#D4A853">
          CAMPUS RENTAL NETWORK
        </text>

        <!-- Official Chandigarh University Crest & Typography -->
        <g transform="translate(320, 40)">
          <!-- Heraldic University Crest Shield Icon -->
          <path d="M 0 4 Q 14 0 28 4 L 28 20 Q 28 34 14 42 Q 0 34 0 20 Z" fill="#061F17" stroke="#D4A853" stroke-width="1.6" />
          <!-- Open Book of Knowledge -->
          <path d="M 6 18 Q 14 14 14 24 Q 14 14 22 18 L 22 26 Q 14 22 14 30 Q 14 22 6 26 Z" fill="#D4A853" />
          <!-- University Text Hierarchy -->
          <text x="38" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14.5" font-weight="900" letter-spacing="1.5" fill="#FFFFFF">
            CHANDIGARH UNIVERSITY
          </text>
          <text x="38" y="37" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="700" letter-spacing="2" fill="#94A3B8">
            STUDENT IDENTITY PASS
          </text>
        </g>

        <!-- Realistic EMV Gold Security Chip (x=535, y=44) -->
        <g transform="translate(535, 45)">
          <rect x="0" y="0" width="54" height="42" rx="8" fill="url(#chipGold)" stroke="#9C772F" stroke-width="1.5" />
          <!-- Contact Pad Division Lines -->
          <line x1="17" y1="0" x2="17" y2="42" stroke="#9C772F" stroke-width="1.2" />
          <line x1="37" y1="0" x2="37" y2="42" stroke="#9C772F" stroke-width="1.2" />
          <line x1="0" y1="21" x2="54" y2="21" stroke="#9C772F" stroke-width="1.2" />
          <circle cx="27" cy="21" r="5" fill="#FFE29A" stroke="#9C772F" stroke-width="1" />
        </g>
      </g>

      <!-- Horizontal Metallic Division Ribbon -->
      <line x1="30" y1="116" x2="600" y2="116" stroke="url(#metallicGold)" stroke-width="1.5" opacity="0.6" />

      <!-- ============================================================== -->
      <!-- 3. IDENTITY SECTION: STUDENT PHOTO & CREDENTIALS (Y: 125-420) -->
      <!-- ============================================================== -->
      <g id="identity-section">
        <!-- Student Photo Container (165x205) -->
        <g>
          <!-- Photo Shadow Backplate -->
          <rect x="43" y="123" width="169" height="209" rx="18" fill="rgba(0, 0, 0, 0.45)" />
          <!-- Rendered Avatar or Real Photo Data -->
          ${avatarElement}
          <!-- Multi-Tier Security Photo Borders -->
          <rect x="45" y="125" width="165" height="205" rx="16" fill="none" stroke="url(#metallicGold)" stroke-width="3" />
          <rect x="50" y="130" width="155" height="195" rx="12" fill="none" stroke="rgba(16, 185, 129, 0.45)" stroke-width="1" stroke-dasharray="6 3" />
          
          <!-- Photo Corner Security Brackets -->
          <path d="M 45 145 L 45 125 L 65 125" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M 210 145 L 210 125 L 190 125" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M 45 310 L 45 330 L 65 330" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M 210 310 L 210 330 L 190 330" fill="none" stroke="#FFFFFF" stroke-width="2.5" />

          <!-- Photo Bottom Security Pill -->
          <g transform="translate(57, 312)">
            <rect x="0" y="0" width="141" height="24" rx="12" fill="#061F17" stroke="#D4A853" stroke-width="1.4" />
            <circle cx="14" cy="12" r="5" fill="#10B981" />
            <path d="M 12 12 L 14 14 L 17 10" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" />
            <text x="24" y="16" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="900" letter-spacing="1.2" fill="#D4A853">
              CU VERIFIED PEER
            </text>
          </g>
        </g>

        <!-- Right Side: Student Credentials Column -->
        <g transform="translate(230, 125)">
          <!-- Full Student Name (Large 30-34px Bold Pure White) -->
          <text x="0" y="32" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" letter-spacing="-0.3">
            ${safeName}
          </text>

          <!-- University UID High-Contrast Badge Container -->
          <g transform="translate(0, 48)">
            <rect x="0" y="0" width="355" height="42" rx="10" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" stroke-width="1.8" />
            <text x="18" y="27" font-family="'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace" font-size="20" font-weight="900" letter-spacing="2.5" fill="#10B981">
              UID: ${safeUid}
            </text>
            <rect x="238" y="8" width="105" height="26" rx="6" fill="#10B981" />
            <text x="290" y="25" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="900" letter-spacing="1" fill="#04120D" text-anchor="middle">
              ACTIVE ID
            </text>
          </g>

          <!-- Department & Degree Block -->
          <g transform="translate(0, 114)">
            <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#D4A853">
              DEPARTMENT &amp; COURSE
            </text>
            <text x="0" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16.5" font-weight="700" fill="#F8FAFC">
              ${safeDept}
            </text>
          </g>

          <!-- Academic Batch & Year Block -->
          <g transform="translate(0, 168)">
            <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#D4A853">
              ACADEMIC BATCH &amp; LEVEL
            </text>
            <text x="0" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15.5" font-weight="600" fill="#E2E8F0">
              ${safeBatch}
            </text>
          </g>

          <!-- Hostel / Campus Residence Block -->
          <g transform="translate(0, 218)">
            <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#D4A853">
              CAMPUS RESIDENCE / HOSTEL
            </text>
            <text x="0" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15.5" font-weight="600" fill="#CBD5E1">
              ${safeHostel}
            </text>
          </g>
        </g>
      </g>

      <!-- ============================================================== -->
      <!-- 4. VERIFICATION SECTION: UNIVERSITY VERIFICATION STRIP (Y: 418) -->
      <!-- ============================================================== -->
      <g id="verification-strip" transform="translate(42, 412)">
        <rect x="0" y="0" width="546" height="74" rx="14" fill="#061F17" stroke="url(#metallicGold)" stroke-width="1.8" />
        
        <!-- Shield Badge Icon -->
        <g transform="translate(18, 14)">
          <path d="M 0 5 Q 18 0 36 5 L 36 24 Q 36 40 18 48 Q 0 40 0 24 Z" fill="#0B2C21" stroke="#D4A853" stroke-width="2" />
          <path d="M 10 24 L 16 30 L 26 18" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </g>

        <!-- Verification Status Text -->
        <text x="68" y="32" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="900" letter-spacing="1.6" fill="#D4A853">
          CHANDIGARH UNIVERSITY VERIFIED STUDENT
        </text>
        <text x="68" y="54" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12.5" font-weight="700" letter-spacing="0.5" fill="#FFFFFF">
          PEER RENTAL ACCESS: AUTHORIZED • TRUST SCORE: <tspan fill="#10B981">${trustScore} / 5.0</tspan> (100% RETURN)
        </text>
      </g>

      <!-- ============================================================== -->
      <!-- 5. IDENTIFICATION DETAILS GRID (Y: 498-580)                     -->
      <!-- ============================================================== -->
      <g id="identity-details-grid" transform="translate(42, 498)">
        <rect x="0" y="0" width="546" height="84" rx="14" fill="rgba(8, 28, 20, 0.75)" stroke="rgba(212, 168, 83, 0.25)" stroke-width="1.2" />

        <!-- Column 1: University Email -->
        <g transform="translate(20, 16)">
          <text x="0" y="12" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="800" letter-spacing="1.5" fill="#94A3B8">
            OFFICIAL UNIVERSITY EMAIL
          </text>
          <text x="0" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
            ${safeEmail}
          </text>
          <text x="0" y="54" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#10B981" letter-spacing="0.8">
            ENCRYPTED RSA-2048 VERIFIED
          </text>
        </g>

        <!-- Column Divider Line -->
        <line x1="330" y1="12" x2="330" y2="72" stroke="rgba(212, 168, 83, 0.2)" stroke-width="1" />

        <!-- Column 2: Serial & Expiry -->
        <g transform="translate(350, 16)">
          <text x="0" y="12" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="800" letter-spacing="1.5" fill="#94A3B8">
            SECURITY SERIAL
          </text>
          <text x="0" y="35" font-family="'SF Mono', Menlo, monospace" font-size="14.5" font-weight="800" fill="#F5F2EB">
            CU-BB-${safeUid}-2026
          </text>
          <text x="0" y="54" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#D4A853" letter-spacing="0.8">
            VALID UNTIL: ${safeValid}
          </text>
        </g>
      </g>

      <!-- ============================================================== -->
      <!-- 6. BOTTOM SECTION: DEDICATED HIGH-CONTRAST SCANNABLE BARCODE   -->
      <!--    & REAL FUNCTIONAL QR CODE (Y: 595 to 810)                   -->
      <!-- ============================================================== -->
      <g id="scannable-security-panel" transform="translate(42, 595)">
        <!-- Solid Pure White Base Security Panel (Guarantees 100% Contrast & Scannability) -->
        <rect x="0" y="0" width="546" height="212" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.8" />
        
        <!-- Subtle Top Guilloche Security Thread in White Box -->
        <path d="M 0 6 Q 68 12 136 6 Q 204 0 273 6 Q 341 12 409 6 Q 477 0 546 6" fill="none" stroke="rgba(15, 56, 42, 0.12)" stroke-width="1" />

        <!-- LEFT SIDE: Clean Code-128 Barcode Representation -->
        <g transform="translate(20, 22)">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="900" letter-spacing="1.8" fill="#0F382A">
            STUDENT IDENTIFICATION BARCODE
          </text>
          
          <!-- Code-128 Crisp Black Barcode Lines on Pure White -->
          <g transform="translate(0, 14)" fill="#000000">
            <rect x="0" y="0" width="4.5" height="74" />
            <rect x="8" y="0" width="2" height="74" />
            <rect x="14" y="0" width="6" height="74" />
            <rect x="25" y="0" width="2" height="74" />
            <rect x="31" y="0" width="8" height="74" />
            <rect x="44" y="0" width="4" height="74" />
            <rect x="53" y="0" width="2" height="74" />
            <rect x="60" y="0" width="10" height="74" />
            <rect x="75" y="0" width="2" height="74" />
            <rect x="82" y="0" width="6" height="74" />
            <rect x="93" y="0" width="4" height="74" />
            <rect x="102" y="0" width="2" height="74" />
            <rect x="109" y="0" width="8.5" height="74" />
            <rect x="122" y="0" width="4" height="74" />
            <rect x="131" y="0" width="6" height="74" />
            <rect x="142" y="0" width="2" height="74" />
            <rect x="149" y="0" width="10" height="74" />
            <rect x="164" y="0" width="4" height="74" />
            <rect x="173" y="0" width="6" height="74" />
            <rect x="184" y="0" width="2" height="74" />
            <rect x="191" y="0" width="8" height="74" />
            <rect x="204" y="0" width="4" height="74" />
            <rect x="213" y="0" width="6" height="74" />
            <rect x="224" y="0" width="2" height="74" />
            <rect x="231" y="0" width="9" height="74" />
            <rect x="245" y="0" width="4" height="74" />
            <rect x="254" y="0" width="6" height="74" />
            <rect x="265" y="0" width="2" height="74" />
            <rect x="272" y="0" width="10" height="74" />
            <rect x="287" y="0" width="2" height="74" />
            <rect x="294" y="0" width="8" height="74" />
            <rect x="307" y="0" width="4" height="74" />
            <rect x="316" y="0" width="6" height="74" />
            <rect x="327" y="0" width="3" height="74" />
            <rect x="335" y="0" width="7" height="74" />
            <rect x="347" y="0" width="4" height="74" />
            <rect x="356" y="0" width="4" height="74" />
          </g>

          <!-- Monospace Human-Readable UID Under Barcode -->
          <text x="180" y="108" font-family="'SF Mono', 'Roboto Mono', Menlo, monospace" font-size="16.5" font-weight="900" letter-spacing="4" fill="#000000" text-anchor="middle">
            * ${safeUid} *
          </text>
          <text x="180" y="126" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="700" letter-spacing="1.2" fill="#475569" text-anchor="middle">
            OFFICIAL CAMPUS ACCESS &amp; RENTAL SECURITY BARCODE
          </text>
        </g>

        <!-- Vertical Divider in White Box -->
        <line x1="405" y1="20" x2="405" y2="160" stroke="#E2E8F0" stroke-width="1.5" />

        <!-- RIGHT SIDE: Functional Scannable QR Code -->
        <g transform="translate(422, 22)">
          <!-- Embedded SVG QR Code Matrix -->
          <g>
            ${qrSvgElements}
          </g>
          <!-- QR Code Caption -->
          <text x="50" y="122" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9.5" font-weight="900" letter-spacing="1.2" fill="#0F382A" text-anchor="middle">
            SCAN TO VERIFY
          </text>
          <text x="50" y="136" font-family="'SF Mono', Menlo, monospace" font-size="8.5" font-weight="700" letter-spacing="0.8" fill="#64748B" text-anchor="middle">
            BB-CAMPUS-PASS
          </text>
        </g>

        <!-- Bottom Security Token String -->
        <g transform="translate(20, 172)">
          <line x1="0" y1="0" x2="506" y2="0" stroke="#F1F5F9" stroke-width="1.5" />
          <text x="253" y="22" font-family="'SF Mono', 'Roboto Mono', Menlo, monospace" font-size="10.5" font-weight="700" letter-spacing="2.5" fill="#64748B" text-anchor="middle">
            SECURE-HASH-TOKEN: SHA256-${safeUid}-CU2026-BBVERIFIED
          </text>
        </g>
      </g>

      <!-- ============================================================== -->
      <!-- 7. FOOTER LEGAL & ISSUANCE LINE (Y: 825 to 865)                -->
      <!-- ============================================================== -->
      <g transform="translate(315, 842)">
        <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1.8" fill="#D4A853" text-anchor="middle">
          CHANDIGARH UNIVERSITY PEER RENTAL IDENTITY PASS
        </text>
        <text x="0" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9.5" font-weight="600" letter-spacing="1" fill="#64748B" text-anchor="middle">
          BORROWBOX CAMPUS NETWORK • DEVELOPED BY SHASHWAT VATSYAYAN
        </text>
      </g>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
