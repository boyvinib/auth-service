import { PasswordHasher } from '../../src/domain/services/PasswordHasher'

export class PasswordHasherFake implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed-${password}`
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return hashed === `hashed-${password}`
  }
}