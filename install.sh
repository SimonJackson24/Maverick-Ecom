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

# Function to setup Node.js environment
setup_nodejs() {
    echo "Setting up Node.js environment..."
    
    # Check if Node.js is available in standard locations
    if [ -d "/opt/node-v18" ]; then
        echo "Found Node.js in /opt/node-v18"
        export PATH="/opt/node-v18/bin:$PATH"
    elif [ -d "$HOME/.local/node-v18" ]; then
        echo "Found Node.js in ~/.local/node-v18"
        export PATH="$HOME/.local/node-v18/bin:$PATH"
    elif [ -d "/opt/cpanel/ea-nodejs18" ]; then
        echo "Found Node.js in cPanel location"
        export PATH="/opt/cpanel/ea-nodejs18/bin:$PATH"
    fi

    # If Node.js still not found, try to install locally
    if ! command_exists node; then
        echo "Installing Node.js locally..."
        mkdir -p "$HOME/.local/node-v18"
        cd /tmp
        wget https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz
        tar -xf node-v18.18.0-linux-x64.tar.xz
        cp -r node-v18.18.0-linux-x64/* "$HOME/.local/node-v18/"
        cd - > /dev/null
        export PATH="$HOME/.local/node-v18/bin:$PATH"
    fi

    # Configure npm to use local directories
    mkdir -p "$HOME/.npm-global"
    npm config set prefix "$HOME/.npm-global"
    export PATH="$HOME/.npm-global/bin:$PATH"

    # Add paths to .profile if they don't exist
    if [ -f "$HOME/.profile" ]; then
        if ! grep -q "PATH.*node-v18" "$HOME/.profile"; then
            echo 'export PATH="$HOME/.local/node-v18/bin:$PATH"' >> "$HOME/.profile"
        fi
        if ! grep -q "PATH.*npm-global" "$HOME/.profile"; then
            echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> "$HOME/.profile"
        fi
    fi

    # Verify Node.js installation
    if ! command_exists node; then
        echo -e "${RED}Node.js setup failed. Please contact your hosting provider for assistance.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Node.js $(node -v) has been set up successfully${NC}"
}

# Function to detect Hestia database credentials
detect_hestia_credentials() {
    echo "Detecting Hestia database credentials..."
    
    # Try to find the database configuration file
    DB_CONF_FILE="$HOME/conf/web/$USER/pgsql.conf"
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
    
    echo -e "${RED}Could not automatically detect Hestia database credentials${NC}"
    return 1
}

# Function to check requirements
check_requirements() {
    echo "Checking system requirements..."
    
    # Check if running in PuTTY/SSH
    if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
        echo "Running in SSH/PuTTY environment..."
        export TERM=xterm-256color
    fi

    # Setup Node.js environment
    setup_nodejs

    # Check port 4001 using alternative methods
    echo "Checking port 4001..."
    if command_exists lsof; then
        if lsof -i :4001; then
            echo -e "${RED}Port 4001 is already in use${NC}"
            exit 1
        fi
    elif command_exists ss; then
        if ss -ln | grep :4001; then
            echo -e "${RED}Port 4001 is already in use${NC}"
            exit 1
        fi
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
    
    # Install project dependencies
    npm install --no-optional
    
    # Install global dependencies to user directory
    echo "Installing global dependencies..."
    npm install -g pm2 typescript ts-node
    
    # Setup PM2 with logrotate
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    pm2 set pm2-logrotate:compress true
}

# Main installation process
echo -e "${BLUE}=== Wick & Wax Co Installation Script ===${NC}\n"

# Run installation steps
check_requirements
setup_environment
install_dependencies

echo -e "\n${GREEN}Installation completed!${NC}"
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

# Create a helpful alias for quick management
if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q "alias wickwax=" "$HOME/.bashrc"; then
        echo "alias wickwax='pm2 monit wickwax'" >> "$HOME/.bashrc"
    fi
fi

echo -e "\n${GREEN}Installation complete! Your store is ready to go!${NC}"
