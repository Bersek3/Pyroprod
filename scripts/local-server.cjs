const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const version = () => ['index.html', 'css/styles.css', 'js/main.js', 'js/motion.js', 'js/loader.js'].map(file => fs.statSync(path.join(root, file)).mtimeMs).join('-');
const reload = `<script>(()=>{let version;setInterval(async()=>{try{const next=await(await fetch('/__version',{cache:'no-store'})).text();if(version&&next!==version)location.reload();version=next}catch{}},1000)})();</script>`;
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/__version') { res.writeHead(200, { 'Content-Type': 'text/plain' }).end(version()); return; }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (relative !== 'index.html' && !/^(assets|css|js)\//.test(relative)) { res.writeHead(404).end(); return; }
    const filename = await fs.promises.realpath(path.resolve(root, relative));
    const safe = path.relative(root, filename);
    const ext = path.extname(filename).toLowerCase();
    if (safe.startsWith('..') || path.isAbsolute(safe) || !types[ext]) { res.writeHead(404).end(); return; }
    let body = await fs.promises.readFile(filename);
    if (ext === '.html') body = Buffer.from(body.toString('utf8').replace('</body>', reload + '</body>'));
    res.writeHead(200, { 'Content-Type': types[ext], 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404).end('No encontrado'); }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} ya está ocupado. Cierra el servidor anterior o elige otro con PORT.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Pyro local: http://127.0.0.1:${port}\nLos cambios se actualizan al guardar. Ctrl+C para detener. Solo accesible desde este equipo.`));
