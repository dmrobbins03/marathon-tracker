#!/usr/bin/env node
// Builds dist/index.html: the tracker with data/log.json inlined, so it opens anywhere as one file.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const data = JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'data', 'log.json'), 'utf8'))).replace(/</g, '\\u003c');
const marker = '<!--DATA-->';
if (!html.includes(marker)) throw new Error('data marker missing from index.html');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html.replace(marker, () => `<script>window.__DATA__=${data}</script>`));
console.log('dist/index.html written');
