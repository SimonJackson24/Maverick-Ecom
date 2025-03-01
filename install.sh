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
    NODE_VERSION="18.19.1"
    
    # Create local directories
    mkdir -p "$HOME/.local/node"
    mkdir -p "$HOME/.local/bin"
    mkdir -p "$HOME/.npm"
    
    # Download and install Node.js if not found
    if ! command_exists node; then
        echo "Installing Node.js locally..."
        cd /tmp
        wget "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
        tar -xf "node-v${NODE_VERSION}-linux-x64.tar.xz"
        cp -r "node-v${NODE_VERSION}-linux-x64"/* "$HOME/.local/node/"
        rm -rf "node-v${NODE_VERSION}-linux-x64"*
        cd - > /dev/null
    fi

    # Set up environment variables
    export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
    export NPM_CONFIG_PREFIX="$HOME/.local"
    export NPM_CONFIG_CACHE="$HOME/.npm"
    
    # Create symlinks
    ln -sf "$HOME/.local/node/bin/node" "$HOME/.local/bin/node"
    ln -sf "$HOME/.local/node/bin/npm" "$HOME/.local/bin/npm"
    ln -sf "$HOME/.local/node/bin/npx" "$HOME/.local/bin/npx"
    
    # Add environment variables to shell config files
    for rcfile in "$HOME/.profile" "$HOME/.bashrc"; do
        if [ -f "$rcfile" ]; then
            {
                echo 'export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"'
                echo 'export NPM_CONFIG_PREFIX="$HOME/.local"'
                echo 'export NPM_CONFIG_CACHE="$HOME/.npm"'
            } >> "$rcfile"
        fi
    done

    # Source the profile to get npm working in current session
    if [ -f "$HOME/.profile" ]; then
        source "$HOME/.profile"
    fi
    
    # Verify installation
    if command_exists node; then
        NODE_CURRENT_VERSION=$(node -v)
        echo -e "${GREEN}Node.js ${NODE_CURRENT_VERSION} has been set up successfully${NC}"
    else
        echo -e "${RED}Node.js installation failed${NC}"
        exit 1
    fi
    
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        echo -e "${GREEN}npm ${NPM_VERSION} has been set up successfully${NC}"
    else
        echo -e "${RED}npm installation failed${NC}"
        exit 1
    fi
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
    
    # Ensure environment is set up
    export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
    export NPM_CONFIG_PREFIX="$HOME/.local"
    export NPM_CONFIG_CACHE="$HOME/.npm"
    
    # Install project dependencies including PM2 locally
    echo "Installing project dependencies..."
    "$HOME/.local/bin/npm" install --no-optional
    "$HOME/.local/bin/npm" install pm2 typescript ts-node --save-dev
    
    # Create PM2 startup script
    echo "Creating PM2 startup script..."
    cat > start.sh << 'EOL'
#!/bin/bash
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
export NPM_CONFIG_PREFIX="$HOME/.local"
export NPM_CONFIG_CACHE="$HOME/.npm"
NODE_ENV=production ./node_modules/.bin/pm2 start ecosystem.config.js --env production
EOL
    chmod +x start.sh
    
    # Create convenience scripts
    echo "Creating convenience scripts..."
    cat > pm2.sh << 'EOL'
#!/bin/bash
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
export NPM_CONFIG_PREFIX="$HOME/.local"
export NPM_CONFIG_CACHE="$HOME/.npm"
./node_modules/.bin/pm2 "$@"
EOL
    chmod +x pm2.sh
}

# Main installation process
echo -e "${BLUE}=== Wick & Wax Co Installation Script ===${NC}\n"

# Run installation steps
check_requirements
setup_environment
install_dependencies

echo -e "\n${GREEN}Installation completed!${NC}"
echo -e "${BLUE}Starting application...${NC}"

# Start application with local PM2
./start.sh

echo -e "\n${GREEN}Application is now running!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Set up your domain in Hestia Control Panel"
echo "2. Configure SSL certificate (if not already done)"
echo "3. Visit https://your-domain/setup to complete the setup wizard"
echo "4. Monitor the application using: ./pm2.sh monit"

# Create a helpful alias for quick management
if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q "alias wickwax=" "$HOME/.bashrc"; then
        echo "alias wickwax='./pm2.sh monit'" >> "$HOME/.bashrc"
    fi
fi

echo -e "\n${GREEN}Installation complete! Your store is ready to go!${NC}"
echo -e "${BLUE}To manage your application, use:${NC}"
echo "- Start: ./start.sh"
echo "- Monitor: ./pm2.sh monit"
echo "- Stop: ./pm2.sh stop all"
echo "- Logs: ./pm2.sh logs"
echo "- Status: ./pm2.sh list"
