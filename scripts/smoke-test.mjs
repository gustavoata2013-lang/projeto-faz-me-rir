// Verificação rápida de sanidade, sem navegador: roda após cada edição do Aider.
// Garante que nenhum .js ficou com erro de sintaxe e que as páginas referenciam
// apenas arquivos JS que existem de fato.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
let failed = false;

function findFiles(dir, ext) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) continue;
    if (entry.name.endsWith(ext)) out.push(path.join(dir, entry.name));
  }
  return out;
}

// 1. Sintaxe de todos os .js (raiz + js/)
const jsFiles = [
  path.join(root, 'script.js'),
  ...findFiles(path.join(root, 'js'), '.js'),
];
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failed = true;
    console.error(`[sintaxe] ${path.relative(root, file)}:\n${err.stderr?.toString() || err.message}`);
  }
}

// 2. Toda página HTML só referencia <script src="..."> que existe no disco
const htmlFiles = [
  path.join(root, 'index.html'),
  ...findFiles(path.join(root, 'pages'), '.html'),
];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)) {
    const src = m[1];
    if (/^https?:\/\//.test(src)) continue;
    const resolved = path.join(dir, src);
    if (!existsSync(resolved)) {
      failed = true;
      console.error(`[script ausente] ${path.relative(root, file)} referencia "${src}", mas ${path.relative(root, resolved)} não existe.`);
    }
  }
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/g)) {
    const href = m[1];
    if (/^https?:\/\//.test(href)) continue;
    const resolved = path.join(dir, href);
    if (!existsSync(resolved)) {
      failed = true;
      console.error(`[css ausente] ${path.relative(root, file)} referencia "${href}", mas ${path.relative(root, resolved)} não existe.`);
    }
  }
}

if (failed) {
  console.error('\nsmoke-test: FALHOU');
  process.exit(1);
} else {
  console.log(`smoke-test: OK (${jsFiles.length} arquivos JS, ${htmlFiles.length} páginas HTML)`);
}
