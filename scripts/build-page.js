import { build } from 'vite';
import { resolve, dirname } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const pagesRoot = resolve(rootDir, 'src/pages');

function listAllPages() {
  const pages = [];
  if (!existsSync(pagesRoot)) return pages;

  for (const cat of readdirSync(pagesRoot, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    const catDir = resolve(pagesRoot, cat.name);
    for (const concept of readdirSync(catDir, { withFileTypes: true })) {
      if (!concept.isDirectory()) continue;
      const htmlPath = resolve(catDir, concept.name, 'index.html');
      if (existsSync(htmlPath)) {
        pages.push({
          category: cat.name,
          concept: concept.name,
          id: `${cat.name}/${concept.name}`,
          dir: resolve(catDir, concept.name),
        });
      }
    }
  }
  return pages;
}

async function run() {
  const target = process.argv[2];
  const launchDateArg = process.argv[3];
  const allPages = listAllPages();

  if (!target) {
    console.error('\n❌ Debes indicar qué página compilar.\n');
    console.error('Uso:');
    console.error('  pnpm build:page <categoria/concepto | concepto | categoria> [YYYY-MM-DDTHH:mm:ss]\n');
    console.error('Páginas disponibles:');
    for (const p of allPages) {
      console.error(`  • ${p.id}  (o simplemente: ${p.concept})`);
    }
    process.exit(1);
  }

  const match = allPages.find(
    (p) =>
      p.id === target ||
      p.concept === target ||
      p.category === target ||
      `${p.category}-${p.concept}` === target
  );

  if (!match) {
    console.error(`\n❌ No se encontró la página "${target}".\n`);
    console.error('Páginas disponibles:');
    for (const p of allPages) {
      console.error(`  • ${p.id}  (${p.concept})`);
    }
    process.exit(1);
  }

  if (launchDateArg) {
    process.env.VITE_LAUNCH_DATE = launchDateArg;
  }

  const outDir = resolve(rootDir, 'dist/standalone', match.category, match.concept);
  console.log(`\n📦 Compilando página individual: ${match.id}`);
  if (process.env.VITE_LAUNCH_DATE) {
    console.log(`⏱️  Fecha objetivo (VITE_LAUNCH_DATE): ${process.env.VITE_LAUNCH_DATE}`);
  }
  console.log(`📂 Salida aislada: dist/standalone/${match.id}/\n`);

  await build({
    configFile: false,
    root: match.dir,
    envDir: rootDir,
    base: './',
    build: {
      outDir,
      emptyOutDir: true,
    },
  });

  console.log(`\n✅ Listo: dist/standalone/${match.id}/index.html (con rutas relativas ./assets/)\n`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
