import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { ServiceTable } from './ServiceTable.js';

const services = {
  orders: { display: { name: 'Orders API' }, latencyMs: 120 },
  billing: { latencyMs: 480 },
};

const container = typeof document === 'undefined' ? null : document.getElementById('root');
if (container) {
  createRoot(container).render(h(ServiceTable, { services, settings: { theme: 'dark' } }));
}
