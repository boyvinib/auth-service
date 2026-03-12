import { BcryptPasswordHasher } from '../../../src/infrastructure/security/BcryptPasswordHasher'

describe('BcryptPasswordHasher', () => {
  let hasher: BcryptPasswordHasher

  beforeEach(() => {
    hasher = new BcryptPasswordHasher()
  })

  describe('hash()', () => {
    it('should hash a password', async () => {
      const password = 'Password@123'

      const hashed = await hasher.hash(password)

      expect(hashed).toBeDefined()
      expect(typeof hashed).toBe('string')
      expect(hashed).not.toBe(password)
    })

    it('should create different hashes for same password (salting)', async () => {
      const password = 'Password@123'

      const hash1 = await hasher.hash(password)
      const hash2 = await hasher.hash(password)

      expect(hash1).not.toBe(hash2)
    })

    it('should produce a bcrypt format hash', async () => {
      const password = 'Password@123'

      const hashed = await hasher.hash(password)

      expect(hashed).toMatch(/^\$2[aby]\$\d{2}\$/)
    })

    it('should hash long passwords', async () => {
      const longPassword = 'A'.repeat(72)

      const hashed = await hasher.hash(longPassword)

      expect(hashed).toBeDefined()
      expect(typeof hashed).toBe('string')
    })
  })

  describe('compare()', () => {
    it('should return true for matching password', async () => {
      const password = 'Password@123'
      const hashed = await hasher.hash(password)

      const result = await hasher.compare(password, hashed)

      expect(result).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const password = 'Password@123'
      const wrongPassword = 'WrongPassword@456'
      const hashed = await hasher.hash(password)

      const result = await hasher.compare(wrongPassword, hashed)

      expect(result).toBe(false)
    })

    it('should be case sensitive', async () => {
      const password = 'Password@123'
      const differentCase = 'password@123'
      const hashed = await hasher.hash(password)

      const result = await hasher.compare(differentCase, hashed)

      expect(result).toBe(false)
    })

    it('should handle special characters', async () => {
      const password = 'P@ssw0rd!#$%&*()'
      const hashed = await hasher.hash(password)

      const result = await hasher.compare(password, hashed)

      expect(result).toBe(true)
    })

    it('should return false for empty password', async () => {
      const password = 'Password@123'
      const hashed = await hasher.hash(password)

      const result = await hasher.compare('', hashed)

      expect(result).toBe(false)
    })
  })
})
