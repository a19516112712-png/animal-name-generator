import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — Animal Name Generator",
  description: "Animal Name Generator Cookie Policy. Learn about first-party and third-party cookies, analytics, advertising cookies, and how to manage preferences.",
  openGraph: { title: "Cookie Policy — Animal Name Generator", description: "Cookie policy explaining all cookie types and how to manage them." },
  twitter: { card: "summary", title: "Cookie Policy — Animal Name Generator", description: "Cookie policy explaining all cookie types and how to manage them." },
  alternates: { canonical: "https://bestanimalnames.com/cookie-policy/" },
};


  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
      { "@type": "ListItem", "position": 2, "name": "Cookie Policy", "item": "https://bestanimalnames.com/cookie-policy/" }
    ]
  };

export default function CookiePolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Cookie Policy</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">🍪 Cookie Policy</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Understanding how and why we use cookies on Animal Name Generator.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 3, 2026</p>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They help websites function efficiently and provide information to site owners. Cookies can be session-based (deleted when you close your browser) or persistent (remaining until they expire or are deleted).</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. First-Party Cookies</h2>
          <p>We use a single first-party cookie: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">cookie_consent</code> — stores your cookie consent preferences (duration: 12 months). This is essential and does not require consent under applicable laws.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Google Analytics Cookies</h2>
          <p>Google Analytics sets these cookies: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_ga</code> (2 years, distinguishes visitors), <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_ga_*</code> (2 years, session state), <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_gid</code> (24 hours, daily distinction), <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">_gat</code> (1 minute, request throttling).</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Google AdSense Cookies</h2>
          <p>Google AdSense sets these advertising cookies: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">__gads</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">__gpi</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">DSID</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">IDE</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">test_cookie</code>. These enable interest-based advertising. Durations range from 15 minutes to 13 months.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Managing Cookies</h2>
          <p><strong>Browser settings:</strong> Configure cookie preferences in Chrome (Settings → Privacy → Cookies), Firefox (Options → Privacy &amp; Security), Safari (Preferences → Privacy), Edge (Settings → Privacy), or Opera (Settings → Privacy).</p>
          <p className="mt-2"><strong>Opt out of analytics:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Analytics Opt-out Add-on</a>.</p>
          <p className="mt-2"><strong>Opt out of ads:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary underline">aboutads.info</a>.</p>
          <p className="mt-2"><strong>Do Not Track:</strong> Our site respects DNT browser signals where technically feasible.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. More Information</h2>
          <p>See our <Link href="/privacy-policy/" className="text-primary underline">Privacy Policy</Link> for comprehensive data handling information. Contact <strong>support@bestanimalnames.com</strong> with questions.</p>
        </div>
      </section>
    </>
  );
}
