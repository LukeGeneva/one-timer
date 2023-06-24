import { PrismaSecretRepository } from '../adapters/PrismaSecretRepository';
import { CreateOneTimeSecret } from '../use-cases/CreateOneTimeSecret';
import { prismaClient } from './db.server';
import { ENCRYPTION_KEY } from './env';

const secretRepository = new PrismaSecretRepository(
  prismaClient,
  ENCRYPTION_KEY
);
export const createOneTimeSecret = new CreateOneTimeSecret(
  secretRepository,
  ENCRYPTION_KEY
);
