import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

type SecretHydrationProps = {
  id: string;
  key: string;
  encryptedValue: string;
  createdAt: Date;
  initializationVector: string;
};

export class Secret {
  private _id: string;
  private _encryptedValue: string;
  private _createdAt: Date;
  private _algorithm = 'aes-256-cbc';
  private _key: string;
  private _initializationVector: Buffer;

  get id() {
    return this._id;
  }

  get createdAt() {
    return new Date(this._createdAt);
  }

  get encryptedValue() {
    return this._encryptedValue;
  }

  get initializationVector() {
    return this._initializationVector.toString('hex');
  }

  constructor(key: string) {
    if (key.length !== 32) throw new Error('Key must be 32 bytes.');
    this._id = uuid();
    this._createdAt = new Date();
    this._encryptedValue = '';
    this._key = key;
    this._initializationVector = crypto.randomBytes(16);
  }

  encrypt = (value: string) => {
    const cipher = crypto.createCipheriv(
      this._algorithm,
      Buffer.from(this._key),
      this._initializationVector
    );
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    this._encryptedValue = encrypted.toString('hex');
  };

  decrypt = () => {
    const decipher = crypto.createDecipheriv(
      this._algorithm,
      Buffer.from(this._key),
      this._initializationVector
    );
    let decrypted = decipher.update(this._encryptedValue, 'hex');
    return Buffer.concat([decrypted, decipher.final()]).toString();
  };

  static __hydrate = (props: SecretHydrationProps) => {
    const secret = new Secret(props.key);
    secret._id = props.id;
    secret._encryptedValue = props.encryptedValue;
    secret._createdAt = props.createdAt;
    secret._initializationVector = Buffer.from(
      props.initializationVector,
      'hex'
    );
    return secret;
  };
}
