import assert from 'node:assert/strict';
import test from 'node:test';
import { latencyBuckets, resolveSettings } from '../../src/settings.js';

test('resolveSettings must not let a constructor.prototype payload in stored settings reach Object.prototype', () => {
  try {
    resolveSettings(JSON.parse('{"constructor":{"prototype":{"wdSecTopLevel":"PWN"}}}'));
    assert.equal({}.wdSecTopLevel, undefined);
  } finally {
    delete Object.prototype.wdSecTopLevel;
  }
});

test('resolveSettings must not let a constructor.prototype payload nested under columns reach Object.prototype', () => {
  try {
    resolveSettings(JSON.parse('{"columns":{"constructor":{"prototype":{"wdSecNested":"PWN"}}}}'));
    assert.equal({}.wdSecNested, undefined);
  } finally {
    delete Object.prototype.wdSecNested;
  }
});

test('resolveSettings must not let a __proto__ payload in stored settings reach Object.prototype', () => {
  try {
    resolveSettings(JSON.parse('{"__proto__":{"wdSecProtoKey":"PWN"}}'));
    assert.equal({}.wdSecProtoKey, undefined);
  } finally {
    delete Object.prototype.wdSecProtoKey;
  }
});

test('latencyBuckets must not let a __proto__ service id reach Object.prototype', () => {
  try {
    latencyBuckets(JSON.parse('{"__proto__":{"latencyMs":999,"wdSecBucket":"PWN"}}'));
    assert.equal({}.wdSecBucket, undefined);
  } finally {
    delete Object.prototype.wdSecBucket;
  }
});
