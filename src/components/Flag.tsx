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
      alt={fallback}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}