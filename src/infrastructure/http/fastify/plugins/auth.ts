import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
  email: string
}

export async function authPlugin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token missing' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload

    request.user = {
      id: decoded.userId,
      email: decoded.email,
    }
  } catch {
    return reply.status(401).send({ message: 'Invalid token' })
  }
}
