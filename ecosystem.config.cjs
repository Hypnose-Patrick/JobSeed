module.exports = {
  apps: [
    {
      name: 'jobseed',
      script: 'npx',
      // Utilisation de wrangler pour servir le site ET les fonctions backend
      // --ip 0.0.0.0 --port 3000 rend le site accessible depuis l'extérieur
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000 --compatibility-date=2024-01-01',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false
    }
  ]
};
