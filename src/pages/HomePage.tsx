import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { Sustainability } from '../components/home/Sustainability';
import { CandleCare } from '../components/home/CandleCare';
import { Newsletter } from '../components/home/Newsletter';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>The Wick & Wax Co. | Eco-Friendly Luxury Candles</title>
        <meta
          name="description"
          content="Discover our collection of handcrafted, eco-friendly luxury candles. Made with sustainable materials and natural fragrances. Shop now and light up your space sustainably."
        />
      </Helmet>

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Collection Categories */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
            {/* Seasonal Collection */}
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
              <img
                src="/images/seasonal-collection.jpg"
                alt="Seasonal collection of eco-friendly candles"
                className="object-cover object-center group-hover:opacity-75"
              />
              <div className="flex flex-col justify-end bg-black bg-opacity-40 p-6">
                <h3 className="text-xl font-semibold text-white">Seasonal Collection</h3>
                <p className="mt-1 text-sm text-white">
                  Limited edition fragrances inspired by the seasons
                </p>
              </div>
            </div>

            {/* Signature Collection */}
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1">
              <img
                src="/images/signature-collection.jpg"
                alt="Signature collection of luxury candles"
                className="object-cover object-center group-hover:opacity-75"
              />
              <div className="flex flex-col justify-end bg-black bg-opacity-40 p-6">
                <h3 className="text-xl font-semibold text-white">Signature Collection</h3>
                <p className="mt-1 text-sm text-white">Our timeless bestselling fragrances</p>
              </div>
            </div>

            {/* Gift Sets */}
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1">
              <img
                src="/images/gift-sets.jpg"
                alt="Luxury candle gift sets"
                className="object-cover object-center group-hover:opacity-75"
              />
              <div className="flex flex-col justify-end bg-black bg-opacity-40 p-6">
                <h3 className="text-xl font-semibold text-white">Gift Sets</h3>
                <p className="mt-1 text-sm text-white">
                  Curated collections perfect for gifting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <Sustainability />

      {/* Candle Care Guide */}
      <CandleCare />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Social Proof */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-lg font-semibold text-primary-600">Trusted by Customers</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Community Says
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <blockquote className="rounded-lg bg-gray-50 p-6">
              <p className="text-base text-gray-600">
                "The most amazing candles I've ever used. The scents are natural and long-lasting, and
                I love that they're eco-friendly!"
              </p>
              <footer className="mt-4">
                <p className="text-base font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </footer>
            </blockquote>

            {/* Testimonial 2 */}
            <blockquote className="rounded-lg bg-gray-50 p-6">
              <p className="text-base text-gray-600">
                "Beautiful packaging, wonderful scents, and I feel good knowing I'm supporting a
                sustainable business."
              </p>
              <footer className="mt-4">
                <p className="text-base font-semibold text-gray-900">Michael R.</p>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </footer>
            </blockquote>

            {/* Testimonial 3 */}
            <blockquote className="rounded-lg bg-gray-50 p-6">
              <p className="text-base text-gray-600">
                "These candles make perfect gifts. The sustainable packaging and natural ingredients
                make them extra special."
              </p>
              <footer className="mt-4">
                <p className="text-base font-semibold text-gray-900">Emily L.</p>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
