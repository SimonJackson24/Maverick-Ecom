import { prisma } from '../db';

export const analyticsResolvers = {
  Query: {
    analyticsSettings: async (_parent: any, _args: any, context: any) => {
      // Ensure user is authenticated and has admin access
      if (!context.user || !context.user.isAdmin) {
        throw new Error('Unauthorized');
      }

      // Get settings from database
      const settings = await prisma.analyticsSettings.findFirst();
      
      // Return default settings if none exist
      if (!settings) {
        return {
          enableGoogleAnalytics: false,
          googleAnalyticsId: '',
          enableHeatmaps: false,
          trackUserBehavior: true,
          anonymizeIp: true,
          enableEcommerce: true,
          enableConversionTracking: false,
          enableABTesting: false,
          maxConcurrentTests: 3,
          trackingDomains: [],
          excludedPaths: [],
          customDimensions: [],
          conversionGoals: [],
          sampleRate: 100,
          sessionTimeout: 30,
          crossDomainTracking: false,
          userIdTracking: true,
        };
      }

      return settings;
    },
  },

  Mutation: {
    updateAnalyticsSettings: async (_parent: any, { input }: any, context: any) => {
      // Ensure user is authenticated and has admin access
      if (!context.user || !context.user.isAdmin) {
        throw new Error('Unauthorized');
      }

      // Update or create settings
      const settings = await prisma.analyticsSettings.upsert({
        where: {
          id: 1, // We only have one settings record
        },
        update: input,
        create: {
          id: 1,
          ...input,
        },
      });

      return settings;
    },
  },
};
