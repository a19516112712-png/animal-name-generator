import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Animal Name Generator",
  description: "Find answers to common questions about our animal name generator. Learn how to use our tools, find the best names, and get naming tips. 100% free!",
  openGraph: { title: "FAQ — Animal Name Generator", description: "Frequently asked questions about our free animal name generator. Find answers fast." },
  twitter: { card: "summary", title: "FAQ — Animal Name Generator", description: "Frequently asked questions about our free animal name generator." },
  alternates: { canonical: "https://bestanimalnames.com/faq/" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is Animal Name Generator?", "acceptedAnswer": { "@type": "Answer", "text": "Animal Name Generator is a free online tool that helps you find the perfect name for any animal. We offer 989+ animal species with male, female, cute, funny, fantasy, unique, cool, and baby name categories. Each animal has 160+ hand-picked names." } },
    { "@type": "Question", "name": "Is Animal Name Generator really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Animal Name Generator is 100% free. No sign-up required, no hidden fees. We support the site through advertising (Google AdSense). All name generators, guides, and tools are completely free to use." } },
    { "@type": "Question", "name": "How many animal name generators do you have?", "acceptedAnswer": { "@type": "Answer", "text": "We have 989+ animal name generators covering dogs, cats, birds, fish, reptiles, farm animals, wild animals, mythical creatures, exotic pets, and insects. Each animal has 160+ names across 8 categories." } },
    { "@type": "Question", "name": "How do I find names for my specific pet?", "acceptedAnswer": { "@type": "Answer", "text": "Browse to the Animals page, select your animal species, and explore name categories like male, female, cute, or unique names. You can also browse names by starting letter or by name length." } },
    { "@type": "Question", "name": "Can I use these names for my real pet?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! All names are suitable for real pets. Many pet owners use our generator to find names for their dogs, cats, birds, hamsters, and other companion animals." } },
    { "@type": "Question", "name": "Do you have naming guides?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! We have 200+ comprehensive naming guides covering topics like 'How to Name Your Dog', 'Japanese Animal Names', 'Mythological Names', and many more. Visit our Guides section to explore." } },
    { "@type": "Question", "name": "Can I suggest new animals or names?", "acceptedAnswer": { "@type": "Answer", "text": "We welcome suggestions! Visit our Contact page to share your ideas for new animals or name categories you would like to see added to our generator." } },
    { "@type": "Question", "name": "How often do you add new animals?", "acceptedAnswer": { "@type": "Answer", "text": "We regularly add new animal species, name ideas, and blog content. Our database is continuously expanding to cover more animals and provide more name options for our users." } },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bestanimalnames.com/" },
    { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://bestanimalnames.com/faq/" },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <span className="text-gray-800 font-medium">FAQ</span>
      </nav>

      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">❓ Frequently Asked Questions</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Find answers to common questions about Animal Name Generator. Learn how to use our free tools and get the most out of your naming journey.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {faqSchema.mainEntity.map((item, idx) => (
            <details key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
              <summary className="text-lg font-bold cursor-pointer group-open:text-primary">
                {item.name}
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {item.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Still have questions?</p>
          <p className="text-gray-600 mb-4">We are here to help. Reach out to us and we will get back to you.</p>
          <Link href="/contact/" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            Contact Us →
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
        </div>
      </section>
    </>
  );
}
