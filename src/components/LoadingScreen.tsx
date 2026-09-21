import { useEffect, useState } from "react";
import { BrandMark } from "./Illustrations";

export function LoadingScreen() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStuck(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app-loading">
      <div className="app-loading-card">
        <div className="app-loading-mark">
          <BrandMark size={44} />
          {!stuck && <span className="app-loading-ring" />}
        </div>
        <p className="app-loading-brand">VRADR</p>
        {stuck ? (
          <>
            <p className="app-loading-sub">Taking too long. The server may be asleep.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>
              Try again
            </button>
          </>
        ) : (
          <p className="app-loading-sub">Loading the fastest ways in…</p>
        )}
      </div>
    </div>
  );
}