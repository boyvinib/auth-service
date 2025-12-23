import { TokenGenerator } from '../../src/domain/services/TokenGenerator'

export class TokenGeneratorFake implements TokenGenerator {
  async generate(payload: Record<string, any>): Promise<string> {
    return `token-${payload.userId}`
  }
}
