import type { Secret } from '../../domain/Secret';
import type { SecretRepository } from '../../domain/SecretRepository';

export class TestSecretRepository implements SecretRepository {
  private _secrets: Map<string, Secret>;
  private _secretCount: number = 0;

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

  delete = async (secretId: string) => {
    this._secrets.delete(secretId);
  };

  async getSecretCount() {
    return this._secretCount;
  }

  async saveSecretCount(count: number) {
    this._secretCount = count;
  }
}
