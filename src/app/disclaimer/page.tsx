import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — Animal Name Generator",
  description: "Animal Name Generator legal disclaimer. Informational purposes only, no professional advice, advertising disclosures, and affiliate transparency.",
  openGraph: { title: "Disclaimer — Animal Name Generator", description: "Legal disclaimer covering informational purpose, advertising, and external links." },
  twitter: { card: "summary", title: "Disclaimer — Animal Name Generator", description: "Legal disclaimer covering informational purpose, advertising, and external links." },
  alternates: { canonical: "https://bestanimalnames.com/disclaimer/" },
};


  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
      { "@type": "ListItem", "position": 2, "name": "Disclaimer", "item": "https://bestanimalnames.com/disclaimer/" }
    ]
  };

export default function DisclaimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Disclaimer</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">⚠️ Disclaimer</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Important legal notices and disclosures about your use of Animal Name Generator.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 3, 2026</p>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Informational Purposes Only</h2>
          <p>All content on Animal Name Generator — name suggestions, guides, tips — is provided for general informational and entertainment purposes only. We make no warranties about completeness, accuracy, or suitability. Any reliance is at your own risk.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. No Professional Advice</h2>
          <p>Nothing on this site constitutes veterinary, legal, medical, or financial advice. Always consult a qualified professional for guidance specific to your situation. Do not disregard professional advice because of something you read on this site.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. External Links Disclaimer</h2>
          <p>Links to external websites are provided for convenience only. We do not control, endorse, or assume responsibility for third-party content, accuracy, or availability. Access external links at your own risk.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Advertising Disclaimer</h2>
          <p>We display advertisements via Google AdSense. These ads are served by third parties using cookies. We do not endorse advertised products or services and are not responsible for ad accuracy or transactions with advertisers. We may receive compensation for ad interactions.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Affiliate Disclaimer</h2>
          <p>Some links may be affiliate links. We may earn a commission at no additional cost to you. Affiliate relationships do not influence our content. We are committed to transparency and will endeavor to identify affiliate links.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Limitation of Liability</h2>
          <p>Animal Name Generator shall not be liable for any loss or damage arising from your use of or reliance on site content. By using the site, you consent to this Disclaimer. For questions, contact <strong>support@bestanimalnames.com</strong>.</p>
        </div>
      </section>
    </>
  );
}
