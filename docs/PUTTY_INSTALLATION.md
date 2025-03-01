# Installing Wick & Wax Co via PuTTY

This guide will help you install Wick & Wax Co on your server using PuTTY.

## Prerequisites

1. A server running Linux (Ubuntu/Debian recommended)
2. PuTTY installed on your local machine
3. SSH access to your server
4. Node.js 18 or higher installed on the server
5. PostgreSQL database server

## PuTTY Configuration

1. Open PuTTY
2. Configure the following settings:
   - Session > Host Name: Your server's IP or domain
   - Session > Port: 22 (default SSH port)
   - Connection > Data > Terminal-type string: xterm-256color
   - Window > Translation > Remote character set: UTF-8
3. Save these settings for future use

## Installation Steps

1. Connect to your server using PuTTY

2. Install Node.js if not already installed:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone the repository:
   ```bash
   git clone https://github.com/your-org/wick-and-wax-co.git
   cd wick-and-wax-co
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Update the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PORT`: The port to run the application (default: 3000)
   - Other relevant environment variables

5. Run the installation script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

6. Follow the setup wizard:
   - Visit `http://your-domain/setup` in your browser
   - Follow the steps to configure:
     1. Database connection
     2. Admin account
     3. Company information
     4. Other settings

## Production Deployment

For production deployment, it's recommended to:

1. Set up a process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start npm --name "wickandwax" -- start
   pm2 save
   ```

2. Configure Nginx as a reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Set up SSL with Let's Encrypt:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Troubleshooting

1. If you see garbled characters in PuTTY:
   - Verify your PuTTY character encoding settings
   - Make sure `TERM` is set to `xterm-256color`

2. If the installation script fails:
   - Check the Node.js version: `node -v`
   - Verify database connection
   - Check file permissions
   - Review error logs in `logs/error.log`

3. If the setup wizard is not accessible:
   - Check if the server is running: `pm2 status`
   - Verify Nginx configuration
   - Check firewall settings

## Support

If you encounter any issues during installation, please:

1. Check the logs: `tail -f logs/error.log`
2. Review the troubleshooting section above
3. Open an issue on our GitHub repository
4. Contact support at support@wickandwax.co

## Security Notes

1. Change the default admin password immediately after installation
2. Keep your system and Node.js updated
3. Use strong passwords for all accounts
4. Configure firewall rules appropriately
5. Regularly backup your database
