import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover"
          src="/images/hero-candles.jpg"
          alt="Handcrafted eco-friendly candles"
        />
        <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" />
      </div>
      <div className="relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Sustainable Luxury
          <br />
          <span className="text-primary-200">for Your Home</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl text-gray-100">
          Handcrafted eco-friendly candles made with sustainable materials and natural fragrances.
          Transform your space while protecting our planet.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            to="/products"
            className="rounded-md bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="text-lg font-semibold leading-6 text-white hover:text-primary-200"
          >
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
