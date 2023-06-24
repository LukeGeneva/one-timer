import type { PrismaClient } from '@prisma/client';
import { Secret } from '../entities/Secret';
import type { SecretRepository } from '../entities/SecretRepository';

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
}
