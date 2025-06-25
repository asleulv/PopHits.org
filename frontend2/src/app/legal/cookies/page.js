import Link from "next/link";
import {
  Cookie,
  Shield,
  Settings,
  Eye,
  BarChart3,
  Globe,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Cookie Policy | PopHits.org",
  description:
    "Cookie Policy for PopHits.org - Learn about the cookies we use to enhance your Billboard Hot 100 browsing experience.",
  keywords:
    "cookie policy, cookies, billboard hot 100, pophits cookies, website tracking",
  openGraph: {
    title: "Cookie Policy | PopHits.org",
    description:
      "Cookie Policy for PopHits.org - Billboard Hot 100 database. Learn about our cookie usage.",
    url: "https://pophits.org/legal/cookies",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | PopHits.org",
    description:
      "Cookie Policy for PopHits.org - Billboard Hot 100 database and music history platform.",
  },
  alternates: {
    canonical: "https://pophits.org/legal/cookies",
  },
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Cookie className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Cookie Policy
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <Eye className="w-5 h-5 text-pink-500" />
          <span>Understanding how we use cookies on PopHits.org</span>
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
                  This Cookie Policy explains what cookies are and how we use them on PopHits.org, 
                  your Billboard Hot 100 database and music discovery platform.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                What Are Cookies?
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Cookies are small text files that are stored on your computer, tablet, or mobile device 
                when you visit a website. They help websites remember information about your visit, 
                which can make your next visit easier and the site more useful to you.
              </p>
              <p>
                Cookies cannot access any other information on your computer and most web browsers 
                automatically accept cookies. You can control and manage cookies through your browser settings.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Types of Cookies We Use
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h4 className="font-semibold text-gray-800">Essential Cookies</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  These cookies are necessary for the website to function properly. They enable 
                  basic functions like page navigation, access to secure areas, and remembering 
                  your preferences as you browse PopHits.org.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-gray-800">Analytics Cookies</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously. This helps us improve how 
                  our Billboard Hot 100 database functions and what content is most valuable to users.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <h4 className="font-semibold text-gray-800">Preference Cookies</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  These cookies remember your choices and preferences (such as language, region, 
                  or display settings) to provide a more personalized experience when you return 
                  to PopHits.org.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Third-Party Cookies
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                PopHits.org may use third-party services that place their own cookies on your device. 
                These services help us provide better functionality and understand how our website is used:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Google Analytics:</strong> Helps us analyze website traffic and user behavior</li>
                <li>• <strong>Social Media Platforms:</strong> Enable sharing buttons and social media integration</li>
                <li>• <strong>Content Delivery Networks:</strong> Improve website loading speed and performance</li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie practices, which we 
                encourage you to review.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                How We Use Cookies
              </h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>We use cookies on PopHits.org to:</p>
              <ul className="space-y-1 ml-4">
                <li>• Remember your preferences and settings</li>
                <li>• Improve website performance and loading times</li>
                <li>• Analyze how visitors use our Billboard Hot 100 database</li>
                <li>• Understand which songs and artists are most popular</li>
                <li>• Provide personalized content recommendations</li>
                <li>• Ensure website security and prevent fraud</li>
                <li>• Remember your song ratings and favorites</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Managing Your Cookie Preferences
              </h3>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                You have several options for managing cookies on PopHits.org:
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Browser Settings</h4>
                <p className="text-sm text-gray-700">
                  Most web browsers allow you to control cookies through their settings. You can 
                  typically block all cookies, accept only certain cookies, or delete existing cookies. 
                  Note that blocking all cookies may affect website functionality.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Cookie Banner</h4>
                <p className="text-sm text-gray-700">
                  When you first visit PopHits.org, you&apos;ll see a cookie consent banner that allows 
                  you to accept or decline non-essential cookies. You can change your preferences 
                  at any time by clearing your browser cookies and revisiting our site.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Cookie Security
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect the information stored in cookies. 
              However, please note that cookies themselves do not typically contain sensitive personal 
              information like passwords or payment details.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Your Rights
              </h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>You have the right to:</p>
              <ul className="space-y-1 ml-4">
                <li>• Know what cookies we use and why</li>
                <li>• Accept or decline non-essential cookies</li>
                <li>• Delete cookies from your browser at any time</li>
                <li>• Change your cookie preferences</li>
                <li>• Access information about cookies we&apos;ve placed</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Updates to This Policy
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any 
              material changes by updating the Last Updated date at the top of this policy.
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
