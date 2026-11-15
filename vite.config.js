import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';

function getPageEntries() {
  const entries = {
    main: resolve(__dirname, 'index.html'),
  };

  const pagesRoot = resolve(__dirname, 'src/pages');
  if (!existsSync(pagesRoot)) return entries;

  for (const category of readdirSync(pagesRoot, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    const categoryDir = resolve(pagesRoot, category.name);
    for (const concept of readdirSync(categoryDir, { withFileTypes: true })) {
      if (!concept.isDirectory()) continue;
      const htmlPath = resolve(categoryDir, concept.name, 'index.html');
      if (existsSync(htmlPath)) {
        entries[`${category.name}-${concept.name}`] = htmlPath;
      }
    }
  }

  return entries;
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: getPageEntries(),
    },
  },
});
