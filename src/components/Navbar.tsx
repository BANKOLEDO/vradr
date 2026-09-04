import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { BrandMark } from "./Illustrations";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../lib/theme";

type NavbarVariant = "landing" | "auth" | "dashboard" | "docs";

interface NavbarProps {
  variant?: NavbarVariant;
  right?: React.ReactNode;
}

export function Navbar({ variant = "landing", right }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLanding = variant === "landing";
  const overDark = isLanding && !scrolled && theme === "dark";
  const collapsed = scrolled;

  return (
    <div className={`nav-shell${collapsed ? " collapsed" : ""}`} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "padding 400ms cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{
        maxWidth: collapsed ? 680 : 1200,
        margin: "0 auto",
        padding: "16px 0 0",
        transition: "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 20px", borderRadius: 999,
          border: collapsed ? "1px solid var(--border)" : "1px solid transparent",
          background: collapsed ? "var(--bg-card)" : "transparent",
          backdropFilter: collapsed ? "blur(12px)" : "none",
          transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <Link to="/" aria-label="VRADR home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <BrandMark size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: overDark ? "#fff" : "var(--text)" }}>VRADR</span>
          </Link>

          <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {right ?? (
              <>
                <ThemeToggle light={overDark} />
                {variant !== "dashboard" && (
                  <Link to="/dashboard" className="btn btn-primary" style={overDark ? { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", minHeight: 36 } : undefined}>
                    Get Started <ArrowRightIcon width={14} height={14} />
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
