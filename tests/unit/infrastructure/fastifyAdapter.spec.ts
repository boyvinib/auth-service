import { FastifyRequest, FastifyReply } from 'fastify'
import { fastifyAdapter } from '../../../src/infrastructure/http/fastify/adapters/fastifyAdapter'
import { HttpResponse } from '../../../src/infrastructure/http/protocols/Http'

describe('fastifyAdapter', () => {
  it('should convert FastifyRequest to HttpRequest and call controller', async () => {
    const mockRequest = {
      body: { name: 'John', email: 'john@example.com', password: 'pass' },
      params: { id: '123' },
      query: { filter: 'active' },
      user: { id: 'user-1', email: 'john@example.com' },
    } as unknown as FastifyRequest

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply

    const mockController = {
      handle: jest.fn().mockResolvedValue({
        statusCode: 201,
        body: { message: 'User created' },
      } as HttpResponse),
    }

    await fastifyAdapter(mockController, mockRequest, mockReply)

    expect(mockController.handle).toHaveBeenCalledWith({
      body: { name: 'John', email: 'john@example.com', password: 'pass' },
      params: { id: '123' },
      query: { filter: 'active' },
      user: { id: 'user-1', email: 'john@example.com' },
    })
  })

  it('should format response with status code and body', async () => {
    const mockRequest = {
      body: { email: 'test@example.com', password: 'pass' },
    } as unknown as FastifyRequest

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply

    const mockController = {
      handle: jest.fn().mockResolvedValue({
        statusCode: 200,
        body: { token: 'fake-token' },
      } as HttpResponse),
    }

    await fastifyAdapter(mockController, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(200)
    expect(mockReply.send).toHaveBeenCalledWith({ token: 'fake-token' })
  })

  it('should handle error response from controller', async () => {
    const mockRequest = {
      body: { email: 'test@example.com' },
    } as unknown as FastifyRequest

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply

    const mockController = {
      handle: jest.fn().mockResolvedValue({
        statusCode: 400,
        body: { message: 'Invalid input' },
      } as HttpResponse),
    }

    await fastifyAdapter(mockController, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({ message: 'Invalid input' })
  })

  it('should handle request without optional fields', async () => {
    const mockRequest = {
      body: { name: 'John' },
      params: undefined,
      query: undefined,
      user: undefined,
    } as unknown as FastifyRequest

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply

    const mockController = {
      handle: jest.fn().mockResolvedValue({
        statusCode: 201,
        body: {},
      } as HttpResponse),
    }

    await fastifyAdapter(mockController, mockRequest, mockReply)

    expect(mockController.handle).toHaveBeenCalledWith({
      body: { name: 'John' },
      params: undefined,
      query: undefined,
      user: undefined,
    })
  })
})
