import { createTestServer } from '../../setup/test-server'
import { FastifyInstance } from 'fastify'

describe('Auth E2E (In-Memory or Postgres)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestServer()
    await app.ready()

    // if running against Postgres, ensure the users table exists
    if (process.env.POSTGRES_URL) {
      const { pool } = await import('../../../src/infrastructure/database/postgres/connection')
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id uuid PRIMARY KEY,
          name text NOT NULL,
          email text UNIQUE NOT NULL,
          password text NOT NULL,
          "isActive" boolean NOT NULL DEFAULT true,
          "createdAt" timestamp NOT NULL DEFAULT now()
        )
      `)
    }
  })

  afterAll(async () => {
    // clean up DB if using Postgres
    if (process.env.POSTGRES_URL) {
      const { pool } = await import('../../../src/infrastructure/database/postgres/connection')
      await pool.query('DROP TABLE IF EXISTS users')
      await pool.end()
    }

    await app.close()
  })

  it('should register a user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'Password@123',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body)).toEqual({
      message: 'User created successfully',
    })

    // debug: dump users directly if using Postgres
    if (process.env.POSTGRES_URL) {
      const { pool } = await import('../../../src/infrastructure/database/postgres/connection')
      const result = await pool.query('SELECT id, email, password FROM users')
      console.log('users after register', result.rows)
    }
  })

  it('should login and return token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@test.com',
        password: 'Password@123',
      },
    })

    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.token).toBeDefined()
  })

  it('should access protected route with valid token', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@test.com',
        password: 'Password@123',
      },
    })

    const { token } = JSON.parse(login.body)

    const response = await app.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.email).toBe('john@test.com')
  })

  it('should not access protected route without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/me',
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not register user with duplicate email', async () => {
    await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        name: 'Jane Doe',
        email: 'jane@test.com',
        password: 'Password@123',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        name: 'Jane Doe',
        email: 'jane@test.com',
        password: 'Password@456',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).message).toContain('User already exists')
  })

  it('should not login with wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@test.com',
        password: 'WrongPassword@123',
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not login with non-existent email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'nonexistent@test.com',
        password: 'Password@123',
      },
    })

    expect(response.statusCode).toBe(401)
  })
})