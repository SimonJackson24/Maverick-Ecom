import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Products',
    question: 'What makes your candles eco-friendly?',
    answer:
      'Our candles are made with 100% natural soy wax, sustainable wooden wicks, and natural essential oils. We use recyclable glass containers and eco-friendly packaging materials. All our ingredients are ethically sourced and biodegradable.',
  },
  {
    category: 'Products',
    question: 'How long do your candles burn?',
    answer:
      'Our standard 8oz candles have a burn time of approximately 40-50 hours when burned properly. Our larger 12oz candles can burn for 60-70 hours. Actual burn time may vary based on environmental factors and usage patterns.',
  },
  {
    category: 'Products',
    question: 'Are your fragrances natural?',
    answer:
      'Yes, we use only natural essential oils and botanical extracts in our candles. We never use synthetic fragrances or artificial additives, ensuring a clean and authentic scent experience.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to most countries worldwide. International shipping times vary by location. Please note that customers are responsible for any import duties or taxes that may apply.',
  },
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer:
      'Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 business days, depending on the destination and customs processing.',
  },
  {
    category: 'Orders',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of delivery for unused items in their original packaging. Please contact our customer service team to initiate a return. Note that custom orders are non-returnable.',
  },
  {
    category: 'Orders',
    question: 'Can I modify or cancel my order?',
    answer:
      'Orders can be modified or cancelled within 2 hours of placement. After this window, we cannot guarantee changes as orders enter our fulfillment process quickly.',
  },
  {
    category: 'Care & Usage',
    question: 'How do I care for my candle?',
    answer:
      'For optimal burning: 1) Trim the wick to 1/4 inch before each use, 2) Allow the wax to melt completely across the surface on first burn, 3) Burn for 2-4 hours at a time, 4) Keep away from drafts, and 5) Discontinue use when 1/2 inch of wax remains.',
  },
  {
    category: 'Care & Usage',
    question: 'Why is the first burn so important?',
    answer:
      'The first burn sets the "memory" of the wax pool. Allowing the wax to melt completely across the surface (about 2-3 hours) prevents tunneling and ensures even burning throughout the life of your candle.',
  },
  {
    category: 'Sustainability',
    question: 'How do you offset your carbon footprint?',
    answer:
      'We partner with verified carbon offset programs to neutralize our shipping emissions. Our production facility runs on renewable energy, and we use electric vehicles for local deliveries.',
  },
  {
    category: 'Sustainability',
    question: 'Can I recycle the candle container?',
    answer:
      'Yes! Once your candle is finished, clean the container with soap and warm water to remove any remaining wax. The glass container can then be recycled or repurposed. We also offer a container return program for local customers.',
  },
  {
    category: 'Wholesale',
    question: 'Do you offer wholesale pricing?',
    answer:
      'Yes, we offer wholesale pricing for qualified retailers. Please contact our wholesale department through the contact form or email wholesale@wickandwax.co for more information.',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | The Wick & Wax Co.</title>
        <meta
          name="description"
          content="Find answers to common questions about our sustainable candles, shipping, returns, and more."
        />
      </Helmet>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Find answers to common questions about our products, shipping, and sustainability
              practices.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search FAQs
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="mx-auto mt-16 max-w-3xl divide-y divide-gray-900/10">
            <dl className="space-y-8 divide-y divide-gray-900/10">
              {filteredFaqs.map((faq) => (
                <div key={faq.question} className="pt-8 first:pt-0">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">{faq.question}</dt>
                  <dd className="mt-4 text-base leading-7 text-gray-600">{faq.answer}</dd>
                  <div className="mt-4">
                    <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/10">
                      {faq.category}
                    </span>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Contact CTA */}
          <div className="mx-auto mt-20 max-w-3xl text-center">
            <p className="text-base leading-7 text-gray-600">
              Can't find what you're looking for?{' '}
              <a href="/contact" className="font-semibold text-primary-600 hover:text-primary-500">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
