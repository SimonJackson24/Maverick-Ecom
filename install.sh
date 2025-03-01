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

# Function to detect Hestia database credentials
detect_hestia_credentials() {
    echo "Detecting Hestia database credentials..."
    
    # Try to find the database configuration file
    HESTIA_CONF_DIR="/home/admin/conf/web"
    if [ -d "$HESTIA_CONF_DIR" ]; then
        # Get the domain name from current directory
        DOMAIN=$(pwd | grep -o '[^/]*.co.uk\|[^/]*.com\|[^/]*.net\|[^/]*.org' || echo "")
        if [ -n "$DOMAIN" ]; then
            echo "Detected domain: $DOMAIN"
            DB_CONF_FILE="$HESTIA_CONF_DIR/$DOMAIN/pgsql.conf"
            if [ -f "$DB_CONF_FILE" ]; then
                DB_USER=$(grep "DB_USER" "$DB_CONF_FILE" | cut -d"'" -f2)
                DB_PASSWORD=$(grep "DB_PASSWORD" "$DB_CONF_FILE" | cut -d"'" -f2)
                DB_NAME=$(grep "DB_NAME" "$DB_CONF_FILE" | cut -d"'" -f2)
                
                if [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ] && [ -n "$DB_NAME" ]; then
                    echo -e "${GREEN}Found database credentials in Hestia configuration${NC}"
                    DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
                    echo "DATABASE_URL=$DATABASE_URL" >> .env
                    return 0
                fi
            fi
        fi
    fi
    
    echo -e "${RED}Could not automatically detect Hestia database credentials${NC}"
    return 1
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
        echo -e "${BLUE}Node.js not found. Installing Node.js 18...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2)
    if (( $(echo "$NODE_VERSION 18.0.0" | awk '{print ($1 < $2)}') )); then
        echo -e "${RED}Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION${NC}"
        exit 1
    fi

    # Check PostgreSQL
    if ! command_exists psql; then
        echo -e "${BLUE}PostgreSQL not found. Installing PostgreSQL...${NC}"
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
    fi

    # Check if required ports are available
    if ! command_exists netstat; then
        sudo apt-get install -y net-tools
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

    # Create necessary directories with proper permissions
    mkdir -p logs/pm2 public/uploads backups
    chmod 755 logs public/uploads backups

    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
        
        # Generate random secrets
        JWT_SECRET=$(openssl rand -base64 32)
        SESSION_SECRET=$(openssl rand -base64 32)
        COOKIE_SECRET=$(openssl rand -base64 32)
        
        # Update .env with secure secrets
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
        sed -i "s/COOKIE_SECRET=.*/COOKIE_SECRET=$COOKIE_SECRET/" .env
        
        # Try to detect and set Hestia database credentials
        detect_hestia_credentials
        
        echo -e "${GREEN}Created and configured .env file${NC}"
    fi
}

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies..."
    
    # Install global dependencies first
    echo "Installing global dependencies..."
    sudo npm install -g pm2 typescript ts-node
    
    # Install project dependencies
    npm install --no-optional
    
    # Setup PM2 with logrotate
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    pm2 set pm2-logrotate:compress true
}

# Function to setup database
setup_database() {
    echo "Setting up database..."

    # Source the .env file to get DATABASE_URL
    if [ -f .env ]; then
        source .env
    fi

    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}DATABASE_URL environment variable is not set.${NC}"
        echo "Please check your Hestia Control Panel > Web > Databases for credentials"
        echo "Format: postgresql://DB_USER:DB_PASSWORD@localhost:5432/DB_NAME"
        exit 1
    fi

    # Generate Prisma client and run migrations
    echo "Generating Prisma client..."
    npx prisma generate
    
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

# Main installation process
echo -e "${BLUE}=== Wick & Wax Co Installation Script ===${NC}\n"

# Run installation steps
check_requirements
setup_environment
install_dependencies
setup_database
build_application

echo -e "\n${GREEN}Installation completed successfully!${NC}"
echo -e "${BLUE}Starting application...${NC}"

# Start application with PM2
pm2 start ecosystem.config.js --env production
pm2 save

echo -e "\n${GREEN}Application is now running!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Set up your domain in Hestia Control Panel"
echo "2. Configure SSL certificate (if not already done)"
echo "3. Visit https://your-domain/setup to complete the setup wizard"
echo "4. Monitor the application using: pm2 monit"
echo -e "\n${RED}Important Security Notes:${NC}"
echo "1. Change the default admin password after logging in"
echo "2. Regularly backup your database"
echo "3. Keep your .env file secure"

# Create a helpful alias for quick management
echo "alias wickwax='pm2 monit wickwax'" >> ~/.bashrc
source ~/.bashrc

echo -e "\n${GREEN}Installation complete! Your store is ready to go!${NC}"
