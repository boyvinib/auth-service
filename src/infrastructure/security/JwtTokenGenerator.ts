import * as jwt from 'jsonwebtoken'
import { Secret, SignOptions } from 'jsonwebtoken'
import { TokenGenerator } from '../../domain/services/TokenGenerator'

interface JwtPayload {
  userId: string
  email: string
}

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: Secret,
    private readonly expiresInSeconds: number = 60 * 60 * 24 // 1 dia
  ) {}

  async generate(payload: JwtPayload): Promise<string> {
    const options: SignOptions = {
      expiresIn: this.expiresInSeconds,
    }

    return jwt.sign(payload, this.secret, options)
  }
}
