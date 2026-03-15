import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { v4 } from 'uuid';

export type Secret = {
  id: string;
  key: string;
  encryptedValue: string;
  createdAt: Date;
  initializationVector: string;
};

export function encrypt(value: string): Secret {
  const key = randomBytes(32).toString('hex');
  const iv = Uint8Array.from(randomBytes(16));
  const cipher = createCipheriv('aes-256-cbc', new Uint8Array(Buffer.from(key, 'hex')), iv);
  const encrypted = Buffer.concat([
    Uint8Array.from(cipher.update(value, 'utf8')),
    Uint8Array.from(cipher.final()),
  ]);
  return {
    id: v4(),
    key,
    initializationVector: Buffer.from(iv).toString('hex'),
    encryptedValue: encrypted.toString('hex'),
    createdAt: new Date(),
  };
}

export function decrypt(secret: Secret): string {
  const iv = Uint8Array.from(Buffer.from(secret.initializationVector, 'hex'));
  const decipher = createDecipheriv('aes-256-cbc', new Uint8Array(Buffer.from(secret.key, 'hex')), iv);
  const decrypted = Buffer.concat([
    Uint8Array.from(
      decipher.update(
        Uint8Array.from(Buffer.from(secret.encryptedValue, 'hex'))
      )
    ),
    Uint8Array.from(decipher.final()),
  ]);
  return decrypted.toString('utf8');
}
