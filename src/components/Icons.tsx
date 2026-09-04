export function GlobeNav({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} style={{ display: "block" }}>
      <circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#fff" strokeWidth="1" opacity="0.45" />
      <ellipse cx="16" cy="16" rx="5.5" ry="14" stroke="#fff" strokeWidth="1" opacity="0.45" />
      <ellipse cx="16" cy="16" rx="10" ry="14" stroke="#fff" strokeWidth="0.7" opacity="0.25" transform="rotate(25 16 16)" />
      <ellipse cx="16" cy="16" rx="10" ry="14" stroke="#fff" strokeWidth="0.7" opacity="0.25" transform="rotate(-25 16 16)" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#fff" strokeWidth="0.6" opacity="0.3" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="#fff" strokeWidth="0.6" opacity="0.3" />
      <circle cx="16" cy="16" r="2" fill="#fff" opacity="0.9" />
      <circle cx="10" cy="11" r="1.3" fill="#fff" opacity="0.6" />
      <circle cx="22" cy="12" r="1.3" fill="#fff" opacity="0.6" />
      <circle cx="19" cy="22" r="1.1" fill="#fff" opacity="0.5" />
      <path d="M10 11 Q13 9 16 11 Q19 13 22 12" stroke="#fff" strokeWidth="0.7" opacity="0.35" fill="none" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

export function GlobeHero() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <circle cx="300" cy="300" r="280" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />
      <circle cx="300" cy="300" r="200" stroke="var(--accent)" strokeWidth="1" opacity="0.2" />
      <circle cx="300" cy="300" r="120" stroke="var(--accent)" strokeWidth="0.8" opacity="0.15" />
      <ellipse cx="300" cy="300" rx="280" ry="100" stroke="var(--text)" strokeWidth="1" opacity="0.15" />
      <ellipse cx="300" cy="300" rx="200" ry="280" stroke="var(--text)" strokeWidth="0.8" opacity="0.1" transform="rotate(30 300 300)" />
      <ellipse cx="300" cy="300" rx="200" ry="280" stroke="var(--text)" strokeWidth="0.8" opacity="0.1" transform="rotate(-30 300 300)" />
      <line x1="20" y1="300" x2="580" y2="300" stroke="var(--text)" strokeWidth="0.5" opacity="0.1" />
      <line x1="300" y1="20" x2="300" y2="580" stroke="var(--text)" strokeWidth="0.5" opacity="0.1" />
      <circle cx="300" cy="300" r="4" fill="var(--accent)" opacity="0.8" />
      <circle cx="180" cy="200" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="420" cy="220" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="350" cy="380" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="220" cy="360" r="2.5" fill="var(--olive)" opacity="0.5" />
      <circle cx="400" cy="340" r="2.5" fill="var(--olive)" opacity="0.5" />
      <circle cx="260" cy="180" r="2" fill="var(--olive)" opacity="0.4" />
      <path d="M180 200 Q240 160 300 200 Q360 240 420 220" stroke="var(--accent)" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4 4" />
      <path d="M300 200 Q320 290 350 380" stroke="var(--accent)" strokeWidth="1" opacity="0.2" fill="none" strokeDasharray="4 4" />
      <path d="M180 200 Q200 280 220 360" stroke="var(--olive)" strokeWidth="1" opacity="0.2" fill="none" strokeDasharray="4 4" />
    </svg>
  );
}

export function VisaCard() {
  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <rect x="1" y="1" width="278" height="178" rx="16" stroke="var(--border-strong)" strokeWidth="1" fill="var(--bg-card)" />
      <rect x="20" y="20" width="40" height="28" rx="4" fill="var(--accent)" opacity="0.15" />
      <text x="40" y="38" textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">VISA</text>
      <rect x="20" y="60" width="120" height="8" rx="4" fill="var(--text)" opacity="0.08" />
      <rect x="20" y="76" width="80" height="6" rx="3" fill="var(--text)" opacity="0.05" />
      <rect x="20" y="100" width="240" height="1" fill="var(--border)" />
      <rect x="20" y="116" width="60" height="6" rx="3" fill="var(--text)" opacity="0.06" />
      <rect x="20" y="130" width="40" height="6" rx="3" fill="var(--text)" opacity="0.04" />
      <rect x="200" y="116" width="60" height="24" rx="12" fill="var(--accent)" opacity="0.12" />
      <text x="230" y="132" textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--font-body)" fontWeight="500">21d</text>
      <circle cx="248" cy="28" r="16" fill="var(--accent)" opacity="0.08" />
      <circle cx="262" cy="28" r="16" fill="var(--olive)" opacity="0.06" />
    </svg>
  );
}

export function PlaneIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <path d="M4 26L20 22L26 6L30 8L24 24L42 28L44 24L46 25L44 28L46 31L44 32L42 28L24 32L30 48L26 46L20 30L4 26Z" fill="var(--accent)" opacity="0.9" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <circle cx="24" cy="24" r="20" stroke="var(--accent)" strokeWidth="2.5" opacity="0.35" />
      <circle cx="24" cy="24" r="20" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="80 47" opacity="0.85" />
      <line x1="24" y1="24" x2="24" y2="12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="24" x2="32" y2="28" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="var(--accent)" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <path d="M24 4C24 4 14 4 14 18V28L10 34H38L34 28V18C34 4 24 4 24 4Z" stroke="var(--accent)" strokeWidth="2.5" fill="var(--accent)" fillOpacity="0.15" />
      <path d="M20 34V36C20 38.2 21.8 40 24 40C26.2 40 28 38.2 28 36V34" stroke="var(--accent)" strokeWidth="2.5" opacity="0.7" />
      <circle cx="24" cy="18" r="2.5" fill="var(--accent)" opacity="0.8" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <rect x="6" y="28" width="8" height="14" rx="2" fill="var(--accent)" opacity="0.45" />
      <rect x="16" y="20" width="8" height="22" rx="2" fill="var(--accent)" opacity="0.65" />
      <rect x="26" y="12" width="8" height="30" rx="2" fill="var(--accent)" opacity="0.9" />
      <rect x="36" y="24" width="8" height="18" rx="2" fill="var(--accent)" opacity="0.55" />
      <path d="M10 26L20 18L30 10L40 22" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <circle cx="22" cy="22" r="14" stroke="var(--accent)" strokeWidth="2.5" opacity="0.6" />
      <line x1="32" y1="32" x2="42" y2="42" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <circle cx="22" cy="22" r="6" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <path d="M24 4L6 12V22C6 34 14 42 24 46C34 42 42 34 42 22V12L24 4Z" stroke="var(--accent)" strokeWidth="2.5" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M18 24L22 28L30 18" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}

export function DocReviewIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <rect x="8" y="4" width="24" height="32" rx="3" stroke="var(--accent)" strokeWidth="2.5" fill="var(--accent)" fillOpacity="0.1" />
      <rect x="16" y="12" width="24" height="32" rx="3" stroke="var(--accent)" strokeWidth="2.5" fill="var(--bg-card)" />
      <line x1="22" y1="22" x2="34" y2="22" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="22" y1="28" x2="30" y2="28" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="34" x2="34" y2="34" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="36" cy="36" r="8" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="2" />
      <path d="M33 36L35 38L39 34" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}
