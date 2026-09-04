import type { CSSProperties } from "react";

export function StampIllustration({ size = 220 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      {/* perforated stamp */}
      <rect x="6" y="6" width="188" height="188" rx="22" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="9 7" fill="var(--bg-card)" />
      <rect x="26" y="26" width="148" height="148" rx="14" fill="var(--surface-glow)" stroke="var(--accent-2)" strokeWidth="1.3" />

      {/* gauge bowl */}
      <path d="M100 138 C 73 138 51 116 51 89 A 49 49 0 0 1 149 89 C 149 116 127 138 100 138 Z" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.2" />
      {/* track */}
      <path d="M100 104 A 38 38 0 0 1 138 66" fill="none" stroke="var(--border)" strokeWidth="7" strokeLinecap="round" />
      {/* filled arc ~ 21/30 */}
      <path d="M100 104 A 38 38 0 0 1 121 44" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />

      {/* readout */}
      <text x="100" y="66" textAnchor="middle" fill="var(--text)" fontSize="40" fontFamily="var(--font-display)" fontWeight="600" letterSpacing="-0.02em">21</text>
      <text x="100" y="82" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-body)" letterSpacing="0.1em">AVG WAIT</text>

      {/* trending-down badge */}
      <g>
        <circle cx="128" cy="154" r="13" fill="var(--accent-3)" opacity="0.9" />
        <path d="M123 150 l5 5 l7 -7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <text x="100" y="176" textAnchor="middle" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-body)" letterSpacing="0.12em">DOWN 3D THIS WEEK</text>

      {/* location dots */}
      <circle cx="40" cy="40" r="3" fill="var(--accent)" opacity="0.85" />
      <circle cx="160" cy="160" r="3" fill="var(--accent-2)" opacity="0.85" />
      <circle cx="160" cy="40" r="2.5" fill="var(--accent-3)" opacity="0.85" />
      <circle cx="40" cy="160" r="2.5" fill="var(--accent)" opacity="0.6" />
    </svg>
  );
}

/* Dot-matrix globe network — adapts to light and dark themes */
export function WorldWeb({ size = 420 }: { size?: number }) {
  const dots = [
    [220, 0], [155, 155], [0, 220], [-155, 155], [-220, 0], [-155, -155], [0, -220], [155, -155],
    [120, 120], [-120, 120], [-120, -120], [120, -120], [40, 190], [-40, 190], [40, -190], [-40, -190],
  ];
  return (
    <svg viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      <defs>
        <radialGradient id="webGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--glow)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <mask id="webMask">
          <circle cx="220" cy="220" r="300" fill="url(#webGlow)" />
        </mask>
      </defs>
      <circle cx="220" cy="220" r="300" fill="url(#webGlow)" />
      <circle cx="220" cy="220" r="220" stroke="var(--dot-strong)" strokeWidth="1" fill="none" />
      <circle cx="220" cy="220" r="170" stroke="var(--dot-strong)" strokeWidth="1" fill="none" opacity="0.8" />
      <circle cx="220" cy="220" r="120" stroke="var(--dot-strong)" strokeWidth="1" fill="none" opacity="0.8" />
      {/* horizontal + vertical chords */}
      <ellipse cx="220" cy="220" rx="220" ry="60" stroke="var(--dot-strong)" strokeWidth="1" fill="none" opacity="0.6" />
      <ellipse cx="220" cy="220" rx="60" ry="220" stroke="var(--dot-strong)" strokeWidth="1" fill="none" opacity="0.6" />
      <line x1="20" y1="220" x2="420" y2="220" stroke="var(--dot-strong)" strokeWidth="1" opacity="0.5" />
      <line x1="220" y1="20" x2="220" y2="420" stroke="var(--dot-strong)" strokeWidth="1" opacity="0.5" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={220 + x} cy={220 + y} r={i % 4 === 0 ? 3 : 2.2} fill={i % 4 === 1 ? "var(--accent)" : i % 4 === 2 ? "var(--accent-3)" : "var(--dot-strong)"} opacity={0.9} />
      ))}
    </svg>
  );
}

export function GlobeWithPlane({ size = 260 }: { size?: number }) {
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      <circle cx="130" cy="130" r="106" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="130" cy="130" r="74" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <circle cx="130" cy="130" r="42" stroke="var(--accent)" strokeWidth="0.8" opacity="0.18" />
      <ellipse cx="130" cy="130" rx="106" ry="38" stroke="var(--text)" strokeWidth="1" opacity="0.16" />
      <ellipse cx="130" cy="130" rx="40" ry="106" stroke="var(--text)" strokeWidth="0.8" opacity="0.12" transform="rotate(28 130 130)" />
      <ellipse cx="130" cy="130" rx="40" ry="106" stroke="var(--text)" strokeWidth="0.8" opacity="0.12" transform="rotate(-28 130 130)" />
      <line x1="24" y1="130" x2="236" y2="130" stroke="var(--text)" strokeWidth="0.5" opacity="0.1" />
      <line x1="130" y1="24" x2="130" y2="236" stroke="var(--text)" strokeWidth="0.5" opacity="0.1" />
      <circle cx="130" cy="130" r="3.5" fill="var(--accent)" opacity="0.85" />
      <circle cx="84" cy="96" r="2.5" fill="var(--olive)" opacity="0.6" />
      <circle cx="180" cy="104" r="2.5" fill="var(--olive)" opacity="0.6" />
      <circle cx="168" cy="164" r="2.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="106" cy="166" r="2" fill="var(--olive)" opacity="0.5" />
      <path d="M84 96 Q130 84 180 104" stroke="var(--accent)" strokeWidth="1.2" opacity="0.35" fill="none" strokeDasharray="5 5" />
      <path d="M180 104 Q176 132 168 164" stroke="var(--accent)" strokeWidth="1.2" opacity="0.3" fill="none" strokeDasharray="5 5" />
      <path d="M84 96 Q90 130 106 166" stroke="var(--olive)" strokeWidth="1.2" opacity="0.3" fill="none" strokeDasharray="5 5" />
      {/* plane */}
      <path d="M130 8 L142 44 L160 56 L150 62 L134 78 L136 96 L158 108 L154 132 L136 150 L152 178 L148 196 L136 180 L122 214 L114 186 L92 172 L108 152 L100 132 L124 118 L120 88 L96 70 L96 52 L116 46 Z"
        fill="var(--accent)" opacity="0.9" />
    </svg>
  );
}

