import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { BrandMark } from "../components/Illustrations";
import { Navbar } from "../components/Navbar";
import { FadeIn } from "../components/FadeIn";
import { Flag } from "../components/Flag";

const ledgerRows = [
  { country: "United States", code: "us", route: "Tourist", days: 21 },
  { country: "United States", code: "us", route: "B1/B2", days: 28 },
  { country: "United Kingdom", code: "gb", route: "Tourist", days: 12 },
  { country: "United Kingdom", code: "gb", route: "Work", days: 18 },
  { country: "Canada", code: "ca", route: "Tourist", days: 87 },
  { country: "Canada", code: "ca", route: "Work", days: 70 },
];

const FAQ = [
  { q: "What does VRADR actually do?", a: "It scrapes official embassy pages across 15 countries into one live timeline with trend lines and AI projections, tracks your applications with countdowns, drafts SOPs in your voice, rehearses interviews with scores, maps scholarships and work routes, and emails you the moment anything changes." },
  { q: "How accurate is the prediction?", a: "The model weighs historical patterns, seasonal peaks, and the freshest embassy data. It shows you a window rather than a single day, and accuracy improves as more verified reports arrive." },
  { q: "Do I need an account?", a: "Yes, and it's free. A quick signup unlocks the dashboard for any country and visa type, plus personalization, application tracking, and alerts. Terms and Privacy are always available below." },
  { q: "Which countries are covered?", a: "15 destinations live now: US, UK, Canada, Germany, Australia, Japan, France, India, Brazil, South Korea, Schengen, UAE, Spain, Poland, and New Zealand. More coming soon." },
  { q: "How do alerts work?", a: "Add an application to the tracker and VRADR notifies you when the reported window changes or new embassy data lands, before the shift costs you a plan." },
];

const STEPS = [
  { n: "01", title: "We scrape", desc: "Official embassy pages, re-checked every 12 hours. Every figure carries its source and its date." },
  { n: "02", title: "You track", desc: "Pin an application. Countdowns, checklists, and the full history behind your window." },
  { n: "03", title: "We alert", desc: "The moment your window or a deadline shifts, you get an email. Before it costs you a plan." },
];

const PREP = [
  { title: "SOP Studio", desc: "Drafts in your voice, then scored the way an officer would score them." },
  { title: "Mock interviews", desc: "Real officer-style questions for your country and visa, with model answers." },
  { title: "Roadmaps", desc: "Scholarships with deadlines, work routes, and the scams to avoid, step by step." },
];

