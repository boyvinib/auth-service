import { FastifyRequest, FastifyReply } from 'fastify'
import { HttpRequest } from '../../protocols/Http'

export async function fastifyAdapter(
  controller: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const httpRequest: HttpRequest = {
    body: request.body,
    params: request.params,
    query: request.query,
    user: request.user,
  }

  const httpResponse = await controller.handle(httpRequest)

  return reply
    .status(httpResponse.statusCode)
    .send(httpResponse.body)
}
