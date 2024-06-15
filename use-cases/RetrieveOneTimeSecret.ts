import type { SecretRepository } from '../domain/SecretRepository';

export class RetrieveOneTimeSecret {
  constructor(private secretRepository: SecretRepository) {}

  execute = async (secretId: string) => {
    const secret = await this.secretRepository.findById(secretId);
    const message = secret.decrypt();
    await this.secretRepository.delete(secretId);
    return message;
  };
}
