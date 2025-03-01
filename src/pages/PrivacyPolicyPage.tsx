import React from 'react';
import { Helmet } from 'react-helmet-async';

const sections = [
  {
    title: 'Introduction',
    content: `At The Wick & Wax Co., we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.`,
  },
  {
    title: 'Information We Collect',
    content: `We collect information that you provide directly to us when you:
    • Create an account
    • Make a purchase
    • Sign up for our newsletter
    • Contact us
    • Participate in surveys or promotions

    This information may include:
    • Name and contact information
    • Billing and shipping addresses
    • Payment information
    • Email preferences
    • Survey responses`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to:
    • Process your orders and payments
    • Communicate with you about your orders
    • Send you marketing communications (if you opt in)
    • Improve our website and services
    • Comply with legal obligations
    • Prevent fraud`,
  },
  {
    title: 'Information Sharing',
    content: `We may share your information with:
    • Service providers who assist in our operations
    • Payment processors
    • Shipping partners
    • Marketing partners (with your consent)
    
    We do not sell your personal information to third parties.`,
  },
  {
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to:
    • Access your personal information
    • Correct inaccurate information
    • Request deletion of your information
    • Opt out of marketing communications
    • Withdraw consent
    
    To exercise these rights, please contact us using the information provided below.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings.`,
  },
  {
    title: `Children's Privacy`,
    content: `Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at:
    
    The Wick & Wax Co.
    privacy@wickandwax.co
    123 Market Street
    San Francisco, CA 94105`,
  },
];

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | The Wick & Wax Co.</title>
        <meta
          name="description"
          content="Learn about how we collect, use, and protect your personal information at The Wick & Wax Co."
        />
      </Helmet>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base text-gray-500">Last Updated: February 2, 2025</p>

            <div className="mt-16 space-y-16">
              {sections.map((section) => (
                <div key={section.title} className="scroll-mt-16" id={section.title.toLowerCase()}>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">{section.title}</h2>
                  <div className="mt-6 text-base leading-7 text-gray-600 whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Navigation */}
            <div className="fixed top-1/2 right-8 hidden -translate-y-1/2 xl:block">
              <nav className="space-y-2" aria-label="Quick navigation">
                {sections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${section.title.toLowerCase()}`}
                    className="block text-sm text-gray-500 hover:text-gray-900"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
