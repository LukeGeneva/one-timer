import type { SecretRepository } from '../entities/SecretRepository';

export class ConfirmReceipt {
  constructor(private secretRepository: SecretRepository) {}

  execute = async (secretId: string) => {
    await this.secretRepository.delete(secretId);
  };
}
