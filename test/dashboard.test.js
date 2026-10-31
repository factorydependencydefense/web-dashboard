import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServiceTable } from '../src/ServiceTable.js';
import { latencyBuckets, resolveSettings, serviceLabel } from '../src/settings.js';

const services = {
  orders: { display: { name: 'Orders API' }, latencyMs: 120 },
  billing: { latencyMs: 480 },
};

test('resolveSettings deep merges stored settings', () => {
  const settings = resolveSettings({ theme: 'dark', columns: { latency: true } });
  assert.equal(settings.theme, 'dark');
  assert.equal(settings.refreshSeconds, 30);
  assert.equal(settings.columns.latency, true);
  assert.equal(settings.columns.name, true);
});

test('serviceLabel falls back to the id', () => {
  assert.equal(serviceLabel({ id: 'billing' }), 'billing');
  assert.equal(serviceLabel({ id: 'orders', display: { name: 'Orders API' } }), 'Orders API');
});

test('latencyBuckets marks slow services', () => {
  assert.deepEqual(latencyBuckets(services), { orders: 'ok', billing: 'slow' });
});

test('ServiceTable renders a row per service', () => {
  const html = renderToStaticMarkup(h(ServiceTable, { services, settings: {} }));
  assert.match(html, /Orders API/);
  assert.match(html, /class="dashboard light"/);
  assert.equal(html.match(/<tr/g).length, 2);
});

test('ServiceTable shows latency only when the column is on', () => {
  const html = renderToStaticMarkup(
    h(ServiceTable, { services, settings: { columns: { latency: true } } }),
  );
  assert.match(html, /480ms/);
});
