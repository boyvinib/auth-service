import { AuthenticateUserController } from '../../../src/infrastructure/http/controllers/AuthenticateUserController'
import { HttpRequest } from '../../../src/infrastructure/http/protocols/Http'
import { AuthenticateUserUseCaseFake } from '../../mocks/AuthenticateUserUseCaseFake'

describe('AuthenticateUserController', () => {
  let controller: AuthenticateUserController
  let useCase: AuthenticateUserUseCaseFake

  beforeEach(() => {
    useCase = new AuthenticateUserUseCaseFake()
    controller = new AuthenticateUserController(useCase)
  })

  it('should return 200 with token on success', async () => {
    const request: HttpRequest = {
      body: {
        email: 'john@example.com',
        password: 'Password@123',
      },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ token: 'fake-token-123' })
  })

  it('should return 401 on invalid credentials', async () => {
    useCase.shouldThrowError = true
    useCase.errorMessage = 'Invalid credentials'

    const request: HttpRequest = {
      body: {
        email: 'john@example.com',
        password: 'wrong-password',
      },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Invalid credentials')
  })

  it('should pass email and password to use case', async () => {
    const executeSpy = jest.spyOn(useCase, 'execute')
    const request: HttpRequest = {
      body: {
        email: 'test@example.com',
        password: 'TestPass@123',
      },
    }

    await controller.handle(request)

    expect(executeSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'TestPass@123',
    })
  })
})
