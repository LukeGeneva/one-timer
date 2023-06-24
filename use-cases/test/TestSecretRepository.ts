import type { Secret } from '../../entities/Secret';
import type { SecretRepository } from '../../entities/SecretRepository';

export class TestSecretRepository implements SecretRepository {
  private _secrets: Map<string, Secret>;

  constructor() {
    this._secrets = new Map();
  }

  save = async (secret: Secret) => {
    this._secrets.set(secret.id, secret);
  };

  findById = async (secretId: string) => {
    const secret = this._secrets.get(secretId);
    if (!secret) throw new Error(`No secret found with ID ${secretId}`);
    return secret;
  };
}
