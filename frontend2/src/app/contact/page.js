import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import {
  Mail,
  MessageSquare,
  Clock,
  ArrowRight,
  Music,
  Database,
  Shield,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Contact Us | PopHits.org",
  description:
    "Get in touch with PopHits.org - Contact us about our Billboard Hot 100 database, report issues, or ask questions about music chart history.",
  keywords:
    "contact pophits, billboard hot 100 support, music database contact, pophits help",
  openGraph: {
    title: "Contact Us | PopHits.org",
    description:
      "Contact PopHits.org - Your Billboard Hot 100 database and music history platform.",
    url: "https://pophits.org/contact",
    siteName: "PopHits.org",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | PopHits.org",
    description:
      "Contact PopHits.org - Your Billboard Hot 100 database and music history platform.",
  },
  alternates: {
    canonical: "https://pophits.org/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <Mail className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Contact Us
            </span>
          </div>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-pink-500" />
          <span>We&apos;d love to hear from you!</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <ContactForm 
                title="Send us a message" 
                subtitle="Whether you have questions about our Billboard Hot 100 database, found an issue, or just want to say hello - we're here to help!"
                accessKey="cd11e4c7-af6c-4b32-8ccf-e60de08eea6f"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Response Time */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">Response Time</h3>
              </div>
              <p className="text-gray-600 text-sm">
                We typically respond to messages within 24-48 hours. For urgent 
                issues related to our Billboard Hot 100 database, we&apos;ll get back 
                to you as soon as possible.
              </p>
            </div>
          </div>

          {/* What to Contact About */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800">What can we help with?</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Music className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Questions about chart data or song information</span>
                </div>
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Technical issues or bug reports</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Privacy or legal policy questions</span>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">General feedback and suggestions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Questions */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Legal Questions?</h4>
            <p className="text-gray-600 text-sm mb-3">
              For questions about our Terms of Use, Privacy Policy, or Cookie Policy:
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 transition-colors font-medium text-sm"
            >
              <span>Visit Legal Section</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">About PopHits.org</h3>
        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
          PopHits.org is your comprehensive source for Billboard Hot 100 chart history from 1958 to today. 
          We&apos;re passionate about music data and helping people discover the rich history of popular music.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors font-medium"
        >
          <span>Learn more about us</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="text-center mt-8">
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
