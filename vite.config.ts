import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

const rootDir = import.meta.dirname || '.';
const localConfigPath = path.resolve(rootDir, 'firebase-applet-config.json');
const defaultConfigPath = path.resolve(rootDir, 'src/firebase-config-default.json');
const hasLocalConfig = fs.existsSync(localConfigPath);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/locked-in.-beta-website-for-creators/',
  resolve: {
    alias: {
      '@': path.resolve(rootDir, '.'),
      '@firebase-config': hasLocalConfig ? localConfigPath : defaultConfigPath,
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
