/**
 * Generates high-definition vector artwork for the student Holographic ID Card.
 * Adheres strictly to the professional campus design language and zero-emoji policy.
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
  trustScore = '5.0'
}) {
  const initial = fullName ? fullName.charAt(0).toUpperCase() : 'S';
  const roleLabel = role === 'admin' ? 'CAMPUS MODERATOR' : 'VERIFIED CAMPUS PEER';
  const cleanUid = (uid || email.split('@')[0]).toUpperCase();

  // Escape special XML characters
  const safeName = fullName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeUid = cleanUid.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeDept = department.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeHostel = hostelRoom.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const isFemale = gender === 'female' || String(avatarUrl).toLowerCase().includes('female');

  // Vector Default Student Portraits (100% self-contained inside SVG, immune to CORS or broken images)
  const maleVectorPortrait = `
    <g transform="translate(225, 160) scale(0.45)">
      <circle cx="200" cy="200" r="190" fill="#0F382A" />
      <g clip-path="url(#innerAvatarClip)">
        <path d="M 60 400 L 120 270 L 175 295 L 200 340 L 225 295 L 280 270 L 340 400 Z" fill="#061F17" />
        <polygon points="170,265 200,320 230,265 210,260 200,280 190,260" fill="#F8FAFC" />
        <polygon points="195,280 205,280 208,360 200,375 192,360" fill="#D4A853" />
        <path d="M 120 270 L 175 295 L 200 370 L 180 370 L 135 290 Z" fill="#0B2B20" />
        <path d="M 280 270 L 225 295 L 200 370 L 220 370 L 265 290 Z" fill="#0B2B20" />
        <rect x="180" y="210" width="40" height="60" rx="6" fill="#DFA074" />
        <ellipse cx="200" cy="180" rx="55" ry="68" fill="#F7C8A4" />
        <ellipse cx="145" cy="180" rx="9" ry="15" fill="#DFA074" />
        <ellipse cx="255" cy="180" rx="9" ry="15" fill="#DFA074" />
        <path d="M 145 165 C 142 120, 160 95, 200 95 C 240 95, 258 120, 255 165 C 250 145, 240 135, 200 135 C 160 135, 150 145, 145 165 Z" fill="#1C1917" />
        <path d="M 148 150 C 146 125, 170 100, 205 100 C 235 100, 254 118, 252 145 C 235 130, 215 130, 190 135 C 170 139, 158 148, 148 150 Z" fill="#292524" />
        <ellipse cx="178" cy="168" rx="4.5" ry="5.5" fill="#1C1917" />
        <ellipse cx="222" cy="168" rx="4.5" ry="5.5" fill="#1C1917" />
        <circle cx="179.5" cy="166.5" r="1.5" fill="#FFFFFF" />
        <circle cx="223.5" cy="166.5" r="1.5" fill="#FFFFFF" />
        <path d="M 200 168 L 197 186 Q 200 190 203 186 Z" fill="#D58F61" />
        <path d="M 188 205 Q 200 216 212 205" stroke="#9A5034" stroke-width="3" stroke-linecap="round" fill="none" />
      </g>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#D4A853" stroke-width="8" opacity="0.9" />
    </g>
  `;

  const femaleVectorPortrait = `
    <g transform="translate(225, 160) scale(0.45)">
      <circle cx="200" cy="200" r="190" fill="#0F382A" />
      <g clip-path="url(#innerAvatarClip)">
        <path d="M 130 180 C 120 280, 135 340, 160 370 L 240 370 C 265 340, 280 280, 270 180 Z" fill="#261A15" />
        <path d="M 60 400 L 125 280 L 175 305 L 200 345 L 225 305 L 275 280 L 340 400 Z" fill="#061F17" />
        <polygon points="175,275 200,325 225,275 210,270 200,285 190,270" fill="#F8FAFC" />
        <circle cx="155" cy="315" r="5" fill="#D4A853" />
        <rect x="183" y="215" width="34" height="60" rx="6" fill="#E2A67D" />
        <ellipse cx="200" cy="180" rx="50" ry="62" fill="#FCD5B5" />
        <ellipse cx="150" cy="182" rx="7.5" ry="12" fill="#E2A67D" />
        <ellipse cx="250" cy="182" rx="7.5" ry="12" fill="#E2A67D" />
        <path d="M 148 165 C 145 110, 165 92, 200 92 C 235 92, 255 110, 252 165 C 248 135, 230 120, 200 120 C 170 120, 152 135, 148 165 Z" fill="#3D291F" />
        <path d="M 148 165 C 146 195, 142 245, 158 275 C 160 260, 162 210, 160 180 Z" fill="#2E1F17" />
        <path d="M 252 165 C 254 195, 258 245, 242 275 C 240 260, 238 210, 240 180 Z" fill="#2E1F17" />
        <ellipse cx="179" cy="169" rx="4.5" ry="5.5" fill="#2E1F17" />
        <ellipse cx="221" cy="169" rx="4.5" ry="5.5" fill="#2E1F17" />
        <circle cx="180.5" cy="167.5" r="1.5" fill="#FFFFFF" />
        <circle cx="222.5" cy="167.5" r="1.5" fill="#FFFFFF" />
        <path d="M 200 170 L 198 186 Q 200 189 202 186 Z" fill="#D78F65" />
        <path d="M 189 205 Q 200 215 211 205" stroke="#A74B39" stroke-width="2.5" stroke-linecap="round" fill="none" />
      </g>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#D4A853" stroke-width="8" opacity="0.9" />
    </g>
  `;

  const avatarElement = avatarUrl && String(avatarUrl).startsWith('data:image/')
    ? `<image href="${avatarUrl}" x="225" y="160" width="180" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)" />`
    : (isFemale ? femaleVectorPortrait : maleVectorPortrait);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 880" width="630" height="880">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080C0A" />
        <stop offset="50%" stop-color="#0F382A" />
        <stop offset="100%" stop-color="#061F17" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F3DC99" />
        <stop offset="50%" stop-color="#D4A853" />
        <stop offset="100%" stop-color="#B88B38" />
      </linearGradient>

      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F382A" />
        <stop offset="100%" stop-color="#061F17" />
      </linearGradient>

      <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(212, 168, 83, 0.08)" stroke-width="1" />
      </pattern>

      <clipPath id="avatarClip">
        <rect x="225" y="160" width="180" height="180" rx="90" ry="90" />
      </clipPath>

      <clipPath id="innerAvatarClip">
        <circle cx="200" cy="200" r="190" />
      </clipPath>

      <clipPath id="cardClip">
        <rect x="0" y="0" width="630" height="880" rx="28" ry="28" />
      </clipPath>
    </defs>

    <g clip-path="url(#cardClip)">
      <!-- Main Card Background -->
      <rect x="0" y="0" width="630" height="880" fill="url(#bgGrad)" />
      <rect x="0" y="0" width="630" height="880" fill="url(#gridPattern)" />

      <!-- Outer Security Borders -->
      <rect x="14" y="14" width="602" height="852" rx="20" fill="none" stroke="rgba(212, 168, 83, 0.45)" stroke-width="2" />
      <rect x="24" y="24" width="582" height="832" rx="14" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

      <!-- Top Header Banner -->
      <rect x="25" y="25" width="580" height="90" fill="rgba(255, 255, 255, 0.03)" />
      
      <!-- BorrowBox and University Brand Text -->
      <text x="50" y="65" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="900" letter-spacing="3" fill="#D4A853">BORROWBOX</text>
      <text x="50" y="88" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="#94a3b8">CHANDIGARH UNIVERSITY</text>

      <!-- Security Microchip Vector -->
      <g transform="translate(520, 52)">
        <rect x="0" y="0" width="46" height="36" rx="6" fill="#ffd166" stroke="#c99700" stroke-width="1.5" />
        <line x1="14" y1="0" x2="14" y2="36" stroke="#c99700" stroke-width="1" />
        <line x1="32" y1="0" x2="32" y2="36" stroke="#c99700" stroke-width="1" />
        <line x1="0" y1="18" x2="46" y2="18" stroke="#c99700" stroke-width="1" />
      </g>

      <!-- Center Avatar Frame -->
      <circle cx="315" cy="250" r="96" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-dasharray="6 4" />
      <circle cx="315" cy="250" r="90" fill="#141c2b" />
      ${avatarElement}

      <!-- Role Badge -->
      <rect x="200" y="375" width="230" height="30" rx="15" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(212, 168, 83, 0.6)" stroke-width="1.5" />
      <text x="315" y="395" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#D4A853" text-anchor="middle">${roleLabel}</text>

      <!-- Student Name -->
      <text x="315" y="445" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="30" font-weight="800" fill="#ffffff" text-anchor="middle">${safeName}</text>

      <!-- Immutable Student UID Box -->
      <rect x="155" y="475" width="320" height="48" rx="10" fill="rgba(10, 14, 23, 0.85)" stroke="rgba(212, 168, 83, 0.3)" stroke-width="1.5" />
      <text x="315" y="505" font-family="'SF Mono', Menlo, Consolas, Monaco, monospace" font-size="18" font-weight="900" letter-spacing="3" fill="#10B981" text-anchor="middle">UID: ${safeUid}</text>

      <!-- Details Table Section -->
      <g transform="translate(60, 545)">
        <!-- Email Row -->
        <text x="0" y="24" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">EMAIL</text>
        <text x="140" y="24" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">${safeEmail}</text>

        <!-- Department Row -->
        <text x="0" y="58" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">CAMPUS</text>
        <text x="140" y="58" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">${safeDept}</text>

        <!-- Hostel Row -->
        <text x="0" y="92" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">LOCATION</text>
        <text x="140" y="92" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">${safeHostel}</text>

        <!-- Trust Score Row -->
        <text x="0" y="126" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">RATING</text>
        <text x="140" y="126" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="800" fill="#10b981">${trustScore} / 5.0 (100% Return Rate)</text>
      </g>

      <!-- Security Micro Barcode -->
      <g transform="translate(60, 740)">
        <rect x="0" y="0" width="510" height="2" fill="rgba(255, 255, 255, 0.15)" />
        <g fill="#94a3b8">
          <rect x="0" y="12" width="4" height="42" />
          <rect x="8" y="12" width="2" height="42" />
          <rect x="14" y="12" width="6" height="42" />
          <rect x="24" y="12" width="2" height="42" />
          <rect x="30" y="12" width="8" height="42" />
          <rect x="42" y="12" width="4" height="42" />
          <rect x="52" y="12" width="2" height="42" />
          <rect x="60" y="12" width="10" height="42" />
          <rect x="74" y="12" width="2" height="42" />
          <rect x="80" y="12" width="6" height="42" />
          <rect x="92" y="12" width="4" height="42" />
          <rect x="100" y="12" width="2" height="42" />
          <rect x="108" y="12" width="8" height="42" />
          <rect x="120" y="12" width="4" height="42" />
          <rect x="130" y="12" width="6" height="42" />
          <rect x="140" y="12" width="2" height="42" />
          <rect x="146" y="12" width="10" height="42" />
          <rect x="160" y="12" width="4" height="42" />
          <rect x="170" y="12" width="6" height="42" />
          <rect x="180" y="12" width="2" height="42" />
          <rect x="186" y="12" width="8" height="42" />
          <rect x="198" y="12" width="4" height="42" />
          <rect x="206" y="12" width="6" height="42" />
          <rect x="216" y="12" width="2" height="42" />
          <rect x="224" y="12" width="8" height="42" />
          <rect x="236" y="12" width="4" height="42" />
          <rect x="244" y="12" width="6" height="42" />
          <rect x="254" y="12" width="2" height="42" />
          <rect x="262" y="12" width="10" height="42" />
          <rect x="276" y="12" width="2" height="42" />
          <rect x="282" y="12" width="8" height="42" />
          <rect x="294" y="12" width="4" height="42" />
          <rect x="302" y="12" width="6" height="42" />
          <rect x="312" y="12" width="2" height="42" />
          <rect x="320" y="12" width="8" height="42" />
          <rect x="332" y="12" width="4" height="42" />
          <rect x="340" y="12" width="6" height="42" />
          <rect x="350" y="12" width="2" height="42" />
          <rect x="358" y="12" width="10" height="42" />
          <rect x="372" y="12" width="4" height="42" />
          <rect x="380" y="12" width="6" height="42" />
          <rect x="390" y="12" width="2" height="42" />
          <rect x="398" y="12" width="8" height="42" />
          <rect x="410" y="12" width="4" height="42" />
          <rect x="418" y="12" width="6" height="42" />
          <rect x="428" y="12" width="2" height="42" />
          <rect x="436" y="12" width="8" height="42" />
          <rect x="448" y="12" width="4" height="42" />
          <rect x="456" y="12" width="6" height="42" />
          <rect x="466" y="12" width="2" height="42" />
          <rect x="474" y="12" width="10" height="42" />
          <rect x="488" y="12" width="4" height="42" />
          <rect x="496" y="12" width="6" height="42" />
          <rect x="506" y="12" width="4" height="42" />
        </g>
        <text x="255" y="70" font-family="'SF Mono', Menlo, Consolas, Monaco, monospace" font-size="10" fill="#64748b" text-anchor="middle" letter-spacing="4">AUTH-TOKEN-HASH-VERIFIED</text>
      </g>

      <!-- Footer Policy Statement -->
      <text x="315" y="845" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="1">
        CHANDIGARH UNIVERSITY PEER LENDING IDENTITY PASS
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
