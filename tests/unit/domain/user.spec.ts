import { User } from '../../../src/domain/entities/user.entity'

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Abc@123',
    })

    expect(user.id).toBeDefined()
    expect(user.isActive).toBe(true)
  })
  it('should deactivate user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Abc@123',
    })

    user.deactivate()

    expect(user.isActive).toBe(false)
  })
  it('should not allow weak password', () => {
  expect(() => {
    new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: '123456',
    })
  }).toThrow()
})

it('should not allow invalid email', () => {
  expect(() => {
    new User({
      name: 'John Doe',
      email: 'johnmail.com',
      password: 'Abc@123',
    })
  }).toThrow()
})

})
