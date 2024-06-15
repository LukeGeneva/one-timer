import { Secret } from './Secret';

const KEY = 'abcdefghijklmnopqrstuvwxyz012345';

test('that secret is encrypted/decrypted', () => {
  const secret = new Secret(KEY);
  secret.encrypt('test');
  expect(secret.encryptedValue).not.toBe('test');
  expect(secret.decrypt()).toBe('test');
});

test('that invalid keys throw', () => {
  expect(() => new Secret('not-32-bytes')).toThrow();
});

test('that hydrated secret works', () => {
  const secret = new Secret(KEY);
  secret.encrypt('test');

  const hydratedSecret = Secret.__hydrate({
    id: secret.id,
    key: KEY,
    encryptedValue: secret.encryptedValue,
    createdAt: secret.createdAt,
    initializationVector: secret.initializationVector,
  });
  expect(hydratedSecret.decrypt()).toBe('test');
});
