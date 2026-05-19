import type {NextConfig} from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDev ? '.next' : '.next_build',
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
    // Allow access to remote image placeholder.
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',
          pathname: '/**', // This allows any path under the hostname
        },
      ],
    },
    transpilePackages: ['motion'],
    webpack: (config, {dev}) => {
      // Disable webpack cache to avoid file locking conflict with the dev server
      config.cache = false;
      
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      if (dev && process.env.DISABLE_HMR === 'true') {
        config.watchOptions = {
          ignored: /.*/,
        };
      }
      return config;
    },
  };
}
