import { CreateOneTimeSecret } from './CreateOneTimeSecret';
import { RetrieveOneTimeSecret } from './RetrieveOneTimeSecret';
import { TestSecretRepository } from './test/TestSecretRepository';

const KEY = new Array(32).fill('a').join('');
let secretRepository: TestSecretRepository;
let retrieveSecret: RetrieveOneTimeSecret;

beforeEach(() => {
  secretRepository = new TestSecretRepository();
  retrieveSecret = new RetrieveOneTimeSecret(secretRepository);
});

test('that secret is retrieved', async () => {
  const createSecret = new CreateOneTimeSecret(secretRepository, KEY);
  const secretId = await createSecret.execute('test');
  const secretText = await retrieveSecret.execute(secretId);
  expect(secretText).toBe('test');
});

test('that secret is deleted', async () => {
  const createSecret = new CreateOneTimeSecret(secretRepository, KEY);
  const secretId = await createSecret.execute('test');
  await retrieveSecret.execute(secretId);
  expect(retrieveSecret.execute(secretId)).rejects.toThrow();
});
