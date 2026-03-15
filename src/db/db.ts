import { Database } from 'bun:sqlite';
import { readdir } from 'node:fs/promises';
import { join } from 'path';

export const db = new Database(process.env.DATABASE_URL, { strict: true });

const MIGRATION_INIT_SQL = `
CREATE TABLE IF NOT EXISTS "Migration" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export const migrate = async () => {
  db.run(MIGRATION_INIT_SQL);
  const migrationDir = join(import.meta.dir, 'migrations');
  const migrations = db
    .query('SELECT * FROM "Migration" ORDER BY "name";')
    .all() as any;
  const migrationNames = migrations.map((m: any) => m.name);

  const files = await readdir(migrationDir);
  files.sort((a, b) => (a > b ? 1 : -1));

  const migrationsToApply = files.filter((f) => !migrationNames.includes(f));
  for (const migration of migrationsToApply) {
    const file = Bun.file(join(import.meta.dir, 'migrations', migration));
    const sql = await file.text();
    db.run(sql);
    db.run(`INSERT INTO "Migration" ("name") VALUES (?1);`, [migration]);
  }
};
