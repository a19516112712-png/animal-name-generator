import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Create Content — BestAnimalNames.com | Behind the Scenes",
  description: "A behind-the-scenes look at how BestAnimalNames.com researches animal names, writes blog articles, and maintains accuracy across 1,600+ animal pages.",
  openGraph: { title: "How We Create Content — BestAnimalNames.com", description: "Behind the scenes: how we research, write, and maintain animal naming content." },
  twitter: { card: "summary", title: "How We Create Content — BestAnimalNames.com", description: "Behind the scenes of our content creation process." },
  alternates: { canonical: "https://bestanimalnames.com/how-we-create-content/" },
};


  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
      { "@type": "ListItem", "position": 2, "name": "How We Create Content", "item": "https://bestanimalnames.com/how-we-create-content/" }
    ]
  };

export default function HowWeCreateContentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">How We Create Content</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">🛠️ How We Create Content</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">A transparent look at our research, writing, and quality assurance process — from idea to publication.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 24, 2026</p>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
          <p>BestAnimalNames.com contains over 1,600 animal name pages, hundreds of blog articles, thousands of naming ideas, and educational guides. Creating and maintaining this volume of content while ensuring quality requires a disciplined process. Here is exactly how we do it.</p>
          <p className="mt-3">Every piece of content on this site goes through three distinct phases: <strong>Research</strong>, <strong>Creation</strong>, and <strong>Review</strong>. Nothing is published without passing all three gates.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Phase 1: Research</h2>
          <p>Before a single word is written, our team conducts thorough research:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Animal Research</strong> — For each animal species we cover, we compile factual information from authoritative sources including zoological databases, wildlife conservation organizations, veterinary references, and academic ethology publications. We verify habitat, diet, behavior, lifespan, and conservation status before writing any naming content.</li>
            <li><strong>Naming Research</strong> — We study real-world naming data from pet registration databases, veterinary clinic surveys, animal shelter records, and breeder recommendations. We also explore cultural naming traditions, mythology, literature, film, and folklore for creative inspiration.</li>
            <li><strong>User Research</strong> — We monitor what visitors are searching for, which pages receive the most engagement, and what questions readers ask through our contact form. This feedback directly informs our content priorities.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Phase 2: Creation</h2>
          <p>Content creation follows different workflows depending on the page type:</p>

          <div className="mt-4 space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🐾 Animal Name Pages</h3>
              <p>Each animal page features eight name categories. Names are curated — not randomly generated — by evaluating each candidate against our quality criteria: ease of pronunciation, positive connotation, species relevance, and distinctiveness. We source names from our research database, community submissions, and creative ideation sessions. Each category contains at least 20 hand-picked suggestions.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Blog Articles</h3>
              <p>Blog articles are written by experienced writers with genuine knowledge of animal care and naming. Each article follows a structured outline: introduction, multiple topic sections with practical advice, FAQ section, and conclusion. Articles target 1,500–2,500 words and include real-world examples, actionable tips, and internal links to relevant animal pages. Every factual claim is cited where applicable.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📚 Educational Guides</h3>
              <p>Our naming guides provide deeper instruction on specific topics: how to name a dog, Japanese naming traditions, mythological name sources, and more. Guides are longer-form (2,000+ words) and are designed to be genuinely educational resources, not thin SEO pages.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Phase 3: Review</h2>
          <p>Before any content is published, it passes through a multi-point quality check:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Editorial Review</strong> — A second team member reviews the content for accuracy, readability, and adherence to our quality standards. Every fact is cross-checked against source references.</li>
            <li><strong>Technical Validation</strong> — Our build pipeline automatically checks for broken internal links, duplicate slugs, missing metadata, schema validation errors, and sitemap completeness. Nothing is deployed with known technical issues.</li>
            <li><strong>SEO Verification</strong> — We verify that each page has a unique, descriptive title and meta description, proper canonical tags, and correct structured data markup (BreadcrumbList, Article, FAQPage, etc.).</li>
            <li><strong>Accessibility Check</strong> — Content is reviewed for heading hierarchy, alt text completeness, contrast ratios, and semantic HTML structure.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ongoing Maintenance</h2>
          <p>Publication is not the end of the process. We continuously maintain our content:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Regular Updates</strong> — Name collections are refreshed as new trends emerge. Blog articles are updated when new research or naming data becomes available.</li>
            <li><strong>Reader Feedback Loop</strong> — Every suggestion or correction submitted through our contact form is reviewed within 48 hours on weekdays. Valid corrections are applied promptly.</li>
            <li><strong>Broken Link Monitoring</strong> — Our build system automatically detects broken internal links during each deployment and prevents them from reaching production.</li>
            <li><strong>Content Expansion</strong> — We add new animal pages and blog articles based on reader demand, search trends, and gaps in our existing coverage.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
          <p>BestAnimalNames.com is maintained by the <strong>BestAnimalNames Editorial Team</strong> — a small group of animal enthusiasts, writers, and researchers who are passionate about helping people connect with their animal companions through thoughtful naming. We have backgrounds in animal care, creative writing, content research, and web development.</p>
          <p className="mt-3">We are not a faceless AI content farm. Every name you see was evaluated by a human being. Every article was drafted by a writer and reviewed by an editor. We take pride in the quality of our work and are always open to feedback.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Technology We Use</h2>
          <p>For transparency, here is a summary of how our site is built and maintained:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Framework:</strong> Next.js (React) — provides fast, SEO-friendly static and server-rendered pages</li>
            <li><strong>Hosting:</strong> Vercel — global CDN for fast load times worldwide</li>
            <li><strong>Content Storage:</strong> JSON-based data files, processed at build time for static generation</li>
            <li><strong>Automation:</strong> GitHub Actions handle daily content updates, sitemap regeneration, and quality validation</li>
            <li><strong>Analytics:</strong> Google Analytics 4 and Google Search Console — for understanding reader needs and improving content</li>
            <li><strong>Monetization:</strong> Google AdSense — non-intrusive ads that fund our operations without paywalls or subscriptions</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📖 Related Pages</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about/" className="text-blue-700 hover:underline">About Us</Link> — Our story and mission</li>
            <li><Link href="/editorial-policy/" className="text-blue-700 hover:underline">Editorial Policy</Link> — Our quality standards and research methodology</li>
            <li><Link href="/contact/" className="text-blue-700 hover:underline">Contact Us</Link> — Submit feedback, corrections, or suggestions</li>
            <li><Link href="/faq/" className="text-blue-700 hover:underline">FAQ</Link> — Frequently asked questions</li>
          </ul>
        </div>
      </section>
    </>
  );
}
