#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    echo "Checking system requirements..."
    
    # Check if running in PuTTY/SSH
    if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
        echo "Running in SSH/PuTTY environment..."
        export TERM=xterm-256color
    fi

    # Check Node.js
    if ! command_exists node; then
        echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
        echo "For Ubuntu/Debian:"
        echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        echo "sudo apt-get install -y nodejs"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2)
    if (( $(echo "$NODE_VERSION 18.0.0" | awk '{print ($1 < $2)}') )); then
        echo -e "${RED}Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION${NC}"
        exit 1
    fi

    # Check PostgreSQL
    if ! command_exists psql; then
        echo -e "${RED}PostgreSQL is not installed.${NC}"
        echo "For Ubuntu/Debian:"
        echo "sudo apt-get install postgresql postgresql-contrib"
        exit 1
    fi

    # Check if required ports are available
    if ! command_exists netstat; then
        sudo apt-get install net-tools
    fi

    echo "Checking port 4001..."
    if netstat -tuln | grep -q ":4001 "; then
        echo -e "${RED}Port 4001 is already in use. Please free up this port before continuing.${NC}"
        exit 1
    fi
}

# Function to setup environment
setup_environment() {
    echo "Setting up environment..."

    # Create necessary directories
    mkdir -p logs/pm2
    mkdir -p public/uploads
    mkdir -p backups

    # Set correct permissions
    chmod 755 logs
    chmod 755 public/uploads
    chmod 755 backups

    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
        echo -e "${GREEN}Created .env file. Please update it with your configuration.${NC}"
    fi
}

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies..."
    npm install --no-optional

    # Install global dependencies
    echo "Installing global dependencies..."
    sudo npm install -g pm2 typescript ts-node
}

# Function to setup database
setup_database() {
    echo "Setting up database..."

    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}DATABASE_URL environment variable is not set.${NC}"
        echo "Please set it in your .env file or environment variables."
        echo "Example format: postgresql://user:password@localhost:5432/wickandwax"
        exit 1
    fi

    # Generate Prisma client
    echo "Generating Prisma client..."
    npx prisma generate

    # Run database migrations
    echo "Running database migrations..."
    npx prisma migrate deploy
}

# Function to build application
build_application() {
    echo "Building application..."
    npm run build

    if [ $? -ne 0 ]; then
        echo -e "${RED}Build failed. Please check the error messages above.${NC}"
        exit 1
    fi
}

# Function to setup PM2
setup_pm2() {
    echo "Setting up PM2..."
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    pm2 set pm2-logrotate:compress true
}

# Function to configure security
configure_security() {
    echo "Configuring security settings..."

    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    SESSION_SECRET=$(openssl rand -base64 32)
    COOKIE_SECRET=$(openssl rand -base64 32)

    # Update .env file with secrets
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    sed -i "s/COOKIE_SECRET=.*/COOKIE_SECRET=$COOKIE_SECRET/" .env

    echo -e "${GREEN}Security settings configured successfully.${NC}"
}

# Main installation process
echo -e "${BLUE}=== Wick & Wax Co Installation Script ===${NC}\n"

# Run installation steps
check_requirements
setup_environment
install_dependencies
setup_database
build_application
setup_pm2
configure_security

echo -e "\n${GREEN}Installation completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update the .env file with your configuration"
echo "2. Visit http://your-domain/setup to complete the setup wizard"
echo "3. Follow the setup wizard steps:"
echo "   - Store Setup"
echo "   - Admin Account"
echo "   - Database Configuration"
echo "   - Security Settings"
echo -e "\n${RED}Important:${NC}"
echo "1. Make sure to change the default admin password after logging in"
echo "2. Configure your web server (nginx/Apache) to proxy requests to the application"
echo "3. Set up SSL certificates for secure HTTPS connections"
echo "4. Configure regular database backups"
echo "5. Review and adjust security settings as needed"

# Start application with PM2
echo -e "\nWould you like to start the application now? (y/n)"
read -r START_APP

if [ "$START_APP" = "y" ]; then
    echo "Starting application with PM2..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}Application started successfully!${NC}"
    echo "You can monitor the application using: pm2 monit"
fi
