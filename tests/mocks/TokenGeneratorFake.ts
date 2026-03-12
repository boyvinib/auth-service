import jwt from 'jsonwebtoken'
import { TokenGenerator } from '../../src/domain/services/TokenGenerator'

export class TokenGeneratorFake implements TokenGenerator {
  async generate(payload: Record<string, any>): Promise<string> {
    return `token-${payload.userId}`
  }
}

/**
 * Token generator fake that generates real JWT tokens for integration testing
 */
export class TokenGeneratorJwtFake implements TokenGenerator {
  constructor(private readonly secret: string = 'test-secret') {}

  async generate(payload: Record<string, any>): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' })
  }
}
