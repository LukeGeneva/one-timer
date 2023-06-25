import type { Secret } from './Secret';

export interface SecretRepository {
  save: (secret: Secret) => Promise<void>;
  findById: (secretId: string) => Promise<Secret>;
  delete: (secretId: string) => Promise<void>;
}
