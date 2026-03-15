import { test, expect } from 'bun:test';
import { encrypt, decrypt } from './secret';

const KEY = 'abcdefghijklmnopqrstuvwxyz012345';

test('that secret is encrypted/decrypted', () => {
  const secret = encrypt('test', KEY);
  expect(secret.encryptedValue).not.toBe('test');
  expect(decrypt(secret)).toBe('test');
});

test('that invalid keys throw', () => {
  expect(() => encrypt('test', 'not-32-bytes')).toThrow();
});
