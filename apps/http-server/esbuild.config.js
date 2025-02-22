const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  platform: 'node',
  bundle: true,
  outdir: 'dist',
  loader: {
    '.html': 'text',
  },
  define: {
    'process.env.PACKAGE_JSON_PATH': JSON.stringify('./package.json'),
  },
  external: ['mock-aws-s3', 'aws-sdk', 'nock'],
}).catch(() => process.exit(1));