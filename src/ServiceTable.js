import { createElement as h } from 'react';
import { latencyBuckets, resolveSettings, serviceLabel } from './settings.js';

export function ServiceTable({ services, settings }) {
  const resolved = resolveSettings(settings);
  const buckets = latencyBuckets(services);

  return h(
    'table',
    { className: `dashboard ${resolved.theme}` },
    h(
      'tbody',
      null,
      Object.entries(services).map(([id, service]) =>
        h(
          'tr',
          { key: id, className: buckets[id] },
          h('td', null, serviceLabel({ id, ...service })),
          resolved.columns.latency ? h('td', null, `${service.latencyMs}ms`) : null,
        ),
      ),
    ),
  );
}
