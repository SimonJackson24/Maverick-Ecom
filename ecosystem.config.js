module.exports = {
  apps: [{
    name: 'wickandwax',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/pm2/error.log',
    out_file: 'logs/pm2/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    node_args: '--max-old-space-size=2048',
    time: true
  }]
};
