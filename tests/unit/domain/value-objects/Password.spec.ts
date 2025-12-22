import { Password } from '../../../../src/domain/value-objects/Password'

describe('Password Value Object', () => {
  it('should create a password with valid rules', () => {
    const password = Password.create('Abc@123')

    expect(password).toBeDefined()
    expect(password.value).toBe('Abc@123')
  })

  it('should not allow weak password', () => {
    expect(() => {
      Password.create('123456')
    }).toThrow()
  })

  it('should restore hashed password without validation', () => {
    const hashedPassword = 'hashed-Abc@123'

    const password = Password.restore(hashedPassword)

    expect(password.value).toBe(hashedPassword)
  })
})
