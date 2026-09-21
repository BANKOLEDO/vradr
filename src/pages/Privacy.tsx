import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar variant="docs" />
      <div className="shell" style={{ padding: "100px 24px 80px", maxWidth: 720 }}>
        <h1 className="heading-lg" style={{ marginBottom: 8 }}>Privacy Policy</h1>
          <p className="micro" style={{ marginBottom: 32 }}>Last updated: September 4, 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>1. Information We Collect</h2>
            <p className="body">We collect your email address, country of residence, and the applications, watchlists, and reminders you choose to track. SOP drafts you save stay only on your own device, never on our servers.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>2. How We Use Information</h2>
            <p className="body">Your information is used to provide personalized visa tracking, processing time predictions, and alerts, including emails to your registered address. Text you submit for AI scoring or drafting is processed to generate a result and is not stored. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>3. Data Sharing</h2>
            <p className="body">We may share aggregated, anonymized data (e.g., average processing times) publicly. Individual application data is never shared without your explicit consent.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>4. Data Security</h2>
            <p className="body">We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>5. Cookies</h2>
            <p className="body">Sign-in sessions are kept in your browser's local storage. We do not use advertising or analytics cookies.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>6. Your Rights</h2>
            <p className="body">You can access, update, or delete your account data at any time through the dashboard settings. Clearing your browser data removes device-only drafts.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>7. Changes to This Policy</h2>
            <p className="body">We may update this Privacy Policy from time to time. Significant changes will be communicated through the Service or by email.</p>
          </section>
        </div>

        <div style={{ marginTop: 48 }}>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
