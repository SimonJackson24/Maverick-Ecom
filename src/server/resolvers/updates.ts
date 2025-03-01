import { prisma } from '../db';
import { VersionManager } from '../updates/version';

export const updateResolvers = {
  Query: {
    versionInfo: async () => {
      return VersionManager.checkForUpdates();
    },

    systemSettings: async () => {
      return prisma.systemSettings.findFirst({
        where: { id: 1 },
      });
    },
  },

  Mutation: {
    checkForUpdates: async () => {
      return VersionManager.checkForUpdates();
    },

    performUpdate: async () => {
      return VersionManager.performUpdate();
    },

    updateSystemSettings: async (_, { input }) => {
      return prisma.systemSettings.upsert({
        where: { id: 1 },
        update: input,
        create: {
          id: 1,
          version: await VersionManager.getCurrentVersion(),
          lastUpdated: new Date(),
          ...input,
        },
      });
    },
  },
};
