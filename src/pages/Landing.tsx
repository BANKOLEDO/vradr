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

const compareRows = [
  { country: "United Kingdom", code: "gb", flag: "UK", visa: "Standard visitor", days: 15, delta: -3, up: false, guess: "14–18"},
  { country: "United States", code: "us", flag: "US", visa: "B1/B2 tourist", days: 44, delta: +6, up: true, guess: "41–49" },
  { country: "Canada", code: "ca", flag: "CA", visa: "Visitor", days: 21, delta: 0, up: null, guess: "20–24" },
];

const FAQ = [
  { q: "What does VRADR actually do?", a: "It scrapes official embassy pages and verified applicant reports across multiple countries, then turns them into one live timeline with trend lines, an AI projection, and alerts for your own applications." },
  { q: "How accurate is the prediction?", a: "The model weighs historical patterns, seasonal peaks, and the freshest embassy data. It shows you a window rather than a single day, and accuracy improves as more verified reports arrive." },
  { q: "Do I need an account?", a: "Yes, and it's free. A quick signup unlocks the dashboard for any country and visa type, plus personalization, application tracking, and alerts. Terms and Privacy are always available below." },
  { q: "Which countries are covered?", a: "12 destinations live now: US, UK, Canada, Germany, Australia, Japan, France, India, Brazil, South Korea, Schengen, and UAE. More coming soon." },
  { q: "How do alerts work?", a: "Add an application to the tracker and VRADR notifies you when the reported window changes or new embassy data lands, before the shift costs you a plan." },
];

