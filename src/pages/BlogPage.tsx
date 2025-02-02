import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Types
interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  date: string;
  readTime: string;
  slug: string;
}

const featuredPost: BlogPost = {
  id: '1',
  title: 'The Art of Sustainable Candle Making',
  description:
    'Discover the intricate process of creating eco-friendly candles, from selecting sustainable materials to mastering the perfect pour.',
  image: '/images/blog/sustainable-candle-making.jpg',
  category: 'Sustainability',
  author: {
    name: 'Sarah Johnson',
    role: 'Founder & Creative Director',
    image: '/images/team/sarah.jpg',
  },
  date: 'Jan 15, 2025',
  readTime: '6 min read',
  slug: 'the-art-of-sustainable-candle-making',
};

const posts: BlogPost[] = [
  {
    id: '2',
    title: 'Understanding Natural Fragrances',
    description:
      'Learn about the benefits of natural fragrances and how they compare to synthetic alternatives in luxury candles.',
    image: '/images/blog/natural-fragrances.jpg',
    category: 'Education',
    author: {
      name: 'Emma Roberts',
      role: 'Lead Artisan',
      image: '/images/team/emma.jpg',
    },
    date: 'Jan 12, 2025',
    readTime: '4 min read',
    slug: 'understanding-natural-fragrances',
  },
  {
    id: '3',
    title: 'Creating a Cozy Winter Atmosphere',
    description:
      'Tips and tricks for using candles to create the perfect cozy atmosphere during the winter months.',
    image: '/images/blog/winter-atmosphere.jpg',
    category: 'Lifestyle',
    author: {
      name: 'Michael Chen',
      role: 'Head of Sustainability',
      image: '/images/team/michael.jpg',
    },
    date: 'Jan 10, 2025',
    readTime: '5 min read',
    slug: 'creating-cozy-winter-atmosphere',
  },
  // Add more blog posts here
];

const BlogPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blog | The Wick & Wax Co.</title>
        <meta
          name="description"
          content="Explore our blog for insights on sustainable living, candle care tips, and the latest in eco-friendly home fragrances."
        />
      </Helmet>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Featured Post */}
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From Our Journal
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Insights on sustainable living, candle care, and eco-friendly practices.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <article className="flex flex-col items-start justify-between lg:col-span-2">
              <Link to={`/blog/${featuredPost.slug}`} className="group">
                <div className="relative w-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime="2020-03-16" className="text-gray-500">
                      {featuredPost.date}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                      {featuredPost.category}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {featuredPost.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      src={featuredPost.author.image}
                      alt={featuredPost.author.name}
                      className="h-10 w-10 rounded-full bg-gray-100"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <span className="absolute inset-0" />
                        {featuredPost.author.name}
                      </p>
                      <p className="text-gray-600">{featuredPost.author.role}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            {/* Recent Posts */}
            <div className="mx-auto w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">Recent Posts</h3>
              <div className="space-y-8">
                {posts.map((post) => (
                  <article key={post.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                    <Link to={`/blog/${post.slug}`} className="group">
                      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-32 lg:shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                        />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-x-4 text-xs mt-4 lg:mt-0">
                          <time dateTime="2020-03-16" className="text-gray-500">
                            {post.date}
                          </time>
                          <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                            {post.category}
                          </span>
                        </div>
                        <div className="group relative max-w-xl">
                          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
