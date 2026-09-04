import { useState, useEffect } from "react";
import {
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

let _show: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  _show?.(msg);
}

export function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    _show = (m: string) => {
      setMsg(m);
      setVisible(true);
    };
    return () => { _show = null; };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 16,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      maxWidth: 420,
      width: "calc(100% - 32px)",
      padding: "12px 16px",
      borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      animation: "toast-in 300ms ease",
    }}>
      <ExclamationCircleIcon width={18} height={18} color="#dc2626" style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, color: "var(--text)", lineHeight: 1.4 }}>{msg}</span>
      <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2, display: "flex", flexShrink: 0 }}>
        <XMarkIcon width={16} height={16} />
      </button>
    </div>
  );
}
