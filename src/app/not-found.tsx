import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Animal Name Generator",
  robots: "noindex, follow",
};

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
          ← Back to Home
        </Link>
        <Link href="/animals/" className="inline-block bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors">
          Browse All Animals →
        </Link>
      </div>
    </div>
  );
}
