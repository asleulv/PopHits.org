import Link from "next/link";
import {
  Scale,
  Shield,
  Cookie,
  FileText,
  ArrowRight,
  Mail,
  Calendar,
  Eye,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Legal Information | PopHits.org",
  description:
    "Legal information for PopHits.org - Access our Terms of Use, Privacy Policy, and Cookie Policy for our Billboard Hot 100 database.",
  keywords:
    "legal information, terms of use, privacy policy, cookie policy, billboard hot 100, pophits legal",
  openGraph: {
    title: "Legal Information | PopHits.org",
    description:
      "Legal information for PopHits.org - Billboard Hot 100 database. Access our legal policies and terms.",
    url: "https://pophits.org/legal",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Legal Information | PopHits.org",
    description:
      "Legal information for PopHits.org - Billboard Hot 100 database and music history platform.",
  },
  alternates: {
    canonical: "https://pophits.org/legal",
  },
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Scale className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Legal Information
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-pink-500" />
          <span>Important legal documents for PopHits.org users</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl mb-6">
            <div className="flex items-start gap-3 mb-2">
              <Calendar className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Last Updated: June 25, 2025
                </h3>
                <p className="text-gray-700">
                  This section contains all the legal documents that govern your use of PopHits.org, 
                  our Billboard Hot 100 database and music discovery platform.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            <Link
              href="/legal/terms"
              className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg border hover:border-pink-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <Scale className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors">
                    Terms of Use
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Learn about your rights and responsibilities when using PopHits.org. 
                    Covers user conduct, content usage, and website policies for our 
                    Billboard Hot 100 database.
                  </p>
                  <div className="flex items-center gap-2 text-pink-600 group-hover:text-pink-700 font-medium">
                    <span>Read Terms</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/legal/privacy"
              className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg border hover:border-pink-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                    Privacy Policy
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Understand how we collect, use, and protect your information when you 
                    explore our music database. Your privacy matters to us, and we're 
                    committed to transparency.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 font-medium">
                    <span>Read Privacy Policy</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/legal/cookies"
              className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg border hover:border-pink-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Cookie className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                    Cookie Policy
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Learn about the cookies we use to enhance your PopHits.org experience. 
                    Understand what cookies are, how we use them, and how you can manage 
                    your preferences.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium">
                    <span>Read Cookie Policy</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>



      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors font-medium"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to PopHits.org
        </Link>
      </div>
    </div>
  );
}
