import Link from "next/link";
import {
  Shield,
  Eye,
  Database,
  Cookie,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Calendar,
  Globe,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PopHits.org",
  description:
    "Privacy Policy for PopHits.org - Learn how we collect, use, and protect your data while you explore Billboard Hot 100 history.",
  keywords:
    "privacy policy, data protection, billboard hot 100, pophits privacy, user data",
  openGraph: {
    title: "Privacy Policy | PopHits.org",
    description:
      "Privacy Policy for PopHits.org - Billboard Hot 100 database. Learn how we protect your privacy.",
    url: "https://pophits.org/legal/privacy",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | PopHits.org",
    description:
      "Privacy Policy for PopHits.org - Billboard Hot 100 database and music history platform.",
  },
  alternates: {
    canonical: "https://pophits.org/legal/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Shield className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <Eye className="w-5 h-5 text-pink-500" />
          <span>Your privacy matters to us</span>
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
                  This Privacy Policy explains how PopHits.org collects, uses, and protects 
                  your information when you visit our Billboard Hot 100 database and music platform.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Information We Collect
              </h3>
            </div>
            <div className="text-gray-700 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Information You Provide:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Song ratings and reviews you submit</li>
                  <li>• Email address if you contact us</li>
                  <li>• Any feedback or comments you share</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Information Automatically Collected:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• IP address and general location</li>
                  <li>• Browser type and device information</li>
                  <li>• Pages visited and time spent on site</li>
                  <li>• Referring websites and search terms</li>
                  <li>• Technical information for site optimization</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Cookies and Tracking
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We use cookies and similar technologies to enhance your experience on PopHits.org:
              </p>
              <div className="space-y-2 ml-4">
                <p><strong>Essential Cookies:</strong> Required for basic website functionality</p>
                <p><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</p>
                <p><strong>Preference Cookies:</strong> Remember your settings and preferences</p>
              </div>
              <p>
                For detailed information about our cookie usage, please see our{" "}
                <Link 
                  href="/legal/cookies" 
                  className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
                >
                  Cookie Policy
                </Link>.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                How We Use Your Information
              </h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>We use the information we collect to:</p>
              <ul className="space-y-1 ml-4">
                <li>• Provide and improve our Billboard Hot 100 database service</li>
                <li>• Display song ratings and user-generated content</li>
                <li>• Analyze website usage and optimize performance</li>
                <li>• Respond to your inquiries and provide customer support</li>
                <li>• Ensure website security and prevent abuse</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Information Sharing
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share information only in these limited circumstances:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• With service providers who help us operate our website</li>
                <li>• When required by law or to protect our rights</li>
                <li>• In connection with a business transfer or merger</li>
                <li>• With your explicit consent</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Third-Party Services
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                PopHits.org may use third-party services for analytics, hosting, and other 
                website functions. These services may collect information according to their 
                own privacy policies:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Google Analytics for website analytics</li>
                <li>• Hosting providers for website infrastructure</li>
                <li>• Content delivery networks for performance</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Data Security
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Your Rights
              </h3>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="space-y-1 ml-4">
                <li>• Access to the personal information we hold about you</li>
                <li>• Correction of inaccurate or incomplete information</li>
                <li>• Deletion of your personal information</li>
                <li>• Objection to processing of your information</li>
                <li>• Data portability where applicable</li>
              </ul>
              <p>
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Children's Privacy
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              PopHits.org is not directed to children under 13. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have 
              collected personal information from a child under 13, we will take steps to 
              delete such information.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Changes to This Policy
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" 
              date. Your continued use of PopHits.org after any changes constitutes acceptance 
              of the updated policy.
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
