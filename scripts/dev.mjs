// Server pengembangan: build otomatis setiap file src berubah + menyajikan situs di http://localhost:3000
import { context } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 3000;
const common = { bundle: true, sourcemap: true, loader: { '.jsx': 'jsx' }, jsx: 'automatic', target: ['es2020', 'chrome100', 'safari15', 'firefox100'], define: { 'process.env.NODE_ENV': '"development"' }, logLevel: 'info' };
const ctxs = await Promise.all([
  context({ ...common, entryPoints: [path.join(root, 'src/app.jsx')], outfile: path.join(root, 'Asset/dist/app.js') }),
  context({ ...common, entryPoints: [path.join(root, 'src/admin.jsx')], outfile: path.join(root, 'Asset/dist/admin.js') }),
]);
await Promise.all(ctxs.map(c => c.rebuild()));
await Promise.all(ctxs.map(c => c.watch()));

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.map': 'application/json', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  if (p === '/admin') p = '/admin.html';
  const file = path.join(root, path.normalize(p));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const st = await stat(file);
    const target = st.isDirectory() ? path.join(file, 'index.html') : file;
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); }
}).listen(port, () => console.log(`\nSitus   → http://localhost:${port}\nAdmin   → http://localhost:${port}/admin\nSimpan file di src/ lalu refresh browser.\n`));
