import type { BunRequest } from 'bun';
import { db } from './db/db';
import { encrypt, decrypt } from './secret';
import type { Secret } from './secret';

const INSERT_SECRET = `
INSERT INTO Secret (
  id, 
  encryptedValue, 
  createdAt, 
  initializationVector, 
  expiresAt
) VALUES (?1, ?2, ?3, ?4, ?5);
`;

const INC_COUNT = `
UPDATE KeyValue 
SET value = value + 1 
WHERE key = 'SECRET_COUNT';
`;

async function createSecret(req: BunRequest) {
  const { value } = await req.json();
  const secret = encrypt(value);
  const { key } = secret;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const transaction = db.transaction(() => {
    db.run(INSERT_SECRET, [
      secret.id,
      secret.encryptedValue,
      secret.createdAt.toISOString(),
      secret.initializationVector,
      expiresAt.toISOString(),
    ]);
    db.run(INC_COUNT);
  });

  transaction();

  return Response.json({ id: secret.id, key });
}

const GET_SECRET = `
SELECT id, encryptedValue, initializationVector, createdAt
FROM Secret
WHERE id = ?1 AND expiresAt > ?2;
`;

const DELETE_SECRET = `
DELETE FROM Secret WHERE id = ?1;
`;

async function getSecret(req: BunRequest<'/api/secret/:id'>) {
  const { id } = req.params;
  const key = new URL(req.url).searchParams.get('key');

  if (!key) return Response.json({ error: 'Missing key' }, { status: 400 });

  const row = db.query(GET_SECRET).get(id, new Date().toISOString()) as Omit<
    Secret,
    'key'
  > | null;

  if (!row)
    return Response.json(
      { error: 'Secret not found or expired' },
      { status: 404 }
    );

  const value = decrypt({ ...row, key });

  db.run(DELETE_SECRET, [id]);

  return Response.json({ value });
}

const GET_SECRET_COUNT = `
SELECT value FROM KeyValue WHERE key = 'SECRET_COUNT';
`;

function getSecretCount() {
  const row = db.query(GET_SECRET_COUNT).get() as { value: number } | null;
  return Response.json({ count: row?.value ?? 0 });
}

export const api = {
  '/api/secret': { POST: createSecret },
  '/api/secret/:id': { GET: getSecret },
  '/api/secret-count': { GET: getSecretCount },
};
