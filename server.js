#!/usr/bin/env node
// Zero-dependency local server. Serves the tracker and lets the form write to data/log.json.
//   node server.js   ->  http://localhost:4173
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data', 'log.json');
const PORT = process.env.PORT || 4173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css' };

const read = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
const write = (d) => fs.writeFileSync(DATA, JSON.stringify(d, null, 2) + '\n');
const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

function validRun(r) {
  if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(r.date || '')) return 'date must be YYYY-MM-DD';
  if (!Array.isArray(r.segments) || !r.segments.length) return 'at least one segment is required';
  for (const s of r.segments) {
    if (!['run', 'walk'].includes(s.type)) return 'segment type must be run or walk';
    if (!(Number(s.miles) > 0)) return 'segment miles must be greater than 0';
  }
  return null;
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/ping') return send(res, 200, { ok: true });

  if (url.pathname === '/api/runs' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const run = JSON.parse(body);
        const err = validRun(run);
        if (err) return send(res, 400, { error: err });
        const data = read();
        let id = run.date, n = 2;
        while (data.runs.some((x) => x.id === id)) id = `${run.date}-${n++}`;
        run.id = id;
        data.runs.push(run);
        data.runs.sort((a, b) => a.date.localeCompare(b.date));
        for (const b of run.body || []) if (!data.bodyAreas.includes(b.area)) data.bodyAreas.push(b.area);
        data.meta.updated = new Date().toISOString().slice(0, 10);
        write(data);
        send(res, 200, data);
      } catch (e) { send(res, 400, { error: 'invalid JSON' }); }
    });
    return;
  }

  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  const file = path.resolve(ROOT, rel);
  const allowed = file === path.join(ROOT, 'index.html') || file === DATA;
  if (!allowed || !fs.existsSync(file)) return send(res, 404, 'Not found', 'text/plain');
  send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
}).listen(PORT, () => console.log(`Half marathon tracker: http://localhost:${PORT}`));
