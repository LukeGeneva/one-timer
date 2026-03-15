CREATE TABLE Secret (
  id TEXT NOT NULL PRIMARY KEY,
  encryptedValue TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  initializationVector TEXT NOT NULL,
  expiresAt DATETIME NOT NULL
);

CREATE TABLE KeyValue (
  key TEXT NOT NULL PRIMARY KEY,
  value INTEGER NOT NULL
);

INSERT INTO KeyValue (
  key,
  value
) VALUES (
  'SECRET_COUNT',
  0
);
