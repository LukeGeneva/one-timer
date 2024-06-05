import type { SecretRepository } from '~/SecretRepository';

export class GetSecretCount {
  constructor(private secretRepository: SecretRepository) {}

  async execute() {
    return await this.secretRepository.getSecretCount();
  }
}
