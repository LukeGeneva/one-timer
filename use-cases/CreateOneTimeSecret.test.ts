import { CreateOneTimeSecret } from './CreateOneTimeSecret';
import { TestSecretRepository } from './test/TestSecretRepository';

test('that secret is created and stored', async () => {
  const key = new Array(32).fill('x').join('');
  const secretRepository = new TestSecretRepository();
  const createOneTimeSecret = new CreateOneTimeSecret(secretRepository, key);
  const id = await createOneTimeSecret.execute('secret message');
  const savedSecret = await secretRepository.findById(id);
  expect(savedSecret.id).toBe(id);
});
