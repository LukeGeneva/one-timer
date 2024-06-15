import type { PrismaClient } from '@prisma/client';
import { Secret } from '../domain/Secret';
import type { SecretRepository } from '../domain/SecretRepository';

const SECRET_COUNT_KEY = 'Secret Count';

export class PrismaSecretRepository implements SecretRepository {
  constructor(
    private prismaClient: PrismaClient,
    private encryptionKey: string
  ) {}

  save = async (secret: Secret) => {
    await this.prismaClient.secret.upsert({
      create: {
        id: secret.id,
        createdAt: secret.createdAt,
        encryptedValue: secret.encryptedValue,
        initializationVector: secret.initializationVector,
      },
      update: {
        id: secret.id,
        createdAt: secret.createdAt,
        encryptedValue: secret.encryptedValue,
        initializationVector: secret.initializationVector,
      },
      where: { id: secret.id },
    });
  };

  async getSecretCount() {
    const record = await this.prismaClient.keyValue.findUnique({
      where: { key: SECRET_COUNT_KEY },
    });
    if (!record) return 0;
    const count = Number.parseInt(record.value) || 0;
    return count;
  }

  async saveSecretCount(count: number) {
    await this.prismaClient.keyValue.upsert({
      create: {
        key: SECRET_COUNT_KEY,
        value: count.toString(),
      },
      update: {
        key: SECRET_COUNT_KEY,
        value: count.toString(),
      },
      where: { key: SECRET_COUNT_KEY },
    });
  }

  findById = async (secretId: string) => {
    const rawSecret = await this.prismaClient.secret.findUniqueOrThrow({
      where: { id: secretId },
    });
    return Secret.__hydrate({
      id: rawSecret.id,
      createdAt: rawSecret.createdAt,
      encryptedValue: rawSecret.encryptedValue,
      initializationVector: rawSecret.initializationVector,
      key: this.encryptionKey,
    });
  };

  delete = async (secretId: string) => {
    await this.prismaClient.secret.delete({ where: { id: secretId } });
  };
}
