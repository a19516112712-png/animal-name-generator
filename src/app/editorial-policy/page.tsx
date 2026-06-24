import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy — BestAnimalNames.com | How We Create Name Content",
  description: "Learn how BestAnimalNames.com curates animal names, researches blog content, and maintains accuracy. Our editorial team follows rigorous standards for every page.",
  openGraph: { title: "Editorial Policy — BestAnimalNames.com", description: "Our editorial standards: how we research, curate, and maintain every animal name and blog article." },
  twitter: { card: "summary", title: "Editorial Policy — BestAnimalNames.com", description: "How we research and curate every animal name." },
  alternates: { canonical: "https://bestanimalnames.com/editorial-policy/" },
};


  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
      { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://bestanimalnames.com/editorial-policy/" }
    ]
  };

export default function EditorialPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Editorial Policy</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">📋 Editorial Policy</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">How we research, curate, and maintain every animal name and article on BestAnimalNames.com.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400">Last updated: June 24, 2026</p>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p>BestAnimalNames.com exists to help people find the perfect name for their animal companion. We believe naming an animal should be joyful, not frustrating. Our goal is to provide well-researched, genuinely useful naming resources — free of charge, forever.</p>
          <p className="mt-3">We are not a generic name generator that spits out random combinations. We are an editorial resource. Every name, every article, and every recommendation on this site passes through human review before publication.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Curate Animal Names</h2>
          <p>Each animal page on BestAnimalNames.com contains name suggestions organized into categories: male, female, cute, funny, cool, unique, baby, and fantasy. Here is exactly how those names are selected:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Research Sources</strong> — We draw from pet owner communities, veterinary naming surveys, zoological databases, cultural naming traditions, mythology references, and real-world naming trends reported by animal shelters and breeders.</li>
            <li><strong>Human Review</strong> — Every candidate name is evaluated by our editorial team against clear quality criteria: ease of pronunciation, positive associations, distinctiveness, and suitability for the specific animal species.</li>
            <li><strong>Category Assignment</strong> — Names are sorted into categories based on their tone and typical usage context. A name like &ldquo;Thor&rdquo; belongs in Cool or Fantasy categories, while &ldquo;Marshmallow&rdquo; fits Cute or Funny.</li>
            <li><strong>Species Relevance</strong> — We never copy-paste the same list across different animals. Names for a horse should reflect equine characteristics, while names for a hamster should suit a small, gentle companion.</li>
            <li><strong>Regular Refreshing</strong> — Collections are updated regularly as new naming trends emerge, pop culture introduces new references, and readers submit suggestions.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Write Blog Articles</h2>
          <p>Our blog covers animal naming guides, pet care naming tips, breed-specific advice, cultural naming traditions, and creative naming inspiration. Every article follows this process:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Topic Selection</strong> — We choose topics that real pet owners and animal lovers are actually searching for, based on keyword research, reader requests, and gaps in existing online resources.</li>
            <li><strong>Research &amp; Fact-Checking</strong> — Writers consult veterinary publications, ethology research, breed standards from kennel clubs, zoological references, and cultural naming guides. Every factual claim is verified before publication.</li>
            <li><strong>Drafting</strong> — Articles are written by experienced writers with genuine knowledge of the subject. We do not publish AI-only content without human review.</li>
            <li><strong>Editorial Review</strong> — Each draft goes through an editorial check for accuracy, readability, completeness, and adherence to our quality standards.</li>
            <li><strong>Publishing &amp; Updates</strong> — Once published, articles are periodically reviewed and updated to reflect new research, naming trends, and reader feedback.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quality Standards</h2>
          <p>Every piece of content on BestAnimalNames.com must meet these baseline requirements:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Accuracy</strong> — Animal facts and naming information must be verifiable from reputable sources.</li>
            <li><strong>Completeness</strong> — Each animal page must include all eight name categories with at least 20 suggestions per category.</li>
            <li><strong>Originality</strong> — We do not scrape or duplicate content from other websites. Every page is original.</li>
            <li><strong>Accessibility</strong> — Content is organized with clear headings, readable fonts, high-contrast design, and proper ARIA labels for screen readers.</li>
            <li><strong>Transparency</strong> — We clearly distinguish editorial content from advertisements. No sponsored content is published without disclosure.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Corrections &amp; Feedback</h2>
          <p>We are committed to accuracy and continuous improvement. If you find an error, outdated information, or a name suggestion you believe is inappropriate, please let us know immediately:</p>
          <p className="mt-3">
            📧 <strong>Email:</strong> <Link href="mailto:support@bestanimalnames.com" className="text-primary hover:underline">support@bestanimalnames.com</Link>
          </p>
          <p className="mt-1">
            📝 <strong>Contact Form:</strong> <Link href="/contact/" className="text-primary hover:underline">Contact Us page</Link>
          </p>
          <p className="mt-3">We review all reports within 48 hours on weekdays and correct verified errors promptly. Corrections are noted with the date of revision.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Independence &amp; Funding</h2>
          <p>BestAnimalNames.com is an independent project, not owned by any corporation or venture capital firm. We fund our operations through non-intrusive advertising (Google AdSense). Advertisements are always clearly distinguishable from editorial content, and advertisers have zero influence over our naming recommendations or article content.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📖 Related Pages</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about/" className="text-blue-700 hover:underline">About BestAnimalNames.com</Link> — Our story and mission</li>
            <li><Link href="/how-we-create-content/" className="text-blue-700 hover:underline">How We Create Content</Link> — Behind-the-scenes process</li>
            <li><Link href="/contact/" className="text-blue-700 hover:underline">Contact Us</Link> — Submit feedback or report an error</li>
          </ul>
        </div>
      </section>
    </>
  );
}
