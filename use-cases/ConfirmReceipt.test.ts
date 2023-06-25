import { ConfirmReceipt } from './ConfirmReceipt';
import { CreateOneTimeSecret } from './CreateOneTimeSecret';
import { RetrieveOneTimeSecret } from './RetrieveOneTimeSecret';
import { TestSecretRepository } from './test/TestSecretRepository';

const KEY = new Array(32).fill('a').join('');
let secretRepository: TestSecretRepository;
let retrieveSecret: RetrieveOneTimeSecret;
let confirmReceipt: ConfirmReceipt;

beforeEach(() => {
  secretRepository = new TestSecretRepository();
  retrieveSecret = new RetrieveOneTimeSecret(secretRepository);
  confirmReceipt = new ConfirmReceipt(secretRepository);
});

test('that secret is deleted', async () => {
  const createSecret = new CreateOneTimeSecret(secretRepository, KEY);
  const secretId = await createSecret.execute('test');
  await confirmReceipt.execute(secretId);
  expect(retrieveSecret.execute(secretId)).rejects.toThrow();
});
