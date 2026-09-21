import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar variant="docs" />
      <div className="shell" style={{ padding: "100px 24px 80px", maxWidth: 720 }}>
        <h1 className="heading-lg" style={{ marginBottom: 8 }}>Terms of Service</h1>
          <p className="micro" style={{ marginBottom: 32 }}>Last updated: September 4, 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>1. Acceptance of Terms</h2>
            <p className="body">By accessing or using VRADR (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>2. Description of Service</h2>
            <p className="body">VRADR provides visa processing time data, trend analysis, application tracking, document drafting help, interview practice, and email alerts. Data is gathered from embassy websites through automated scraping. Processing times are estimates and not guarantees.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>3. User Accounts</h2>
            <p className="body">You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to keep it updated.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>4. Acceptable Use</h2>
            <p className="body">You agree not to misuse the Service, attempt to access it using unauthorized methods, or use the data for purposes that violate applicable laws or regulations.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>5. Data Accuracy</h2>
            <p className="body">While we strive for accuracy, processing times and visa requirements may change without notice. AI-generated content (predictions, drafts, scores) can be wrong. Always verify information with the relevant embassy or consulate before making decisions.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>6. Limitation of Liability</h2>
            <p className="body">VRADR is not liable for any decisions made based on the information provided. The Service is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>7. Changes to Terms</h2>
            <p className="body">We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="heading" style={{ marginBottom: 8 }}>8. Contact</h2>
            <p className="body">For questions about these Terms, reply to any email we send you from your registered address.</p>
          </section>
        </div>

        <div style={{ marginTop: 48 }}>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
