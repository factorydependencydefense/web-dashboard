# web-dashboard

React dashboard for fleet service health. Part of the dependency-defense demo fleet.

```bash
npm ci
npm test
npm run build
```

## Tests

`npm test` runs `test/*.test.js`: `test/dashboard.test.js` plus `test/preservation.test.js`, which pin
the whole resolved settings object and the exact rendered markup of `ServiceTable` for legitimate
inputs. They must stay green across a lodash upgrade, so a remediation PR can use them as proof it
changed no behaviour.

There is no characterization suite here, because no vulnerable behaviour is observable through this
package's API (see below).

`npm run test:security` runs `test/security/**/*.test.js` and is deliberately **not** part of
`npm test`. It asserts that untrusted stored settings and service ids cannot reach `Object.prototype`.

All 4 security tests are **green today**. `resolveSettings` calls `_.merge({}, defaultSettings, stored)`,
and the pinned lodash only walks into `Object.prototype` through a `constructor.prototype` payload when
the untrusted source is the *first* source. Here it is the second, so the payload is contained as an
own `constructor` key on the result instead. The advisory is real for the pinned lodash version but is
not reachable through this API; these tests exist to document the invariant and catch a regression if
the call shape changes.

What these tests do **not** cover: the browser entrypoint `src/main.js` and the bundled
`dist/bundle.js`, the planted unused dependencies (`jquery`, `moment`), client-side DOM behaviour,
dynamic imports, and any network path.
