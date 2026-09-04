import { useTheme } from "../lib/theme";
import {
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export function ThemeToggle({ light = false }: { light?: boolean }) {
  const { theme, toggle } = useTheme();
  const color = light ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  return (
    <button
      onClick={toggle}
      style={{
        width: 36,
        height: 36,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon width={18} height={18} style={{ color }} />
      ) : (
        <SunIcon width={18} height={18} style={{ color }} />
      )}
    </button>
  );
}
