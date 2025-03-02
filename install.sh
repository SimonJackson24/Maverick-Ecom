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
    mkdir -p "$HOME/.local"
    mkdir -p "$HOME/.npm"
    
    # Download and extract Node.js
    echo "Downloading Node.js..."
    cd /tmp
    wget "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz"
    
    echo "Extracting Node.js to $HOME/.local..."
    tar -xzf "node-v${NODE_VERSION}-linux-x64.tar.gz"
    cp -rf "node-v${NODE_VERSION}-linux-x64"/* "$HOME/.local/"
    rm -rf "node-v${NODE_VERSION}-linux-x64"*
    cd - > /dev/null
    
    # Set up environment variables
    export PATH="$HOME/.local/bin:$PATH"
    export NPM_CONFIG_PREFIX="$HOME/.local"
    export NPM_CONFIG_CACHE="$HOME/.npm"
    
    # Add environment variables to shell config files
    for rcfile in "$HOME/.profile" "$HOME/.bashrc"; do
        if [ -f "$rcfile" ]; then
            if ! grep -q "NPM_CONFIG_PREFIX" "$rcfile"; then
                echo "" >> "$rcfile"
                echo "# Node.js environment" >> "$rcfile"
                echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$rcfile"
                echo "export NPM_CONFIG_PREFIX=\"\$HOME/.local\"" >> "$rcfile"
                echo "export NPM_CONFIG_CACHE=\"\$HOME/.npm\"" >> "$rcfile"
            fi
        fi
    done
    
    # Source the profile
    source "$HOME/.profile"
    
    # Verify Node.js installation
    if command_exists node; then
        NODE_CURRENT_VERSION=$(node -v)
        echo -e "${GREEN}Node.js ${NODE_CURRENT_VERSION} has been set up successfully${NC}"
    else
        echo -e "${RED}Node.js installation failed${NC}"
        exit 1
    fi
    
    # Verify npm installation
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        echo -e "${GREEN}npm ${NPM_VERSION} has been set up successfully${NC}"
        
        # Configure npm
        npm config set prefix "$HOME/.local"
        npm config set cache "$HOME/.npm"
    else
        echo -e "${RED}npm installation failed${NC}"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies..."
    
    # Ensure environment is set up
    export PATH="$HOME/.local/bin:$PATH"
    export NPM_CONFIG_PREFIX="$HOME/.local"
    export NPM_CONFIG_CACHE="$HOME/.npm"
    
    # Install project dependencies including PM2 locally
    echo "Installing dependencies..."
    export NODE_ENV=production
    
    # First install dev dependencies needed for build
    echo "Installing build dependencies..."
    npm install --save-dev typescript ts-node vite @vitejs/plugin-react pm2
    
    # Then install production dependencies
    echo "Installing production dependencies..."
    npm install --production --no-optional
    
    # Remove husky for production
    npm uninstall husky
    
    # Build the project
    echo "Building the project..."
    echo "Building server..."
    ./node_modules/.bin/tsc -p tsconfig.server.json --skipLibCheck
    
    echo "Building client..."
    ./node_modules/.bin/vite build
    
    # Create PM2 startup script
    echo "Creating PM2 startup script..."
    cat > start.sh << 'EOL'
#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
export NPM_CONFIG_PREFIX="$HOME/.local"
export NPM_CONFIG_CACHE="$HOME/.npm"
./node_modules/.bin/pm2 start ecosystem.config.cjs --env production
EOL
    chmod +x start.sh
    
    # Create convenience scripts
    echo "Creating convenience scripts..."
    cat > pm2.sh << 'EOL'
#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
export NPM_CONFIG_PREFIX="$HOME/.local"
export NPM_CONFIG_CACHE="$HOME/.npm"
./node_modules/.bin/pm2 "$@"
EOL
    chmod +x pm2.sh
}

# Main installation process
echo "=== Wick & Wax Co Installation Script ==="
echo ""

# Check if running in SSH
if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
    echo "Running in SSH/PuTTY environment..."
else
    echo "Warning: Not running in SSH environment"
fi

# Setup Node.js
setup_nodejs

# Check port 4001
echo "Checking port 4001..."
if ! command_exists lsof; then
    echo "Warning: lsof not available, skipping port check"
else
    if lsof -i:4001 > /dev/null; then
        echo -e "${RED}Port 4001 is already in use${NC}"
        exit 1
    fi
fi

# Set up environment
echo "Setting up environment..."
install_dependencies

echo ""
echo "Installation completed!"
echo "Starting application..."
./start.sh

echo ""
echo "Application is now running!"
echo "Next steps:"
echo "1. Set up your domain in Hestia Control Panel"
echo "2. Configure SSL certificate (if not already done)"
echo "3. Visit https://your-domain/setup to complete the setup wizard"
echo "4. Monitor the application using: ./pm2.sh monit"
echo ""
echo "Installation complete! Your store is ready to go!"
echo "To manage your application, use:"
echo "- Start: ./start.sh"
echo "- Monitor: ./pm2.sh monit"
echo "- Stop: ./pm2.sh stop all"
echo "- Logs: ./pm2.sh logs"
echo "- Status: ./pm2.sh list"
