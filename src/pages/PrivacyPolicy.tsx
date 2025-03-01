import React from 'react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
          <p className="text-gray-600 mb-4">
            This Cookie Policy explains how Wick and Wax Co. ("we", "us", or "our") uses cookies and similar technologies
            to recognize you when you visit our website. It explains what these technologies are and why we use them,
            as well as your rights to control our use of them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
            as well as to provide reporting information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Necessary Cookies</h3>
              <p className="text-gray-600">
                These cookies are essential for the website to function properly. They enable basic functions like page
                navigation and access to secure areas of the website. The website cannot function properly without these
                cookies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
              <p className="text-gray-600">
                These cookies help us understand how visitors interact with our website by collecting and reporting
                information anonymously. This helps us improve our website's structure and content.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
              <p className="text-gray-600">
                These cookies are used to track visitors across websites. The intention is to display ads that are
                relevant and engaging for the individual user.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Preferences Cookies</h3>
              <p className="text-gray-600">
                These cookies enable the website to remember information that changes the way the website behaves or
                looks, like your preferred language or the region you are in.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How can you control cookies?</h2>
          <p className="text-gray-600 mb-4">
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies,
            you may still use our website though your access to some functionality and areas of our website may be
            restricted.
          </p>
          <p className="text-gray-600 mb-4">
            You can also control your cookie preferences through our cookie consent banner, which appears when you first
            visit our website. You can modify these preferences at any time by clicking the "Cookie Preferences" link
            in the footer of our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to this Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for
            other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to
            stay informed about our use of cookies and related technologies.
          </p>
          <p className="text-gray-600">
            The date at the bottom of this page indicates when this Cookie Policy was last updated.
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: February 13, 2025
          </p>
        </footer>
      </div>
    </div>
  );
}
