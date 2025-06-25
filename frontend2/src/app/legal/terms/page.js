import Link from "next/link";
import {
  Scale,
  Shield,
  Users,
  AlertTriangle,
  FileText,
  Mail,
  ArrowRight,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Terms of Use | PopHits.org",
  description:
    "Terms of Use for PopHits.org - Billboard Hot 100 database. Learn about user responsibilities, content usage, and website policies.",
  keywords:
    "terms of use, legal, billboard hot 100, pophits terms, website policy",
  openGraph: {
    title: "Terms of Use | PopHits.org",
    description:
      "Terms of Use for PopHits.org - Billboard Hot 100 database and music history platform.",
    url: "https://pophits.org/legal/terms",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use | PopHits.org",
    description:
      "Terms of Use for PopHits.org - Billboard Hot 100 database and music history platform.",
  },
  alternates: {
    canonical: "https://pophits.org/legal/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Scale className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Terms of Use
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-pink-500" />
          <span>Your guide to using PopHits.org responsibly</span>
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
                  By accessing and using PopHits.org, you agree to be bound by these Terms of Use. 
                  Please read them carefully before using our website.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Acceptance of Terms
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Welcome to PopHits.org! By using our website, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Use and our Privacy Policy. 
              If you do not agree to these terms, please do not use our website.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Website Description
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              PopHits.org is a comprehensive database and platform dedicated to Billboard Hot 100 
              chart history from 1958 to today. We provide information about songs, artists, chart 
              positions, and allow users to rate and discover music. Our content includes historical 
              data, user-generated ratings, and educational information about pop music history.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                User Conduct
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p><strong>You agree to use PopHits.org only for lawful purposes and in accordance with these terms. You agree NOT to:</strong></p>
              <ul className="space-y-2 ml-4">
                <li>• Submit false, misleading, or inappropriate content</li>
                <li>• Attempt to manipulate song ratings or chart data</li>
                <li>• Use automated tools to scrape or harvest data from our website</li>
                <li>• Interfere with the website's functionality or security</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on intellectual property rights of others</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Content and Intellectual Property
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                The content on PopHits.org, including but not limited to text, graphics, logos, 
                and software, is owned by PopHits.org or its content suppliers and is protected 
                by copyright and other intellectual property laws.
              </p>
              <p>
                <strong>Chart Data:</strong> Billboard Hot 100 chart information is used for 
                educational and informational purposes. Chart data and song information remain 
                the property of their respective owners.
              </p>
              <p>
                <strong>User Contributions:</strong> When you submit ratings, reviews, or other 
                content, you grant PopHits.org a non-exclusive license to use, display, and 
                distribute that content on our platform.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Disclaimers and Limitations
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                PopHits.org is provided "as is" without warranties of any kind. We strive for 
                accuracy in our chart data and information, but cannot guarantee that all 
                information is error-free or complete.
              </p>
              <p>
                We are not liable for any damages arising from your use of the website, 
                including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Privacy and Data
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our{" "}
              <Link 
                href="/legal/privacy" 
                className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
              >
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Changes to Terms
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms of Use at any time. Changes will be 
              effective immediately upon posting on this page. Your continued use of PopHits.org 
              after any changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </div>

   

      <div className="text-center">
        <Link
          href="/legal"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors font-medium"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Legal Information
        </Link>
      </div>
    </div>
  );
}
