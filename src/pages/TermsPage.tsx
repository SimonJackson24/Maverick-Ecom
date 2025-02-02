import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Agreement to Terms',
    content: `By accessing our website at wickandwax.co, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
  },
  {
    title: 'Use License',
    content: `Permission is granted to temporarily download one copy of the materials (information or software) on The Wick & Wax Co.'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
    
    • Modify or copy the materials
    • Use the materials for any commercial purpose
    • Attempt to decompile or reverse engineer any software contained on the website
    • Remove any copyright or other proprietary notations from the materials
    • Transfer the materials to another person or "mirror" the materials on any other server
    
    This license shall automatically terminate if you violate any of these restrictions and may be terminated by The Wick & Wax Co. at any time.`,
  },
  {
    title: 'Disclaimer',
    content: `The materials on The Wick & Wax Co.'s website are provided on an 'as is' basis. The Wick & Wax Co. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`,
  },
  {
    title: 'Limitations',
    content: `In no event shall The Wick & Wax Co. or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Wick & Wax Co.'s website, even if The Wick & Wax Co. or a The Wick & Wax Co. authorized representative has been notified orally or in writing of the possibility of such damage.`,
  },
  {
    title: 'Accuracy of Materials',
    content: `The materials appearing on The Wick & Wax Co.'s website could include technical, typographical, or photographic errors. The Wick & Wax Co. does not warrant that any of the materials on its website are accurate, complete or current. The Wick & Wax Co. may make changes to the materials contained on its website at any time without notice.`,
  },
  {
    title: 'Product Information',
    content: `We strive to display our products and their colors as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to modify product descriptions, prices, and availability at any time without notice.`,
  },
  {
    title: 'Shipping and Delivery',
    content: `We aim to process and ship orders within 1-2 business days. Delivery times will vary based on your location and chosen shipping method. We are not responsible for delays caused by customs processing for international orders.`,
  },
  {
    title: 'Returns and Refunds',
    content: `We accept returns of unused items in their original packaging within 30 days of delivery. Custom orders are non-returnable. Please refer to our Returns Policy for detailed information about the return process.`,
  },
  {
    title: 'User Account',
    content: `When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.`,
  },
  {
    title: 'Intellectual Property',
    content: `All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of The Wick & Wax Co. and is protected by copyright and other intellectual property laws.`,
  },
  {
    title: 'Governing Law',
    content: `These terms and conditions are governed by and construed in accordance with the laws of the State of California, and you irrevocably submit to the exclusive jurisdiction of the courts in that State.`,
  },
  {
    title: 'Changes to Terms',
    content: `We reserve the right to modify these terms of service at any time. We do so by posting modified terms on this website. Your continued use of the website after any such changes constitutes your acceptance of the new terms of service.`,
  },
];

const TermsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | The Wick & Wax Co.</title>
        <meta
          name="description"
          content="Read our terms of service to understand your rights and responsibilities when using our website and services."
        />
      </Helmet>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-base text-gray-500">Last Updated: February 2, 2025</p>

            <div className="mt-8 text-base text-gray-600">
              <p>
                Please read these terms of service carefully before using our website. By using the
                website, you agree to be bound by these terms. If you have any questions, please{' '}
                <Link to="/contact" className="text-primary-600 hover:text-primary-500">
                  contact us
                </Link>
                .
              </p>
            </div>

            {/* Table of Contents */}
            <nav className="mt-12 border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900">Contents</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sections.map((section) => (
                  <li key={section.title}>
                    <a
                      href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-600 hover:text-primary-600"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Terms Content */}
            <div className="mt-16 space-y-16">
              {sections.map((section) => (
                <div
                  key={section.title}
                  id={section.title.toLowerCase().replace(/\s+/g, '-')}
                  className="scroll-mt-16"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">{section.title}</h2>
                  <div className="mt-6 text-base leading-7 text-gray-600 whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-16 border-t border-gray-200 pt-8">
              <p className="text-base text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <address className="mt-4 not-italic">
                <p className="text-base text-gray-600">The Wick & Wax Co.</p>
                <p className="text-base text-gray-600">123 Market Street</p>
                <p className="text-base text-gray-600">San Francisco, CA 94105</p>
                <p className="text-base text-gray-600">
                  Email:{' '}
                  <a href="mailto:legal@wickandwax.co" className="text-primary-600 hover:text-primary-500">
                    legal@wickandwax.co
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
