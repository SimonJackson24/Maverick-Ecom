import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// This would typically come from an API or CMS
const blogPost = {
  title: 'The Art of Sustainable Candle Making',
  description:
    'Discover the intricate process of creating eco-friendly candles, from selecting sustainable materials to mastering the perfect pour.',
  content: `
    <p>
      At The Wick & Wax Co., we believe that luxury and sustainability go hand in hand. Our candle-making process is a testament to this philosophy, combining traditional craftsmanship with eco-friendly materials and practices.
    </p>
    
    <h2>Selecting Sustainable Materials</h2>
    <p>
      The journey of creating a sustainable candle begins with careful material selection. We use 100% natural soy wax, derived from sustainably farmed soybeans. Unlike paraffin wax, which is a petroleum by-product, soy wax is renewable, biodegradable, and produces less soot when burning.
    </p>
    
    <h2>The Importance of Natural Fragrances</h2>
    <p>
      Our commitment to sustainability extends to our fragrances. We use only natural essential oils and botanical extracts, avoiding synthetic fragrances that can contain harmful chemicals. This not only creates a more authentic scent experience but also ensures our candles are safe for both you and the environment.
    </p>
    
    <h2>The Crafting Process</h2>
    <p>
      Each candle is handcrafted in small batches to ensure quality and minimize waste. Our artisans carefully measure and blend the wax and fragrances, maintaining precise temperatures for optimal scent throw and even burning. The wicks are hand-placed and centered to ensure a clean, even burn.
    </p>
    
    <h2>Sustainable Packaging</h2>
    <p>
      We believe sustainability shouldn't stop at the candle itself. Our packaging is plastic-free and either recyclable or biodegradable. The glass containers are designed to be reused or recycled, and our shipping materials are made from recycled content.
    </p>
    
    <h2>Tips for Sustainable Candle Use</h2>
    <ul>
      <li>Always trim the wick to 1/4 inch before lighting</li>
      <li>Allow the wax to melt completely across the surface on the first burn</li>
      <li>Keep your candle away from drafts to prevent uneven burning</li>
      <li>Reuse or recycle the container once the candle is finished</li>
    </ul>
  `,
  image: '/images/blog/sustainable-candle-making.jpg',
  category: 'Sustainability',
  author: {
    name: 'Sarah Johnson',
    role: 'Founder & Creative Director',
    image: '/images/team/sarah.jpg',
  },
  date: 'Jan 15, 2025',
  readTime: '6 min read',
};

// Related posts would typically come from an API or CMS
const relatedPosts = [
  {
    id: '2',
    title: 'Understanding Natural Fragrances',
    description:
      'Learn about the benefits of natural fragrances and how they compare to synthetic alternatives in luxury candles.',
    image: '/images/blog/natural-fragrances.jpg',
    category: 'Education',
    date: 'Jan 12, 2025',
    slug: 'understanding-natural-fragrances',
  },
  {
    id: '3',
    title: 'Creating a Cozy Winter Atmosphere',
    description:
      'Tips and tricks for using candles to create the perfect cozy atmosphere during the winter months.',
    image: '/images/blog/winter-atmosphere.jpg',
    category: 'Lifestyle',
    date: 'Jan 10, 2025',
    slug: 'creating-cozy-winter-atmosphere',
  },
];

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // In a real application, you would fetch the blog post data based on the slug
  // For now, we'll use the static data above

  return (
    <>
      <Helmet>
        <title>{blogPost.title} | The Wick & Wax Co.</title>
        <meta name="description" content={blogPost.description} />
      </Helmet>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {/* Article Header */}
            <div className="mb-10">
              <Link
                to="/blog"
                className="text-sm font-semibold leading-6 text-primary-600 hover:text-primary-500"
              >
                ← Back to blog
              </Link>
            </div>

            <article className="mx-auto max-w-2xl">
              <div className="mb-10">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime="2020-03-16" className="text-gray-500">
                    {blogPost.date}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                    {blogPost.category}
                  </span>
                </div>
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {blogPost.title}
                </h1>
                <p className="mt-4 text-lg text-gray-600">{blogPost.description}</p>
              </div>

              <div className="relative">
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>

              {/* Author */}
              <div className="mt-8 flex items-center gap-x-4">
                <img
                  src={blogPost.author.image}
                  alt={blogPost.author.name}
                  className="h-10 w-10 rounded-full bg-gray-100"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">{blogPost.author.name}</p>
                  <p className="text-gray-600">{blogPost.author.role}</p>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="mt-16 prose prose-lg prose-primary mx-auto"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </article>
          </div>

          {/* Related Posts */}
          <div className="mx-auto mt-24 max-w-7xl">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Related Posts
              </h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 group"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                  <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                  <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                    <time dateTime={post.date} className="mr-8">
                      {post.date}
                    </time>
                    <div className="-ml-4 flex items-center gap-x-4">
                      <span className="relative z-10 rounded-full bg-white/10 px-3 py-1.5 font-medium text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                    <span className="absolute inset-0" />
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
