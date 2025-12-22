import { User } from '../../../src/domain/entities/User'
import { Password } from '../../../src/domain/value-objects/Password'

describe('User Entity', () => {
  const validPassword = Password.create('Abc@123')

  it('should create a valid user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: validPassword,
    })

    expect(user).toBeDefined()
    expect(user.isActive).toBe(true)
  })

  it('should deactivate user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: validPassword,
    })

    user.deactivate()

    expect(user.isActive).toBe(false)
  })

  it('should expose hashed password value', () => {
    const password = Password.restore('hashed-Abc@123')

    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password,
    })

    expect(user.password).toBe('hashed-Abc@123')
  })
  
  it('should not allow invalid email', () => {
    expect(() => {
      new User({
        name: 'John Doe',
        email: 'johnmail.com',
        password: validPassword,
      })
    }).toThrow()
  })

})
