#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Wick & Wax Co Installation Script ===${NC}\n"

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
if (( $(echo "$NODE_VERSION 18.0.0" | awk '{print ($1 < $2)}') )); then
    echo -e "${RED}Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please update it with your configuration.${NC}"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}DATABASE_URL environment variable is not set.${NC}"
    echo "Please set it in your .env file or environment variables."
    exit 1
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Set up initial configuration
echo "Setting up initial configuration..."
npm run setup

echo -e "\n${GREEN}Installation completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Visit http://your-domain/setup to complete the setup wizard"
echo "2. Log in with the default admin credentials:"
echo "   Username: admin@wickandwax.co"
echo "   Password: The password you set during the setup wizard"
echo -e "\n${RED}Important: Make sure to change the default admin password after logging in.${NC}"
