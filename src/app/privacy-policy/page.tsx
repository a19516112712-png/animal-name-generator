import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Animal Name Generator",
  description: "Animal Name Generator Privacy Policy. Covers Google Analytics, cookies, AdSense, GDPR, CCPA, data collection, and how we protect your information.",
  openGraph: { title: "Privacy Policy — Animal Name Generator", description: "Comprehensive privacy policy covering GDPR, CCPA, cookies, Google AdSense, and data protection." },
  twitter: { card: "summary", title: "Privacy Policy — Animal Name Generator", description: "Comprehensive privacy policy covering GDPR, CCPA, cookies, and data protection." },
  alternates: { canonical: "https://bestanimalnames.com/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">🔒 Privacy Policy</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Your privacy matters. Learn how we collect, use, and protect your information.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 3, 2026</p>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Introduction</h2>
          <p>Animal Name Generator (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. We minimize data collection wherever possible — we do not require user accounts and only collect personal information through our voluntary contact form.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
          <p><strong>Voluntary:</strong> When you use our contact form, you may provide your name, email, and message — used solely to respond to your inquiry.</p>
          <p className="mt-2"><strong>Automatic:</strong> We collect log data (IP address, browser type, pages visited), device information, and usage data through standard server logs and analytics.</p>
          <p className="mt-2"><strong>We do NOT collect:</strong> Financial information, government IDs, health data, precise geolocation, or data from children under 13.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Google Analytics</h2>
          <p>We use Google Analytics to understand site usage. Google Analytics uses cookies to collect data about your visit — pages viewed, time on site, referring URLs — and transmits this to Google servers in the United States. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Analytics Opt-out Browser Add-on</a>.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Cookies</h2>
          <p>We use essential cookies for site functionality, analytics cookies (Google Analytics), and advertising cookies (Google AdSense). For full details, see our <Link href="/cookie-policy/" className="text-primary underline">Cookie Policy</Link>.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Google AdSense &amp; Advertising</h2>
          <p>We use Google AdSense to display ads. Google uses cookies to serve ads based on your browsing history. You can opt out of personalized advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary underline">aboutads.info</a>.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. GDPR Compliance (EU/EEA)</h2>
          <p>EU/EEA residents have rights under GDPR: right of access, rectification, erasure, restriction, objection, and data portability. Contact us at <strong>support@bestanimalnames.com</strong> to exercise these rights. We respond within 30 days.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">7. CCPA Compliance (California)</h2>
          <p>California residents have rights under CCPA/CPRA: right to know what personal information we collect, right to delete it, and right to opt-out of sale. We do not sell personal information as defined under CCPA. Contact us at <strong>support@bestanimalnames.com</strong> with &ldquo;CCPA Request&rdquo; in the subject line.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Data Security &amp; Retention</h2>
          <p>We implement HTTPS encryption and appropriate security measures. Contact form submissions are retained up to 12 months. Analytics data retention follows Google&rsquo;s policies. No method of transmission over the Internet is 100% secure.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Contact</h2>
          <p>Questions about this Privacy Policy? Email us at <strong>support@bestanimalnames.com</strong> or use our <Link href="/contact/" className="text-primary underline">Contact page</Link>.</p>
        </div>
      </section>
    </>
  );
}
