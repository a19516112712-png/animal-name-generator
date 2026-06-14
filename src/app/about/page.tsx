import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Animal Name Generator | Our Story & Mission",
  description: "Learn about Animal Name Generator — how we create thousands of animal names, our mission to help pet owners, and our commitment to free, quality naming tools.",
  openGraph: { title: "About Us — Animal Name Generator", description: "Discover the story behind Animal Name Generator. Free animal names for 200+ species." },
  twitter: { card: "summary", title: "About Us — Animal Name Generator", description: "Discover the story behind Animal Name Generator." },
  alternates: { canonical: "https://bestanimalnames.com/about/" },
};


  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://bestanimalnames.com/about/" }
    ]
  };


  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Animal Name Generator",
    "url": "https://bestanimalnames.com",
    "description": "Free animal name generator with 989+ animals. Browse thousands of name ideas.",
    "sameAs": [
      "https://www.pinterest.com/bestanimalnames/"
    ]
  };

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">About Us</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">📖 About Animal Name Generator</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Our mission is simple: help every animal lover find the perfect name — for free, forever.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p>Animal Name Generator was born from a simple observation: naming an animal should be joyful, not stressful. Whether you are welcoming a new puppy, creating a character for your novel, or searching for the ideal name for a classroom pet, the process should be inspiring and effortless. Too often, people find themselves scrolling through endless forum threads or generic lists that lack creativity. We decided to change that.</p>
          <p className="mt-3">Founded by a team of animal enthusiasts, writers, and developers, Animal Name Generator began as a modest collection of dog and cat names. Over time, fueled by user requests and our passion for wildlife, the collection expanded to include over 200 animal species — and we continue to grow every month. We are an independent project, not backed by any corporation or venture capital, which allows us to keep the site completely free and focused on user experience.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How Names Are Generated</h2>
          <p>Every name is hand-selected by our editorial team through a process combining research, creativity, and community feedback. We study naming conventions across cultures, explore mythology and folklore, review pop culture references, and analyze real-world pet naming trends. Our editors review each candidate name against quality criteria — ease of pronunciation, positive associations, distinctiveness, and appropriateness for the animal. We also incorporate user submissions, refreshing our collections regularly.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Name Categories</h2>
          <p>We organize names into eight categories: Male Names (strong, classic), Female Names (graceful, beautiful), Cute Names (adorable, sweet), Funny Names (witty, playful), Fantasy Names (magical, mythical), Unique Names (rare, distinctive), Cool Names (stylish, trendy), and Baby Names (tiny, precious). Each category provides 20 suggestions per animal — 160 total name ideas for every species.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trust &amp; Transparency</h2>
          <p>We believe in being completely open about how Animal Name Generator operates. The site is and will remain free — no hidden costs, no accounts required. We may display advertisements to support operational costs; these are clearly distinguished from content. All names are human-curated and reviewed. We do not use AI to generate names without human review. We are committed to accessibility, inclusivity, and maintaining a safe platform for everyone.</p>
        </div>
      </section>
    </>
  );
}
