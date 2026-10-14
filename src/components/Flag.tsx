import { useState } from "react";

export function Flag({
  code,
  className,
  style,
  fallback = code.toUpperCase(),
}: {
  code: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  if (failed) {
    return (
      <span
        className={className}
        title={fallback}
        style={{
          display: "inline-flex",
          minWidth: 18,
          ...style,
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={className}
      style={{
        background: "var(--bg-elevated)",
        opacity: loaded ? 1 : 0,
        ...style,
      }}
    />
  );
}