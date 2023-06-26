export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
export const BASE_URL = process.env.BASE_URL as string;

if (!ENCRYPTION_KEY)
  throw new Error('ENCRYPTION_KEY environment variable not found.');

if (!BASE_URL) throw new Error('BASE_URL environment variable not found.');
