import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth.routes'
import { healthRoutes } from './routes/health.routes'

dotenv.config()

export const app = Fastify({
  logger: true,
})

app.register(swagger, {
  openapi: {
    info: {
      title: 'Auth Service',
      description: 'Authentication API with Clean Architecture',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
})

app.register(swaggerUI, {
  routePrefix: '/docs',
})

app.register(authRoutes)
app.register(healthRoutes)
