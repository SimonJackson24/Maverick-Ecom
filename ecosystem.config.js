module.exports = {
  apps: [{
    name: 'wickandwax',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development',
      PORT: 4001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4001
    },
    error_file: 'logs/pm2/error.log',
    out_file: 'logs/pm2/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    node_args: '--max-old-space-size=4096',
    time: true,
    min_uptime: '60s',
    max_restarts: 10,
    restart_delay: 4000,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 8000,
    source_map_support: false,
    instance_var: 'INSTANCE_ID',
    increment_var: 'PORT',
    exp_backoff_restart_delay: 100
  }],
  deploy: {
    production: {
      user: 'node',
      host: 'your-production-server',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/wick-and-wax-co.git',
      path: '/var/www/wickandwax',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
