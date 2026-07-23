const { spawn } = require('child_process');

const port = process.env.PORT || 10000;
console.log(`🚀 Starting ShopNest Next.js production server on port ${port}...`);

const child = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.error('Failed to start Next.js process:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});
