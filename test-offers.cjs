// Run with: node test-offers.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const rows = { innerHTML: '' };
const source = fs.readFileSync(`${__dirname}/app.js`, 'utf8');
vm.runInNewContext(source.split('/* ---------- accordion ---------- */')[0], {
  document: { querySelectorAll: () => [], getElementById: () => rows }
});
const links = [...rows.innerHTML.matchAll(/<a class="row__cta" href="([^"]+)" aria-label="([^"]+)">/g)];
assert.equal(links.length, 9);
assert.equal(links.find(link => link[2] === 'Забрать бонус WINLINE')[1],
  'https://trk.ppdu.ru/click/OI6xwW8r?erid=2SDnjdDRjvV&sub1=fael&siteId=26790');
assert.equal(links.filter(link => link[1] === '#').length, 8);
console.log('Winline link: OK');
