import { FastifyInstance } from 'fastify'
import { authPlugin } from '../plugins/auth'
import { makeCreateUserController } from '../../../../main/factories/CreateUserFactory'
import { makeAuthenticateUserController } from '../../../../main/factories/AuthenticateUserFactory'
import { fastifyAdapter } from '../adapters/fastifyAdapter'

export async function authRoutes(app: FastifyInstance) {
  const createUserController = makeCreateUserController()
  const authenticateUserController = makeAuthenticateUserController()

  app.post('/register', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    return fastifyAdapter(createUserController, request, reply)
  })

  app.post('/login', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    return fastifyAdapter(authenticateUserController, request, reply)
  })

  app.get('/me', {
    preHandler: [authPlugin],
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    return reply.send(request.user)
  })
}
