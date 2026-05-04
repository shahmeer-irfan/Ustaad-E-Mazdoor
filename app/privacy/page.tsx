import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-primary-foreground/80">
            Last updated: November 24, 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Ustaad E-Mazdoor ("we," "our," or "us"). We are
              committed to protecting your personal information and your right
              to privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Personal Information
                </h3>
                <p className="leading-relaxed">
                  We collect personal information that you voluntarily provide
                  to us when you register on the platform, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Profile information and professional details</li>
                  <li>Payment and billing information</li>
                  <li>Portfolio samples and work history</li>
                  <li>Communications with other users</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Automatically Collected Information
                </h3>
                <p className="leading-relaxed">
                  When you access our platform, we automatically collect:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How We Use Your Information
            </h2>
            <div className="text-muted-foreground space-y-3">
              <p className="leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our platform</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about updates and offers</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Facilitate connections between freelancers and clients</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Information Sharing and Disclosure
            </h2>
            <div className="text-muted-foreground space-y-4">
              <p className="leading-relaxed">
                We may share your information in the following situations:
              </p>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  With Other Users
                </h3>
                <p className="leading-relaxed">
                  Your profile information, portfolio, and ratings are visible
                  to other users to facilitate connections and hiring decisions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Service Providers
                </h3>
                <p className="leading-relaxed">
                  We share information with third-party service providers who
                  perform services on our behalf (payment processing, hosting,
                  analytics).
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Legal Requirements
                </h3>
                <p className="leading-relaxed">
                  We may disclose information if required by law or to protect
                  our rights and the safety of our users.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Privacy Rights</h2>
            <div className="text-muted-foreground space-y-3">
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, please contact us at
                privacy@ustaad.pk
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our platform and store certain information. You can instruct
              your browser to refuse all cookies or indicate when a cookie is
              being sent. However, some features may not function properly
              without cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform is not intended for users under the age of 18. We do
              not knowingly collect personal information from children. If you
              believe we have collected information from a child, please contact
              us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="space-y-2">
                <li>Email: privacy@ustaad.pk</li>
                <li>Phone: +92 300 1234567</li>
                <li>Address: 123 Shahrah-e-Faisal, Karachi, Pakistan</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
