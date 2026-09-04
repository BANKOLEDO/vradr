export function Sparkline({
  values,
  width = 72,
  height = 24,
  color,
}: {
  values: number[] | undefined;
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!values || values.length === 0) {
    return null;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  });
  const path = pts.join(" ");
  const last = pts[pts.length - 1].split(",");
  const line = `M0,${height} L${path.replace(/ /g, " L")} L${last[0]},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={path}
        fill="none"
        stroke={color ?? "var(--accent)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d={line} fill={color ?? "var(--accent)"} opacity="0.12" />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={color ?? "var(--accent)"} />
    </svg>
  );
}