import { readFileSync } from 'fs';
import { join } from 'path';

import type { NextConfig } from 'next';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
);

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/llm-leaderboard',
  assetPrefix: '/llm-leaderboard',
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
