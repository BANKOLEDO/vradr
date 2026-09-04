import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Navbar } from "../components/Navbar";
import { BrandMark } from "../components/Illustrations";
import { Flag } from "../components/Flag";
import { toast } from "../components/Toast";

const ORIGIN_COUNTRIES = [
  { name: "Nigeria", code: "NG" }, { name: "India", code: "IN" },
  { name: "Philippines", code: "PH" }, { name: "Pakistan", code: "PK" },
  { name: "Bangladesh", code: "BD" }, { name: "Kenya", code: "KE" },
  { name: "Ghana", code: "GH" }, { name: "Egypt", code: "EG" },
  { name: "South Africa", code: "ZA" }, { name: "Morocco", code: "MA" },
  { name: "Indonesia", code: "ID" }, { name: "Mexico", code: "MX" },
  { name: "Brazil", code: "BR" }, { name: "Turkey", code: "TR" },
  { name: "Ukraine", code: "UA" }, { name: "Colombia", code: "CO" },
  { name: "Argentina", code: "AR" }, { name: "Thailand", code: "TH" },
  { name: "Vietnam", code: "VN" }, { name: "China", code: "CN" },
  { name: "Japan", code: "JP" }, { name: "South Korea", code: "KR" },
  { name: "United States", code: "US" }, { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" }, { name: "Germany", code: "DE" },
  { name: "France", code: "FR" }, { name: "Australia", code: "AU" },
  { name: "Other", code: "XX" },
];

export function AuthPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const filtered = ORIGIN_COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCode = ORIGIN_COUNTRIES.find((c) => c.name === country)?.code;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flow === "signUp" && !country) { toast("Please select your country."); return; }
    if (!agreed) { toast("You must agree to the terms and privacy policy."); return; }
    setLoading(true);
    try {
      if (flow === "signUp") localStorage.setItem("vradr_signup_country", country);
      await signIn("password", new FormData(e.currentTarget));
    } catch {
      toast("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const toggleFlow = () => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setShowPassword(false); setCountry(""); setSearch(""); setCountryOpen(false); setEmail(""); setPassword(""); };

  return (
    <div className="dot-grid" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, var(--glow), transparent 60%)", pointerEvents: "none" }} />
      <div className="auth-dots" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.1 }} />

      <Navbar variant="auth" />

      <div className="auth-layout" style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 48 }}>
        <div style={{ display: "flex", width: "100%", maxWidth: 1120, alignItems: "center" }}>

          {/* left — visual (hidden on mobile) */}
          <div className="auth-visual" style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 48, paddingRight: 24 }}>
            <BrandMark size={48} />
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.04em", color: "var(--text)", marginTop: 24, marginBottom: 10, lineHeight: 1.1, textWrap: "balance" }}>
              {flow === "signIn" ? "Welcome back." : "Start tracking visas."}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", marginBottom: 28, textWrap: "pretty" }}>
              {flow === "signIn"
                ? "Live wait times, tracking, and alerts when processing windows shift."
                : "Compare destinations, track your applications, and get alerts when a window changes."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { num: "12", text: "destinations with live data" },
                { num: "6", text: "visa types tracked" },
                { num: "Nightly", text: "embassy re-scrape" },
              ].map((s) => (
                <div key={s.text} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)", minWidth: 52 }}>{s.num}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right — form */}
          <div className="auth-form-side" style={{ flex: "1 1 50%", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 24, paddingRight: 48 }}>
            <div style={{ width: "100%", maxWidth: 420 }}>

              {/* mobile-only heading */}
              <div className="auth-mobile-header" style={{ flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
                <BrandMark size={40} />
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text)", marginTop: 16, marginBottom: 6, textAlign: "center" }}>
                  {flow === "signIn" ? "Welcome back." : "Get started."}
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, textAlign: "center" }}>
                  {flow === "signIn" ? "Sign in to your account" : "Create your free account"}
                </p>
              </div>

              {/* form card */}
              <div style={{ padding: 28, borderRadius: 16, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {flow === "signUp" && (
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Where are you based?</label>
                      {!country ? (
                        <div style={{ position: "relative" }}>
                          <GlobeAltIcon width={16} height={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-muted)", pointerEvents: "none", zIndex: 1 }} />
                          <input type="text" placeholder="Search your country..." value={search}
                            onChange={(e) => { setSearch(e.target.value); setCountryOpen(true); }}
                            onFocus={() => setCountryOpen(true)}
                            style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "inherit", transition: "border-color 150ms, box-shadow 150ms" }}
                            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                            onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }} />
                          {countryOpen && (
                            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, maxHeight: 180, overflowY: "auto", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 10 }}>
                              {filtered.length === 0 && (
                                <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-muted)" }}>No countries found</div>
                              )}
                              {filtered.map((c) => (
                                <button key={c.code} type="button"
                                  onMouseDown={() => { setCountry(c.name); setSearch(c.name); setCountryOpen(false); }}
                                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "var(--text)", textAlign: "left", transition: "background 100ms" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                  <Flag code={c.code} style={{ width: 20, height: 15, borderRadius: 2, objectFit: "cover", border: "1px solid var(--border)" }} />
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                          <Flag code={selectedCode ?? "xx"} style={{ width: 22, height: 16, borderRadius: 2, objectFit: "cover" }} />
                          <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, flex: 1 }}>{country}</span>
                          <button type="button" onClick={() => { setCountry(""); setSearch(""); setCountryOpen(true); }}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", borderRadius: 4 }}>
                            <XMarkIcon width={14} height={14} />
                          </button>
                        </div>
                      )}
                      <input type="hidden" name="country" value={country} />
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
                    <div style={{ position: "relative" }}>
                      <EnvelopeIcon width={16} height={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                      <input name="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "inherit", transition: "border-color 150ms, box-shadow 150ms" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Password</label>
                    <div style={{ position: "relative" }}>
                      <LockClosedIcon width={16} height={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                      <input name="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "11px 40px 11px 40px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "inherit", transition: "border-color 150ms, box-shadow 150ms" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, display: "flex", alignItems: "center" }}>
                        {showPassword ? <EyeSlashIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
                      </button>
                    </div>
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      style={{ width: 16, height: 16, marginTop: 1, accentColor: "var(--accent)", cursor: "pointer", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      I agree to the{" "}
                      <Link to="/terms" onClick={(e) => e.stopPropagation()} style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 }}>Terms</Link>
                      {" "}and{" "}
                      <Link to="/privacy" onClick={(e) => e.stopPropagation()} style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 }}>Privacy Policy</Link>
                    </span>
                  </label>

                  <input type="hidden" name="flow" value={flow} />

                  <button type="submit" disabled={loading || !agreed || !email || password.length < 8 || (flow === "signUp" && !country)}
                    className="btn btn-primary"
                    style={{ width: "100%", minHeight: 44, fontSize: 14, fontWeight: 500, opacity: !agreed || loading || !email || password.length < 8 || (flow === "signUp" && !country) ? 0.4 : 1, cursor: !agreed || loading || !email || password.length < 8 || (flow === "signUp" && !country) ? "not-allowed" : "pointer", borderRadius: 10, marginTop: 4 }}>
                    {loading ? <ArrowPathIcon width={18} height={18} style={{ animation: "spin 1s linear infinite" }} /> : (
                      <>{flow === "signIn" ? "Sign In" : "Create Account"} <ArrowRightIcon width={15} height={15} /></>
                    )}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: 18, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                  {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={toggleFlow}
                    style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {flow === "signIn" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
