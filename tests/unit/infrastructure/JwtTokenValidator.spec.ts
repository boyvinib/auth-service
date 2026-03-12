import jwt from 'jsonwebtoken'
import { JwtTokenValidator } from '../../../src/infrastructure/security/JwtTokenValidator'

describe('JwtTokenValidator', () => {
  const secret = 'test-secret-key'
  let validator: JwtTokenValidator

  beforeEach(() => {
    validator = new JwtTokenValidator(secret)
  })

  describe('validate()', () => {
    it('should validate a valid token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1h' })

      const decoded = await validator.validate(token)

      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe('user-123')
      expect(decoded.email).toBe('test@example.com')
    })

    it('should throw error for invalid token', async () => {
      const invalidToken = 'invalid.token.here'

      await expect(validator.validate(invalidToken)).rejects.toThrow()
    })

    it('should throw error for token signed with different secret', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const wrongSecret = 'wrong-secret-key'
      const token = jwt.sign(payload, wrongSecret, { expiresIn: '1h' })

      await expect(validator.validate(token)).rejects.toThrow()
    })

    it('should throw error for expired token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const expiredToken = jwt.sign(payload, secret, { expiresIn: '-1s' })

      await expect(validator.validate(expiredToken)).rejects.toThrow()
    })

    it('should throw error for malformed token', async () => {
      const malformedToken = 'not.a.valid.jwt'

      await expect(validator.validate(malformedToken)).rejects.toThrow()
    })

    it('should throw error for empty token', async () => {
      await expect(validator.validate('')).rejects.toThrow()
    })

    it('should extract all payload properties', async () => {
      const payload = {
        userId: 'user-456',
        email: 'jane@example.com',
        role: 'admin',
        permissions: ['read', 'write'],
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1h' })

      const decoded = await validator.validate(token)

      expect(decoded.userId).toBe('user-456')
      expect(decoded.email).toBe('jane@example.com')
      expect(decoded.role).toBe('admin')
      expect(Array.isArray(decoded.permissions)).toBe(true)
    })

    it('should include standard JWT claims (iat, exp)', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1h' })

      const decoded = await validator.validate(token)

      expect(decoded.iat).toBeDefined()
      expect(typeof decoded.iat).toBe('number')
      expect(decoded.exp).toBeDefined()
      expect(typeof decoded.exp).toBe('number')
    })

    it('should validate token immediately after creation', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1h' })

      const decoded = await validator.validate(token)

      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe(payload.userId)
    })

    it('should throw error for tampered token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1h' })
      const tamperedToken = token.slice(0, -5) + 'XXXXX'

      await expect(validator.validate(tamperedToken)).rejects.toThrow()
    })
  })
})
