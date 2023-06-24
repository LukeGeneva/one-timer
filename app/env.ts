export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

if (!ENCRYPTION_KEY)
  throw new Error('ENCRYPTION_KEY environment variable not found.');
