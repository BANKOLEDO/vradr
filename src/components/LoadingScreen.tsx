import { BrandMark } from "./Illustrations";

export function LoadingScreen() {
  return (
    <div className="app-loading">
      <div className="app-loading-card">
        <div className="app-loading-mark">
          <BrandMark size={44} />
          <span className="app-loading-ring" />
        </div>
        <p className="app-loading-brand">VRADR</p>
        <p className="app-loading-sub">Loading the fastest ways in…</p>
      </div>
    </div>
  );
}