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

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: scrolled ? "8px 0" : "12px 0",
          transition: "padding 200ms ease",
        }}>
          <Link to="/" aria-label="VRADR home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <BrandMark size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text)" }}>VRADR</span>
          </Link>

          <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {right ?? (
              <>
                <ThemeToggle light={theme === "dark"} />
                {variant !== "dashboard" && (
                  <Link to="/dashboard" className="btn btn-primary">
                    See live wait times <ArrowRightIcon width={14} height={14} />
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
