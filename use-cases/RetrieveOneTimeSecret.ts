import type { SecretRepository } from '../entities/SecretRepository';

export class RetrieveOneTimeSecret {
  constructor(private secretRepository: SecretRepository) {}

  execute = async (secretId: string) => {
    const secret = await this.secretRepository.findById(secretId);
    return secret.decrypt();
  };
}
