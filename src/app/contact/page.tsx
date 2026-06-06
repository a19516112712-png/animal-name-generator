import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — Animal Name Generator | Get in Touch",
  description: "Contact the Animal Name Generator team. Send questions, animal suggestions, feedback, or partnership inquiries. We respond within 48 hours.",
  openGraph: { title: "Contact Us — Animal Name Generator", description: "Get in touch with the Animal Name Generator team. We welcome your questions and feedback." },
  twitter: { card: "summary", title: "Contact Us — Animal Name Generator", description: "Get in touch with the Animal Name Generator team." },
  alternates: { canonical: "https://bestanimalnames.com/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Contact Us</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">📧 Contact Us</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">We would love to hear from you. Questions, suggestions, or just a friendly hello!</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <form className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-xl mx-auto space-y-5">
          <div>
            <label className="block font-semibold text-sm mb-1">Your Name <span className="text-red-500">*</span></label>
            <input type="text" required placeholder="Enter your full name" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1">Your Email <span className="text-red-500">*</span></label>
            <input type="email" required placeholder="Enter your email address" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1">Subject</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select a topic (optional)</option>
              <option value="suggestion">Animal or Name Suggestion</option>
              <option value="bug">Report a Technical Issue</option>
              <option value="feedback">General Feedback</option>
              <option value="partnership">Partnership Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1">Your Message <span className="text-red-500">*</span></label>
            <textarea required rows={5} placeholder="Tell us what is on your mind..." className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-primary-dark transition-colors">Send Message ✉️</button>
        </form>
        <div className="max-w-xl mx-auto space-y-4 text-gray-600">
          <h2 className="text-2xl font-bold text-center text-gray-800">📬 Support Information</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="font-semibold">Email us directly:</p>
            <p className="text-primary font-medium">support@bestanimalnames.com</p>
            <p className="text-sm mt-2">We aim to respond to all inquiries within <strong>48 hours</strong> during weekdays.</p>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-6">Why Contact Us?</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Suggest a New Animal</strong> — Missing an animal? Let us know and we will add it.</li>
            <li><strong>Share a Name Idea</strong> — Submit a brilliant name for our collections.</li>
            <li><strong>Report an Issue</strong> — Broken links, formatting problems, anything.</li>
            <li><strong>Partnership Inquiries</strong> — Collaborations, sponsorships, and more.</li>
            <li><strong>General Feedback</strong> — Ideas for new features or improvements.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
