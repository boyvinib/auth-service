import jwt from 'jsonwebtoken'
import { JwtTokenGenerator } from '../../../src/infrastructure/security/JwtTokenGenerator'

describe('JwtTokenGenerator', () => {
  const secret = 'test-secret-key'
  let generator: JwtTokenGenerator

  beforeEach(() => {
    generator = new JwtTokenGenerator(secret)
  })

  describe('generate()', () => {
    it('should generate a valid JWT token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      const token = await generator.generate(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)
    })

    it('should generate token with correct payload', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      const token = await generator.generate(payload)
      const decoded = jwt.verify(token, secret) as any

      expect(decoded.userId).toBe('user-123')
      expect(decoded.email).toBe('test@example.com')
    })

    it('should generate token with expiration', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      const token = await generator.generate(payload)
      const decoded = jwt.decode(token) as any

      expect(decoded.exp).toBeDefined()
      expect(typeof decoded.exp).toBe('number')
    })

    it('should generate token with correct iat claim', async () => {
      const beforeGenerating = Math.floor(Date.now() / 1000)
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      const token = await generator.generate(payload)
      const decoded = jwt.decode(token) as any
      const afterGenerating = Math.floor(Date.now() / 1000)

      expect(decoded.iat).toBeDefined()
      expect(decoded.iat).toBeGreaterThanOrEqual(beforeGenerating)
      expect(decoded.iat).toBeLessThanOrEqual(afterGenerating + 1)
    })

    it('should handle custom expiration time', async () => {
      const expiresInSeconds = 3600
      const generatorWithCustomExpiration = new JwtTokenGenerator(
        secret,
        expiresInSeconds
      )

      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      const token = await generatorWithCustomExpiration.generate(payload)
      const decoded = jwt.decode(token) as any
      const issuedAt = decoded.iat
      const expiresAt = decoded.exp

      expect(expiresAt - issuedAt).toBe(expiresInSeconds)
    })

    it('should generate token with multiple payload properties', async () => {
      const payload = {
        userId: 'user-456',
        email: 'john@example.com',
      }

      const token = await generator.generate(payload)
      const decoded = jwt.verify(token, secret) as any

      expect(Object.keys(decoded)).toContain('userId')
      expect(Object.keys(decoded)).toContain('email')
      expect(decoded.userId).toBe('user-456')
      expect(decoded.email).toBe('john@example.com')
    })
  })
})