export function PassportMark({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      <rect x="16" y="22" width="72" height="90" rx="6" stroke="var(--accent)" strokeWidth="2.5" fill="var(--bg-card)" />
      <rect x="22" y="28" width="60" height="78" rx="4" fill="var(--accent)" opacity="0.08" />
      <circle cx="52" cy="56" r="13" stroke="var(--accent)" strokeWidth="2" fill="var(--bg-card)" />
      <path d="M52 49 V56 L57 59" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <path d="M40 92 H64" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M88 36 H106 M88 50 H104 M88 64 H100" stroke="var(--olive)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="104" cy="26" r="3" fill="var(--olive)" opacity="0.6" />
    </svg>
  );
}

export function SparkleMark({ size = 40, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={style}>
      <path d="M20 4 C22 12 28 18 36 20 C28 22 22 28 20 36 C18 28 12 22 4 20 C12 18 18 12 20 4 Z" fill="var(--accent)" opacity="0.85" />
      <circle cx="32" cy="10" r="2.5" fill="var(--olive)" opacity="0.7" />
    </svg>
  );
}

export function Squiggle({ size = 60, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.4} style={style}>
      <path d="M2 14 C10 4 18 4 26 12 C34 20 42 20 50 12 C53 9 55 8 58 9" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/* Brand mark — black & white pattern bands with globe wireframe */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      <defs>
        <clipPath id="bmClip">
          <rect x="0" y="0" width="32" height="32" rx="9" />
        </clipPath>
      </defs>
      <rect clipPath="url(#bmClip)" x="0" y="0" width="32" height="32" fill="#1a1a1a" />
      <rect clipPath="url(#bmClip)" x="16" y="0" width="16" height="32" fill="#ffffff" />
      <g style={{ mixBlendMode: "exclusion" }}>
        <circle cx="16" cy="16" r="10.5" stroke="#fff" strokeWidth="1.3" opacity="0.9" />
        <ellipse cx="16" cy="16" rx="10.5" ry="4" stroke="#fff" strokeWidth="0.9" opacity="0.7" />
        <ellipse cx="16" cy="16" rx="4" ry="10.5" stroke="#fff" strokeWidth="0.9" opacity="0.7" />
        <circle cx="16" cy="16" r="1.6" fill="#fff" opacity="0.95" />
        <circle cx="11" cy="13" r="1" fill="#fff" opacity="0.75" />
        <circle cx="21" cy="13" r="1" fill="#fff" opacity="0.75" />
        <circle cx="18" cy="20" r="0.9" fill="#fff" opacity="0.6" />
      </g>
    </svg>
  );
}

/* Postage-stamp pattern motif for hero/cta space */
export function StampPattern({ size = 260 }: { size?: number }) {
  const o1 = "var(--accent)";
  const o2 = "var(--accent-2)";
  const o3 = "var(--accent-3)";
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={{ display: "block" }}>
      {/* perforated sheet */}
      <rect x="10" y="10" width="240" height="240" rx="14" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="8 6" />
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          <circle cx={22 + i * 16} cy={10} r="2" fill={i % 3 === 0 ? o1 : i % 3 === 1 ? o2 : o3} />
          <circle cx={22 + i * 16} cy={250} r="2" fill={i % 3 === 0 ? o3 : i % 3 === 1 ? o1 : o2} />
        </g>
      ))}
      {/* globe in combined tones */}
      <circle cx="130" cy="120" r="74" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="130" cy="120" r="48" stroke="var(--accent-3)" strokeWidth="2" opacity="0.9" />
      <circle cx="130" cy="120" r="24" stroke="var(--accent-2)" strokeWidth="2" opacity="0.9" />
      <ellipse cx="130" cy="120" rx="74" ry="28" stroke="var(--text)" strokeWidth="1.2" opacity="0.18" />
      <circle cx="130" cy="120" r="3" fill="var(--accent)" />
      <circle cx="92" cy="98" r="2.5" fill="var(--accent-2)" />
      <circle cx="168" cy="104" r="2.5" fill="var(--accent-3)" />
      <circle cx="160" cy="146" r="2.5" fill="var(--accent)" />
      <path d="M92 98 Q130 88 168 104" stroke="var(--accent-2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      <path d="M168 104 Q166 126 160 146" stroke="var(--accent-3)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      {/* plane */}
      <g transform="translate(130 44) scale(1.1)">
        <path d="M0 -8 L9 16 L22 24 L15 28 L4 38 L5 50 L20 58 L17 74 L4 66 L-8 92 L-13 70 L-28 58 L-17 44 L-22 24 L-10 8 L-2 -8 Z" fill="var(--accent)" />
      </g>
      {/* corner marks */}
      <text x="40" y="236" fill="var(--accent-2)" fontSize="11" fontFamily="var(--font-display)" fontWeight="600" letterSpacing="0.06em">VRADR</text>
      <rect x="170" y="212" width="44" height="20" rx="4" fill="var(--accent)" opacity="0.12" />
      <text x="192" y="226" textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">21d</text>
    </svg>
  );
}

