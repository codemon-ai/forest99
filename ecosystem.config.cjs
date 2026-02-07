module.exports = {
  apps: [
    {
      name: 'forest99-dev',
      script: 'npm',
      args: 'run dev -- --host',
      cwd: '/Users/coffeemon/workspace/codemon/forest99',
      watch: false,
    },
    {
      name: 'forest99-ngrok',
      script: 'ngrok',
      args: 'http 5173 --domain forest99.ngrok.app',
      cwd: '/Users/coffeemon/workspace/codemon/forest99',
      watch: false,
    },
  ],
};
