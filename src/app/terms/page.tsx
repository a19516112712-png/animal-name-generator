import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Animal Name Generator",
  description: "Animal Name Generator Terms of Service. User responsibilities, intellectual property, limitations of liability, and prohibited uses.",
  openGraph: { title: "Terms of Service — Animal Name Generator", description: "Review the terms and conditions for using Animal Name Generator." },
  twitter: { card: "summary", title: "Terms of Service — Animal Name Generator", description: "Review the terms and conditions for using Animal Name Generator." },
  alternates: { canonical: "https://bestanimalnames.com/terms/" },
};

export default function TermsPage() {
  return (
    <>
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Terms of Service</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">📜 Terms of Service</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Please read these terms carefully before using Animal Name Generator.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 3, 2026</p>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using Animal Name Generator, you agree to be bound by these Terms of Service. If you do not agree, you should not use the site. We reserve the right to update these Terms at any time; continued use constitutes acceptance of changes.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Description of Service</h2>
          <p>Animal Name Generator is a free online tool providing curated name suggestions for 200+ animal species across 8 categories. The service is provided &ldquo;as is&rdquo; without warranties of any kind. We may modify, suspend, or discontinue any aspect of the site at any time.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. User Responsibilities</h2>
          <p>You agree to use the site only for lawful purposes, not to attempt unauthorized access, not to use automated scrapers or bots without permission, and to comply with all applicable laws. Contact form submissions must be accurate and free of malicious content.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Intellectual Property</h2>
          <p>All site content — text, graphics, design, and name compilation — is our property protected by intellectual property laws. You may not reproduce or exploit site content commercially without consent. Individual name suggestions are free for personal use without restriction.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Prohibited Uses</h2>
          <p>Prohibited: illegal activity, transmitting malware, disrupting site operation, harassing users, distributing spam, impersonating others, or any use that could create civil or criminal liability.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Animal Name Generator shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the site. In no event shall our total liability exceed the amount paid by you, if any, for accessing the site.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Third-Party Links &amp; Advertising</h2>
          <p>The site contains links to third-party websites and advertisements via Google AdSense. We do not control or endorse third-party content. Interactions with advertisers are solely between you and the advertiser. We may receive compensation for ad interactions.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Governing Law &amp; Contact</h2>
          <p>These Terms are governed by applicable laws. For questions, contact us at <strong>support@bestanimalnames.com</strong> or through our <Link href="/contact/" className="text-primary underline">Contact page</Link>.</p>
        </div>
      </section>
    </>
  );
}