const TICKER = [
  "15 destinations live",
  "15 visa routes",
  "Embassy pages re-checked every 12 hours",
  "Free to sign up",
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: 12 }}>
      <path d="M4 6l4 4 4-4" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <a href="#main" style={{ position: "absolute", left: -9999, top: 0 }}>Skip to content</a>

      <Navbar variant="landing" />

      {/* Hero: full-bleed terminal photo */}
      <header id="main" style={{ position: "relative", overflow: "hidden", background: "#000" }}>
        <img
          src="/img/hero-terminal.jpg"
          alt="Travelers silhouetted against terminal windows"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "176px 24px 88px", minHeight: "92svh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <FadeIn>
            <h1 className="display" style={{ margin: "0 0 20px", color: "#fff", textWrap: "balance", maxWidth: "16ch", overflowWrap: "anywhere" }}>
              Every visa wait, tracked live
            </h1>
          </FadeIn>
          <FadeIn delay={1}>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--on-ink)", maxWidth: "54ch", margin: "0 0 32px", textWrap: "pretty" }}>
              VRADR scrapes official embassy pages across 15 countries and 15 visa routes, keeps every reported window on a live timeline, and emails you the moment yours moves.
            </p>
          </FadeIn>
          <FadeIn delay={2}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Link to="/dashboard" className="btn btn-accent btn-lg">
                Check your wait time <ArrowRightIcon width={15} height={15} />
              </Link>
              <a href="#windows" className="btn btn-lg" style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff", background: "transparent" }}>
                See the windows
              </a>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Ticker */}
      <div style={{ background: "var(--ink)", color: "var(--paper-inv)", borderTop: "1px solid rgba(255,255,255,0.16)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "13px 24px", display: "flex", flexWrap: "wrap", gap: "10px 32px" }}>
          {TICKER.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span aria-hidden style={{ width: 7, height: 7, background: "var(--accent-2)" }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Live windows ledger */}
      <section id="windows" style={{ padding: "88px 24px", background: "var(--bg)" }}>
        <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="cta-cols" style={{ display: "grid", gap: 56, alignItems: "start", gridTemplateColumns: "0.9fr 1.1fr" }}>
            <div style={{ minWidth: 0 }}>
              <h2 className="heading-lg" style={{ margin: "0 0 14px", textWrap: "balance" }}>The current windows</h2>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--text-muted)", margin: "0 0 24px", textWrap: "pretty" }}>
                Starting figures from the seeded timeline. Inside, each route carries its full history, its trend, and an AI window that moves as embassy scrapes land.
              </p>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Open the live timeline <ArrowRightIcon width={15} height={15} />
              </Link>
            </div>
            <div className="card" style={{ padding: 0, minWidth: 0 }}>
              <div className="cmp-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 12, padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-strong)" }}>
                <span>Destination</span><span>Route</span><span>Days</span>
              </div>
              {ledgerRows.map((r, i) => (
                <div key={`${r.country}-${r.route}`} className="cmp-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 12, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Flag code={r.code} style={{ width: 28, height: 20, borderRadius: 2, objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.country}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.route}</span>
                  <span style={{ fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{r.days}d</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--ink)", padding: "88px 24px" }}>
        <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="heading-lg" style={{ margin: "0 0 32px", color: "var(--paper-inv)", textWrap: "balance", maxWidth: "24ch" }}>
            Set it once. It watches from there.
          </h2>
          <div className="steps-grid-dark">
            {STEPS.map((s) => (
              <div key={s.title}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.015em", color: "var(--paper-inv)", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--on-ink)", margin: 0, textWrap: "pretty" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Photo band: three frames of the wait */}
      <section aria-label="The work is the waiting" style={{ position: "relative", overflow: "hidden", background: "#000" }}>
        <div className="trio">
          {[
            { src: "/img/hero-window.jpg", alt: "Traveler silhouetted against tall airport windows" },
            { src: "/img/embassy-facade.jpg", alt: "Sunlit stone facade of an official building" },
            { src: "/img/plane-window.jpg", alt: "View out of an aircraft window onto the wing" },
          ].map((f) => (
            <div key={f.src} className="trio-cell">
              <img src={f.src} alt={f.alt} loading="lazy" />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", pointerEvents: "none" }}>
          <FadeIn style={{ width: "100%" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "64px 24px" }}>
            <h2 style={{ margin: "0 0 18px", color: "#fff", textWrap: "balance", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.03em", fontStretch: "88%", fontSize: "clamp(44px, 8vw, 110px)", lineHeight: 0.92 }}>
              The work is the waiting
            </h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--on-ink)", maxWidth: "56ch", textWrap: "pretty" }}>
              Queues, counters, consulates. Applications stall in all three, so VRADR watches the windows behind them and tells you the moment yours moves.
            </p>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Prep */}
      <section style={{ padding: "88px 24px", background: "var(--bg)" }}>
        <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="cta-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div style={{ position: "relative", minWidth: 0 }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, transform: "translate(16px, 16px)", background: "var(--accent-2)" }} />
              <img
                src="/img/docs-desk.jpg"
                alt="Application forms, a pen, and notes arranged on a desk"
                style={{ position: "relative", display: "block", width: "100%", height: "clamp(320px, 36vw, 480px)", objectFit: "cover", border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 className="heading-lg" style={{ margin: "0 0 8px", textWrap: "balance" }}>SOPs, interviews, roadmaps</h2>
              <div style={{ borderTop: "1px solid var(--border-strong)", marginTop: 24 }}>
                {PREP.map((p) => (
                  <div key={p.title} style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.015em", color: "var(--text)", margin: "0 0 8px" }}>{p.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", margin: 0, textWrap: "pretty" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Built with */}
      <section style={{ padding: "0 24px 88px", background: "var(--bg)" }}>
        <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="heading-lg" style={{ margin: "0 0 32px", textWrap: "balance" }}>What it runs on</h2>
          <ul className="stack-strip">
            {[
              { name: "Convex", logo: "https://cdn.simpleicons.org/convex", desc: "Your data updates live on every device, instantly. No refresh button, no waiting." },
              { name: "OpenAI", logo: "https://cdn.worldvectorlogo.com/logos/openai-2.svg", invert: true, desc: "Wait predictions, SOP drafts in your voice, and interview practice with scores." },
              { name: "Firecrawl", logo: "https://www.firecrawl.dev/favicon.ico", desc: "Embassy pages checked nightly, so every number is fresh, never stale." },
              { name: "AgentMail", logo: "https://agentmail.to/favicon.ico", desc: "Welcome notes, deadline reminders, and wait alerts land in your email." },
            ].map((s) => (
              <li key={s.name} className="stack-cell">
                <span className="stack-logo">
                  <img src={s.logo} alt={`${s.name} logo`} loading="lazy" className={s.invert ? "brandlogo brandlogo-invert" : "brandlogo"} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="stack-name">{s.name}</span>
                </span>
                <p className="stack-role">{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "0 24px 88px", background: "var(--bg)" }}>
        <FadeIn>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 className="heading-lg" style={{ margin: 0, textWrap: "balance" }}>Straight answers</h2>
          <div style={{ borderTop: "1px solid var(--border-strong)", marginTop: 24 }}>
            {FAQ.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "20px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      textAlign: "left",
                      lineHeight: 1.3,
                    }}
                  >
                    <span>{f.q}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? "240px" : "0",
                      overflow: "hidden",
                      transition: "max-height 240ms ease",
                    }}
                  >
                    <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", textWrap: "pretty", maxWidth: "64ch" }}>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section data-cta="fresh" style={{ position: "relative", overflow: "hidden", background: "#000" }}>
        <img src="/img/skyline-window.jpg" alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)", pointerEvents: "none" }} />
        <div className="cta-flex" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "96px 24px" }}>
          <div aria-hidden style={{ flex: "0 1 380px", minWidth: 0, position: "relative" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, transform: "translate(14px, 14px)", background: "var(--accent-2)" }} />
            <div style={{ position: "relative", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <BrandMark size={22} />
                <span className="micro" style={{ color: "var(--text-muted)" }}>Example card</span>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <p style={{ margin: "0 0 2px", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text)" }}>United States</p>
                <p className="micro" style={{ color: "var(--text-muted)", margin: "0 0 14px" }}>B1/B2 tourist</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "var(--text)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>28</span>
                  <span style={{ fontSize: 16, color: "var(--text-muted)" }}>days</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>Seeded baseline. The live card adds trend and AI window.</p>
              </div>
            </div>
          </div>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <h2 className="heading-lg" style={{ margin: "0 0 12px", color: "var(--paper-inv)", textWrap: "balance" }}>See your window in ten seconds</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--on-ink)", margin: "0 0 24px", textWrap: "pretty" }}>
              Create a free account, then check any country and visa type. Personalize it, track applications, and get alerts as windows shift.
            </p>
            <Link to="/dashboard" className="btn btn-accent btn-lg">
              Open the dashboard <ArrowRightIcon width={15} height={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--ink)" }}>
        <div className="footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "28px 24px" }}>
          <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrandMark size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--paper-inv)" }}>VRADR</span>
          </div>
          <div className="footer-links" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link to="/terms" style={{ color: "var(--on-ink)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Terms</Link>
            <Link to="/privacy" style={{ color: "var(--on-ink)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Privacy</Link>
          </div>
          <a className="footer-top" href="#main" style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", color: "var(--on-ink-dim)", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Back to top <ArrowUpRightIcon width={13} height={13} />
          </a>
        </div>
        <div className="footer-credit" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 26px" }}>
          <a href="https://devolabanks.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "var(--on-ink-dim)", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Built by Bankole David · devolabanks.xyz
          </a>
        </div>
      </footer>
    </div>
  );
}
