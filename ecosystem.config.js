module.exports = {
  apps: [{
    name: 'survey-email-server',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: 'membership-mgr@jta-r.jp',
      SENDGRID_FROM_NAME: '全日本トラック協会 女性部会'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};