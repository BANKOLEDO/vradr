import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Flag } from "./Flag";

export type SelectOption = { value: string; label: string; code?: string };

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    if (open) {
      setQuery("");
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`dash-selectwrap ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`dash-selectbtn ${open ? "open" : ""} ${value ? "" : "placeholder"}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.code && <Flag code={selected.code} style={{ width: 20, height: 15 }} className="dash-select-flag" />}
        <span className="dash-select-val">{selected ? selected.label : placeholder || "Select an option"}</span>
        <ChevronDownIcon width={16} height={16} className={`dash-select-caret ${open ? "flip" : ""}`} />
      </button>
      {open && (
        <div className="dash-selectmenu" role="listbox">
          <div className="dash-select-search">
            <MagnifyingGlassIcon width={14} height={14} className="dash-select-search-ic" />
            <input
              ref={inputRef}
              className="dash-select-search-input"
              placeholder="Type to filter…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            />
          </div>
          <div className="dash-select-opts">
            {filtered.length === 0 && <div className="dash-select-empty">No options</div>}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={`dash-selectopt ${o.value === value ? "active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.code && <Flag code={o.code} style={{ width: 18, height: 13 }} />}
                <span className="dash-selectopt-label">{o.label}</span>
                {o.value === value && <CheckIcon width={15} height={15} className="dash-selectopt-check" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}