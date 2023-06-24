import { CreateOneTimeSecret } from './CreateOneTimeSecret';
import { RetrieveOneTimeSecret } from './RetrieveOneTimeSecret';
import { TestSecretRepository } from './test/TestSecretRepository';

test('that secret is retrieved', async () => {
  const key = new Array(32).fill('a').join('');
  const secretRepository = new TestSecretRepository();
  const createSecret = new CreateOneTimeSecret(secretRepository, key);
  const secretId = await createSecret.execute('test');
  const retrieveSecret = new RetrieveOneTimeSecret(secretRepository);
  const secretText = await retrieveSecret.execute(secretId);
  expect(secretText).toBe('test');
});
