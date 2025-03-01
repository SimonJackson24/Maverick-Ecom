#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting production preparation...${NC}"

# 1. Install required packages
echo -e "\n${YELLOW}Installing required packages...${NC}"
sudo apt update
sudo apt install -y certbot gpg curl

# 2. Install k6
echo -e "\n${YELLOW}Installing k6...${NC}"
if ! command -v k6 &> /dev/null; then
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt update
    sudo apt install -y k6
    echo -e "${GREEN}k6 installed successfully${NC}"
else
    echo -e "${GREEN}k6 is already installed${NC}"
fi

# 3. SSL Certificate setup
echo -e "\n${YELLOW}Setting up SSL certificate...${NC}"
read -p "Do you want to proceed with SSL certificate setup for wickwaxandrelax.co.uk? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot certonly --standalone -d wickwaxandrelax.co.uk -d www.wickwaxandrelax.co.uk
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SSL certificate installed successfully${NC}"
    else
        echo -e "${RED}SSL certificate installation failed${NC}"
        exit 1
    fi
fi

# 4. Content Verification
echo -e "\n${YELLOW}Running content verification...${NC}"
npm run verify-content
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Content verification passed${NC}"
else
    echo -e "${RED}Content verification failed. Please check the output above${NC}"
fi

# 5. Load Testing
echo -e "\n${YELLOW}Running load tests...${NC}"
k6 run tests/load/k6-config.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Load tests completed successfully${NC}"
else
    echo -e "${RED}Load tests failed. Please check the output above${NC}"
fi

echo -e "\n${GREEN}Production preparation completed!${NC}"
echo -e "Please review any warnings or errors above before proceeding with deployment."
