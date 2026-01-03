import { readFileSync } from 'fs';
import { join } from 'path';

import type { NextConfig } from 'next';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
);

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

const developmentConfig: NextConfig = {};

const productionConfig: NextConfig = {
  basePath: '/llm-leaderboard',
  assetPrefix: '/llm-leaderboard',
};

const nextConfig: NextConfig = {
  ...baseConfig,
  ...(isProduction ? productionConfig : developmentConfig),
};

export default nextConfig;
