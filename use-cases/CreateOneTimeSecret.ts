import { Secret } from '../domain/Secret';
import type { SecretRepository } from '../domain/SecretRepository';

export class CreateOneTimeSecret {
  constructor(
    private secretRepository: SecretRepository,
    private encryptionKey: string
  ) {}

  execute = async (text: string) => {
    const secret = new Secret(this.encryptionKey);
    secret.encrypt(text);
    await this.secretRepository.save(secret);
    const secretCount = await this.secretRepository.getSecretCount();
    await this.secretRepository.saveSecretCount(secretCount + 1);
    return secret.id;
  };
}
