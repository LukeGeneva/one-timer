import { Secret } from '../entities/Secret';
import type { SecretRepository } from '../entities/SecretRepository';

export class CreateOneTimeSecret {
  constructor(
    private secretRepository: SecretRepository,
    private encryptionKey: string
  ) {}

  execute = async (text: string) => {
    const secret = new Secret(this.encryptionKey);
    secret.encrypt(text);
    await this.secretRepository.save(secret);
    return secret.id;
  };
}
