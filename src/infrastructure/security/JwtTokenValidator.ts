import jwt from 'jsonwebtoken'
import { TokenValidator } from '../../domain/services/TokenValidator'

export class JwtTokenValidator implements TokenValidator {
  constructor(private readonly secret: string) {}

  async validate(token: string): Promise<Record<string, any>> {
    return jwt.verify(token, this.secret) as Record<string, any>
  }
}
