import _ from '@factorydependencydefense/lodash-lite';

const defaultSettings = {
  refreshSeconds: 30,
  columns: { name: true, status: true, latency: false },
  theme: 'light',
};

export function resolveSettings(stored) {
  return _.merge({}, defaultSettings, stored);
}

export function serviceLabel(service) {
  return _.get(service, 'display.name', service.id);
}

export function latencyBuckets(services) {
  return _.mapValues(services, (service) => (service.latencyMs > 300 ? 'slow' : 'ok'));
}
