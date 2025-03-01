# Deploying to Hestia Panel

## Prerequisites
1. A Hestia Panel account with:
   - Node.js support
   - PostgreSQL database
   - Domain or subdomain configured

## Database Setup
1. In Hestia Panel:
   - Go to "Databases" section
   - Create a new PostgreSQL database
   - Note down the following details:
     - Database name
     - Username
     - Password
     - Host (usually localhost)
     - Port (usually 5432)

2. Create your database URL using this format:
   ```
   postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
   ```

## Environment Variables
1. In Hestia Panel web interface:
   - Go to your domain's settings
   - Find the "Environment Variables" section
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
     NODE_ENV=production
     ```

## Deployment Steps
1. Prepare your application:
   ```bash
   # Build the application
   npm run build

   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate deploy
   ```

2. Upload files to Hestia:
   - Upload all files except:
     - node_modules/
     - .git/
     - .env
     - .env.*
   
3. In Hestia Panel:
   - Install dependencies: `npm install --production`
   - Start the application: `npm start`

## Post-Deployment
1. Verify the application is running
2. Check database connectivity
3. Monitor the application logs

## Common Issues
1. Database Connection:
   - Ensure DATABASE_URL is correctly formatted
   - Check if the database user has proper permissions
   - Verify the database is accessible from the application server

2. Node.js Version:
   - Make sure Hestia is using the correct Node.js version
   - You can specify the Node.js version in package.json:
     ```json
     {
       "engines": {
         "node": ">=18.0.0"
       }
     }
     ```

## Maintenance
1. Database Backups:
   - Use Hestia's built-in backup functionality
   - Schedule regular backups

2. Updates:
   - Always backup before updating
   - Test updates in a staging environment first
   - Follow semantic versioning for releases
