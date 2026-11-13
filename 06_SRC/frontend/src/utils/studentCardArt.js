/**
 * Generates high-definition vector artwork for the student Holographic ID Card.
 * Adheres strictly to the professional campus design language and zero-emoji policy.
 */

export function generateStudentCardSvg({
  fullName = 'Student User',
  uid = '23BCS12850',
  email = '23bcs12850@cuchd.in',
  avatarUrl = '',
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

  // If avatar is a valid data URI or image URL, render <image>, else vector monogram avatar
  const avatarElement = avatarUrl
    ? `<image href="${avatarUrl}" x="225" y="160" width="180" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)" />`
    : `<g>
        <circle cx="315" cy="250" r="88" fill="url(#avatarGrad)" />
        <text x="315" y="278" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="middle">${initial}</text>
       </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 880" width="630" height="880">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0e17" />
        <stop offset="50%" stop-color="#121824" />
        <stop offset="100%" stop-color="#070a10" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff7a00" />
        <stop offset="50%" stop-color="#ff9d33" />
        <stop offset="100%" stop-color="#ff6b00" />
      </linearGradient>

      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff7a00" />
        <stop offset="100%" stop-color="#b84600" />
      </linearGradient>

      <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
      </pattern>

      <clipPath id="avatarClip">
        <rect x="225" y="160" width="180" height="180" rx="90" ry="90" />
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
      <rect x="14" y="14" width="602" height="852" rx="20" fill="none" stroke="rgba(255, 122, 0, 0.4)" stroke-width="2" />
      <rect x="24" y="24" width="582" height="832" rx="14" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

      <!-- Top Header Banner -->
      <rect x="25" y="25" width="580" height="90" fill="rgba(255, 255, 255, 0.03)" />
      
      <!-- BorrowBox & University Brand Text -->
      <text x="50" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="3" fill="#ff7a00">BORROWBOX</text>
      <text x="50" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="#94a3b8">CHANDIGARH UNIVERSITY</text>

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
      <rect x="200" y="375" width="230" height="30" rx="15" fill="rgba(255, 122, 0, 0.15)" stroke="rgba(255, 122, 0, 0.6)" stroke-width="1.5" />
      <text x="315" y="395" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#ff9d33" text-anchor="middle">${roleLabel}</text>

      <!-- Student Name -->
      <text x="315" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="#ffffff" text-anchor="middle">${safeName}</text>

      <!-- Immutable Student UID Box -->
      <rect x="155" y="475" width="320" height="48" rx="10" fill="rgba(10, 14, 23, 0.85)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
      <text x="315" y="505" font-family="'SF Mono', Menlo, Consolas, Monaco, monospace" font-size="18" font-weight="900" letter-spacing="3" fill="#ff7a00" text-anchor="middle">UID: ${safeUid}</text>

      <!-- Details Table Section -->
      <g transform="translate(60, 545)">
        <!-- Email Row -->
        <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">EMAIL</text>
        <text x="140" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0">${safeEmail}</text>

        <!-- Department Row -->
        <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">CAMPUS</text>
        <text x="140" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">${safeDept}</text>

        <!-- Hostel Row -->
        <text x="0" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">LOCATION</text>
        <text x="140" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">${safeHostel}</text>

        <!-- Trust Score Row -->
        <text x="0" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1">RATING</text>
        <text x="140" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#10b981">${trustScore} / 5.0 (100% Return Rate)</text>
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
