import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for local development.
// The proxy allows frontend requests to /api/* to be forwarded to the backend.
export default ({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: env.VITE_TARGET,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const cookies = proxyRes.headers['set-cookie'];

              if (!cookies) {
                return;
              }

              const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

              // These rewrites make backend auth cookies work in local development.
              proxyRes.headers['set-cookie'] = cookieArray.map((cookie) =>
                cookie
                  .replace(/; *Secure/gi, '')
                  .replace(/; *SameSite=None/gi, '')
                  .replace(/; *Domain=[^;]+/gi, '')
              );
            });
          },
        },
      },
    },
  });
};