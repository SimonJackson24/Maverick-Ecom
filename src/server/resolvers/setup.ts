import { prisma } from '../db';
import { hash } from 'bcryptjs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const setupResolvers = {
  Query: {
    setupState: async () => {
      let setupState = await prisma.setupState.findFirst({
        where: { id: 1 },
      });

      if (!setupState) {
        setupState = await prisma.setupState.create({
          data: {
            id: 1,
            isSetupComplete: false,
            currentStep: 'welcome',
          },
        });
      }

      return setupState;
    },

    storeSettings: async () => {
      return prisma.storeSettings.findFirst({
        where: { id: 1 },
      });
    },

    testDatabaseConnection: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
    },
  },

  Mutation: {
    updateSetupState: async (_, { input }) => {
      return prisma.setupState.upsert({
        where: { id: 1 },
        update: input,
        create: {
          id: 1,
          ...input,
        },
      });
    },

    createStoreSettings: async (_, { input }) => {
      const settings = await prisma.storeSettings.create({
        data: input,
      });

      await prisma.setupState.update({
        where: { id: 1 },
        data: { storeInitialized: true },
      });

      return settings;
    },

    createAdminUser: async (_, { input }) => {
      const { email, password, firstName, lastName } = input;
      
      const hashedPassword = await hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ADMIN',
        },
      });

      await prisma.setupState.update({
        where: { id: 1 },
        data: { adminCreated: true },
      });

      return user;
    },

    runDatabaseMigrations: async () => {
      try {
        await execAsync('npx prisma migrate deploy');
        return true;
      } catch (error) {
        console.error('Failed to run migrations:', error);
        throw new Error('Failed to run database migrations');
      }
    },
  },
};
