import { useRef, useState, type ReactNode, type CSSProperties } from "react";

export function Tilt({
  children,
  max = 6,
  className,
  style,
  onClick,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [hover, setHover] = useState(false);

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        transform: hover ? transform : "perspective(700px) rotateX(0deg) rotateY(0deg)",
        transition: hover ? "transform 120ms ease-out" : "transform 380ms ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTransform(
          `perspective(700px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`
        );
      }}
    >
      {children}
    </div>
  );
}