const heroStats = [
  { value: "12", label: "Destinations live" },
  { value: "6", label: "Visa types" },
  { value: "Nightly", label: "Embassy re-scrape" },
  { value: "Real", label: "Processing data" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: 12 }}>
      <path d="M4 6l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <a href="#main" style={{ position: "absolute", left: -9999, top: 0 }}>Skip to content</a>

      <Navbar variant="landing" />

      {/* Hero — bold, no photo, pure CSS */}
      <header id="main" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", alignItems: "center", background: "var(--hero-bg)" }}>
        {/* accent blobs */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, var(--hero-accent-blob) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, var(--hero-olive-blob) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "0 auto", width: "100%", padding: "120px 24px 80px" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr", gap: 32, alignItems: "center" }}>

            {/* left — text */}
            <div>
              <div className="tag" style={{ marginBottom: 24, color: "var(--hero-soft)", background: "var(--hero-border)", border: "1px solid var(--hero-border)", display: "inline-flex" }}>
                Visa Rapid Application &amp; Document Review
              </div>

              <h1 className="hero-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--hero-text)", marginBottom: 20, textWrap: "balance" }}>
                Stop refreshing embassy sites.
                <br />
                <span style={{ color: "var(--hero-text-sub)" }}>We track it for you.</span>
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--hero-muted)", maxWidth: "48ch", marginBottom: 36, textWrap: "pretty" }}>
                Live processing times, trend lines, and an AI guess that lands inside its own window. Checked nightly across multiple destinations.
              </p>

              <div className="hero-cta" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Check your wait time <ArrowRightIcon width={16} height={16} />
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {heroStats.map((s) => (
                    <div key={s.label}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--hero-text)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                      <p style={{ fontSize: 12, color: "var(--hero-muted)", margin: "4px 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right — globe orbit, refined */}
            <div className="hero-doodles" style={{ position: "relative", height: 360 }}>

              {/* center globe wireframe */}
              <svg className="hero-globe-desktop" width="190" height="190" viewBox="0 0 180 180" fill="none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <circle cx="90" cy="90" r="70" stroke="var(--hero-doodle)" strokeWidth="2.5" />
                <ellipse cx="90" cy="90" rx="70" ry="26" stroke="var(--hero-doodle-soft)" strokeWidth="2" />
                <ellipse cx="90" cy="90" rx="26" ry="70" stroke="var(--hero-doodle-soft)" strokeWidth="2" />
                <ellipse cx="90" cy="90" rx="50" ry="70" stroke="var(--hero-doodle-dim)" strokeWidth="1.5" />
                <ellipse cx="90" cy="90" rx="70" ry="50" stroke="var(--hero-doodle-dim)" strokeWidth="1.5" />
                <circle cx="90" cy="90" r="4" fill="var(--hero-doodle-fill)" />
              </svg>

              {/* orbit ring, tilted ellipse */}
              <svg className="hero-globe-desktop" width="300" height="300" viewBox="0 0 280 280" fill="none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-12deg)" }}>
                <ellipse cx="140" cy="140" rx="132" ry="104" stroke="var(--hero-doodle-faint)" strokeWidth="1.5" strokeDasharray="4 6" />
              </svg>

              {/* airplane — riding the ring, top right */}
              <svg className="hero-globe-desktop" width="38" height="38" viewBox="0 0 36 36" fill="none" style={{ position: "absolute", top: 22, right: 34, transform: "rotate(18deg)" }}>
                <path d="M18 4 L 20 14 L 32 18 L 20 20 L 22 32 L 18 29 L 14 32 L 16 20 L 4 18 L 16 14 Z" stroke="var(--hero-doodle-strong)" strokeWidth="2" fill="none" strokeLinejoin="round" />
              </svg>

              {/* suitcase — lower right, inside the ring */}
              <svg className="hero-globe-desktop" width="30" height="34" viewBox="0 0 26 30" fill="none" style={{ position: "absolute", top: "52%", right: 26 }}>
                <rect x="2" y="7" width="22" height="20" rx="3" stroke="var(--hero-doodle)" strokeWidth="2" fill="none" />
                <rect x="7" y="2" width="12" height="6" rx="2" stroke="var(--hero-doodle)" strokeWidth="2" fill="none" />
                <path d="M13 7 L 13 27" stroke="var(--hero-doodle-dim)" strokeWidth="1.5" />
                <circle cx="13" cy="14" r="2" fill="var(--hero-doodle-fill)" />
              </svg>

              {/* map pin — far left, outside the ring */}
              <svg className="hero-globe-desktop" width="30" height="38" viewBox="0 0 28 36" fill="none" style={{ position: "absolute", top: "46%", left: 2, transform: "translateY(-50%)" }}>
                <path d="M14 34 C 14 34, 3 20, 3 12 C 3 6, 7.5 1, 14 1 C 20.5 1, 25 6, 25 12 C 25 20, 14 34, 14 34 Z" stroke="var(--hero-doodle)" strokeWidth="2.5" fill="none" />
                <circle cx="14" cy="12" r="4" stroke="var(--hero-doodle-soft)" strokeWidth="2" fill="none" />
              </svg>

              {/* passport stamp — bottom right, tilted */}
              <svg className="hero-globe-desktop" width="70" height="70" viewBox="0 0 64 64" fill="none" style={{ position: "absolute", bottom: 22, right: 44, transform: "rotate(10deg)" }}>
                <circle cx="32" cy="32" r="26" stroke="var(--hero-doodle-soft)" strokeWidth="2.5" strokeDasharray="4 3" />
                <circle cx="32" cy="32" r="20" stroke="var(--hero-doodle-dim)" strokeWidth="2" />
                <text x="32" y="30" textAnchor="middle" fill="var(--hero-doodle-soft)" fontSize="8" fontFamily="var(--font-display)" fontWeight="600" letterSpacing="0.1em">APPROVED</text>
                <text x="32" y="39" textAnchor="middle" fill="var(--hero-doodle-dim)" fontSize="6" fontFamily="var(--font-display)">2026</text>
              </svg>

              {/* clock — bottom left */}
              <svg className="hero-globe-desktop" width="36" height="36" viewBox="0 0 34 34" fill="none" style={{ position: "absolute", bottom: 44, left: 40 }}>
                <circle cx="17" cy="17" r="13" stroke="var(--hero-doodle)" strokeWidth="2.5" />
                <path d="M17 8 L 17 17 L 23 20" stroke="var(--hero-doodle)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* document — bottom center */}
              <svg className="hero-globe-desktop" width="24" height="30" viewBox="0 0 22 28" fill="none" style={{ position: "absolute", bottom: 6, left: "52%", transform: "translateX(-50%)" }}>
                <rect x="2" y="2" width="18" height="24" rx="2" stroke="var(--hero-doodle-soft)" strokeWidth="2" fill="none" />
                <path d="M6 9 L 16 9 M 6 13 L 16 13 M 6 17 L 12 17" stroke="var(--hero-doodle-dim)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              {/* checkmark — top left */}
              <svg className="hero-globe-desktop" width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: 56, left: 22 }}>
                <circle cx="12" cy="12" r="9" stroke="var(--hero-doodle-soft)" strokeWidth="2" />
                <path d="M7 12 L 10.5 15.5 L 17 9" stroke="var(--hero-doodle)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>

              {/* ── mobile: mini orbit ── */}
              <div className="hero-doodles-mobile" style={{ display: "none", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <div style={{ position: "relative", width: 220, height: 190 }}>
                  <svg width="220" height="190" viewBox="0 0 220 190" fill="none" style={{ position: "absolute", inset: 0 }}>
                    <ellipse cx="110" cy="95" rx="100" ry="72" stroke="var(--hero-doodle-faint)" strokeWidth="1.5" strokeDasharray="4 6" transform="rotate(-10 110 95)" />
                  </svg>
                  <svg width="76" height="76" viewBox="0 0 180 180" fill="none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <circle cx="90" cy="90" r="70" stroke="var(--hero-doodle)" strokeWidth="4" />
                    <ellipse cx="90" cy="90" rx="70" ry="26" stroke="var(--hero-doodle-soft)" strokeWidth="3" />
                    <ellipse cx="90" cy="90" rx="26" ry="70" stroke="var(--hero-doodle-soft)" strokeWidth="3" />
                    <circle cx="90" cy="90" r="5" fill="var(--hero-doodle-fill)" />
                  </svg>
                  <svg width="30" height="30" viewBox="0 0 36 36" fill="none" style={{ position: "absolute", top: 6, right: 30, transform: "rotate(18deg)" }}>
                    <path d="M18 4 L 20 14 L 32 18 L 20 20 L 22 32 L 18 29 L 14 32 L 16 20 L 4 18 L 16 14 Z" stroke="var(--hero-doodle-strong)" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                  </svg>
                  <svg width="24" height="30" viewBox="0 0 28 36" fill="none" style={{ position: "absolute", bottom: 8, left: 18 }}>
                    <path d="M14 34 C 14 34, 3 20, 3 12 C 3 6, 7.5 1, 14 1 C 20.5 1, 25 6, 25 12 C 25 20, 14 34, 14 34 Z" stroke="var(--hero-doodle)" strokeWidth="2.5" fill="none" />
                    <circle cx="14" cy="12" r="4" stroke="var(--hero-doodle-soft)" strokeWidth="2" fill="none" />
                  </svg>
                  <svg width="26" height="26" viewBox="0 0 34 34" fill="none" style={{ position: "absolute", bottom: 0, right: 44 }}>
                    <circle cx="17" cy="17" r="13" stroke="var(--hero-doodle)" strokeWidth="2.5" />
                    <path d="M17 8 L 17 17 L 23 20" stroke="var(--hero-doodle)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Why it works */}
      <section className="dot-grid" style={{ padding: "80px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Why it works</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 48, lineHeight: 1.1, textWrap: "balance" }}>
            The gap between a visa site and a decision
          </h2>

          <div className="why-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { num: "01", title: "One number, not a maze", desc: "Embassy sites hide processing times in PDFs and inbox queues. VRADR scrapes them nightly and reduces each one to a single number you can act on." },
              { num: "02", title: "The trend, not the snapshot", desc: "A wait time on its own is noise. VRADR keeps weeks of history so you see whether a date is improving, slipping, or about to move." },
              { num: "03", title: "Alerts before it matters", desc: "Attach your application and get the push the moment a window or deadline shifts. No more checking the same page every morning." },
              { num: "04", title: "An SOP that sounds like you", desc: "Answer a few questions about your background, voice, and wins. VRADR drafts a personal statement in your words, then scores your edits like an officer would." },
              { num: "05", title: "Rehearse the interview", desc: "Face real officer-style questions for your country and visa, get scored with model answers, and track your average across sessions." },
              { num: "06", title: "Every route, one roadmap", desc: "Scholarships with deadlines, work routes from NZ to the US with scam warnings, and step-by-step roadmaps. Structured process, not scattered tabs." },
            ].map((item) => (
              <div key={item.num}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.04em" }}>{item.num}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", margin: "12px 0 10px", lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: 0, textWrap: "pretty" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare — real data, not a features grid */}
      <section id="compare" className="dot-grid web-glow" style={{ padding: "64px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div className="cta-cols" style={{ display: "grid", gap: 56, alignItems: "center", gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <span className="micro" style={{ color: "var(--accent)" }}>Fastest route, at a glance</span>
              <h2 className="heading-lg" style={{ margin: "8px 0 14px", textWrap: "balance" }}>Three countries, three real windows. This is the whole point.</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0, textWrap: "pretty" }}>
                Pick anywhere and compare live. Each row is a scraped, dated, verified figure with a trend and an AI window. One glance replaces an afternoon of tabs.
              </p>
            </div>
            <FadeIn>
              <div className="card" style={{ padding: 8 }} aria-hidden>
                <div className="cmp-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 12, padding: "12px 14px", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500 }}>
                  <span>Destination</span><span>Days</span><span>Trend</span><span className="cmp-guess">AI guess</span>
                </div>
                {compareRows.map((r) => (
                  <div key={r.country} className="cmp-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 12, alignItems: "center", padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Flag code={r.code} style={{ width: 28, height: 20, borderRadius: 3, objectFit: "cover", border: "1px solid var(--border)" }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{r.country}</span>
                    </div>
                    <span style={{ fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{r.days}d</span>
                    <span style={{ fontSize: 13, color: r.up ? "#c2410c" : r.up === false ? "#16a34a" : "var(--text-muted)" }}>
                      {r.up ? "▲ up" : r.up === false ? "▼ down" : "· flat"}
                    </span>
                    <span className="cmp-guess" style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.guess}d</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Built with */}
      <section className="dot-grid" style={{ padding: "64px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Under the hood</p>
          <h2 className="heading-lg" style={{ margin: "0 0 32px", textWrap: "balance" }}>Four engines doing real work</h2>
          <div className="why-cols" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { name: "Convex", logo: "https://cdn.simpleicons.org/convex", desc: "Your data updates live on every device, instantly. No refresh button, no waiting." },
              { name: "OpenAI", logo: "https://cdn.worldvectorlogo.com/logos/openai-2.svg", desc: "Wait predictions, SOP drafts in your voice, and interview practice with scores." },
              { name: "Firecrawl", logo: "https://www.firecrawl.dev/favicon.ico", desc: "Embassy pages checked nightly, so every number is fresh, never stale." },
              { name: "AgentMail", logo: "https://agentmail.to/favicon.ico", desc: "Welcome notes, deadline reminders, and wait alerts land in your email." },
            ].map((s) => (
              <div key={s.name} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <img src={s.logo} alt={`${s.name} logo`} loading="lazy" className={s.name === "OpenAI" ? "brandlogo brandlogo-invert" : "brandlogo"} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)", margin: 0 }}>{s.name}</p>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="dot-grid web-glow" style={{ padding: "8px 24px 64px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <span className="micro" style={{ color: "var(--accent)" }}>Questions</span>
            <h2 className="heading-lg" style={{ margin: "6px 0 0", textWrap: "balance" }}>Before you jump in</h2>
          </div>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {FAQ.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={f.q} delay={i * 40}>
                  <div style={{ borderBottom: "1px solid var(--border)" }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "16px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--text)",
                        textAlign: "left",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <span>{f.q}</span>
                      <ChevronIcon open={isOpen} />
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? "200px" : "0",
                        overflow: "hidden",
                        transition: "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", textWrap: "pretty" }}>{f.a}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="closer" style={{ position: "relative", minHeight: 0, padding: "64px 24px 96px" }}>
        <div className="closer-bg" />
        <img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80" alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(12,10,8,0.72)", zIndex: 1, pointerEvents: "none" }} />
        <div className="cta-cols" style={{ position: "relative", zIndex: 2, maxWidth: 1020, margin: "0 auto", width: "100%", display: "grid", gap: 48, alignItems: "center", gridTemplateColumns: "0.9fr 1.1fr" }}>
          <div aria-hidden>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.45)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <BrandMark size={22} />
                <span className="micro" style={{ color: "var(--text-muted)" }}>live · updated tonight</span>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <Flag code="us" style={{ width: 40, height: 28, borderRadius: 4, objectFit: "cover", border: "1px solid var(--hero-border)" }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--text)" }}>United States</p>
                    <p className="micro" style={{ color: "var(--text-muted)", margin: "2px 0 0" }}>B1/B2 tourist</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 600, color: "var(--text)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>44</span>
                  <span style={{ fontSize: 16, color: "var(--text-muted)" }}>days</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span style={{ color: "#c2410c" }}>▲ up 6d</span>
                  <span style={{ color: "var(--text-muted)" }}>AI guess: 41–49d</span>
                </div>
              </div>
            </div>
          </div>
          <FadeIn>
            <div style={{ textAlign: "left" }}>
              <span className="micro" style={{ color: "rgba(237,236,231,0.5)" }}>Free to sign up</span>
              <h2 className="heading-lg" style={{ margin: "10px 0 12px", color: "#edece7", textWrap: "balance" }}>See your window in ten seconds</h2>
              <p style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(237,236,231,0.55)", marginBottom: 24, textWrap: "pretty" }}>
                Create a free account, then check any country and visa type. Personalize it, track applications, and get alerts as windows shift.
              </p>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Get started <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--color-press-black, #121613)" }}>
        <div className="footer-inner" style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "28px 24px" }}>
          <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrandMark size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#edece7" }}>VRADR</span>
          </div>
          <div className="footer-links" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link to="/terms" style={{ color: "rgba(237,236,231,0.6)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Terms</Link>
            <Link to="/privacy" style={{ color: "rgba(237,236,231,0.6)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Privacy</Link>
            <span style={{ color: "rgba(237,236,231,0.45)", fontSize: 12, letterSpacing: "0.06em" }}>CONVEX ALL GAS 2026</span>
          </div>
          <a className="footer-top" href="#main" style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", color: "rgba(237,236,231,0.45)", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Back to top <ArrowUpRightIcon width={13} height={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}
