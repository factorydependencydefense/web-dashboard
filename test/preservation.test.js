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

test('resolveSettings returns the whole resolved settings object', () => {
  assert.deepEqual(resolveSettings({ theme: 'dark', columns: { latency: true } }), {
    refreshSeconds: 30,
    columns: { name: true, status: true, latency: true },
    theme: 'dark',
  });
});

test('resolveSettings does not let one call leak into the next', () => {
  resolveSettings({ theme: 'dark', refreshSeconds: 5, columns: { latency: true, name: false } });
  assert.deepEqual(resolveSettings({}), {
    refreshSeconds: 30,
    columns: { name: true, status: true, latency: false },
    theme: 'light',
  });
});

test('serviceLabel prefers the display name and falls back to the id', () => {
  assert.equal(serviceLabel({ id: 'billing' }), 'billing');
  assert.equal(serviceLabel({ id: 'orders', display: { name: 'Orders API' } }), 'Orders API');
});

test('latencyBuckets classifies every service', () => {
  assert.deepEqual(latencyBuckets(services), { orders: 'ok', billing: 'slow' });
  assert.deepEqual(latencyBuckets({ a: { latencyMs: 300 }, b: { latencyMs: 301 } }), {
    a: 'ok',
    b: 'slow',
  });
});

test('ServiceTable renders the default theme, one row per service and no latency column', () => {
  const html = renderToStaticMarkup(h(ServiceTable, { services, settings: {} }));
  assert.equal(
    html,
    '<table class="dashboard light"><tbody><tr class="ok"><td>Orders API</td></tr><tr class="slow"><td>billing</td></tr></tbody></table>',
  );
});

test('ServiceTable renders the latency column and stored theme when asked', () => {
  const html = renderToStaticMarkup(
    h(ServiceTable, { services, settings: { theme: 'dark', columns: { latency: true } } }),
  );
  assert.equal(
    html,
    '<table class="dashboard dark"><tbody><tr class="ok"><td>Orders API</td><td>120ms</td></tr><tr class="slow"><td>billing</td><td>480ms</td></tr></tbody></table>',
  );
});
