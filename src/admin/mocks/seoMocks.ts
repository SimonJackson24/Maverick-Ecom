import { graphql, HttpResponse } from 'msw';

const defaultSeoSettings = {
  defaultTitle: 'Wick and Wax Co - Premium Handcrafted Candles',
  defaultDescription: 'Discover our collection of premium handcrafted candles and wax melts. Made with natural ingredients and unique scents.',
  defaultKeywords: 'candles, wax melts, handcrafted, natural, soy wax, scented candles',
  robotsTxt: 'User-agent: *\nAllow: /',
  sitemapEnabled: true,
  canonicalUrlsEnabled: true,
  socialImage: 'https://wickandwax.co/images/social-share.jpg',
  googleVerification: '',
  bingVerification: '',
};

export const seoHandlers = [
  // Query: Get SEO Settings
  graphql.query('GetSeoSettings', () => {
    return HttpResponse.json({
      data: {
        seoSettings: defaultSeoSettings,
      },
    });
  }),

  // Mutation: Update SEO Settings
  graphql.mutation('UpdateSeoSettings', ({ variables }) => {
    return HttpResponse.json({
      data: {
        updateSeoSettings: {
          ...defaultSeoSettings,
          ...variables.input,
        },
      },
    });
  }),
];
