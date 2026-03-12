import { CreateUserController } from '../../../src/infrastructure/http/controllers/CreateUserController'
import { HttpRequest } from '../../../src/infrastructure/http/protocols/Http'
import { CreateUserUseCaseFake } from '../../mocks/CreateUserUseCaseFake'

describe('CreateUserController', () => {
  let controller: CreateUserController
  let useCase: CreateUserUseCaseFake

  beforeEach(() => {
    useCase = new CreateUserUseCaseFake()
    controller = new CreateUserController(useCase as unknown as any)
  })

  it('should return 201 on success', async () => {
    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password@123',
      },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ message: 'User created successfully' })
  })

  it('should return 400 when use case throws error', async () => {
    useCase.shouldThrowError = true
    useCase.errorMessage = 'User already exists'

    const request: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password@123',
      },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('User already exists')
  })

  it('should pass request data to use case', async () => {
    const executeSpy = jest.spyOn(useCase, 'execute')
    const request: HttpRequest = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password@456',
      },
    }

    await controller.handle(request)

    expect(executeSpy).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password@456',
    })
  })
})