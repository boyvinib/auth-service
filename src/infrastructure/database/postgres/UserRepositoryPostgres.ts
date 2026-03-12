import { UserRepository } from '../../../domain/repositories/UserRepository'
import { User } from '../../../domain/entities/User'
import { Password } from '../../../domain/value-objects/Password'
import { pool } from './connection'

export class UserRepositoryPostgres implements UserRepository {
  async create(user: User): Promise<void> {
    const query = `
      INSERT INTO users(id, name, email, password, "isActive", "createdAt")
      VALUES($1, $2, $3, $4, $5, $6)
    `
    const values = [
      user.id,
      user.name,
      user.email,
      user.password,
      user.isActive,
      user.createdAt,
    ]

    await pool.query(query, values)
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])

    if (result.rowCount === 0) {
      return null
    }

    const row = result.rows[0]
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      password: Password.restore(row.password),
      isActive: row.isActive,
      createdAt: row.createdat,
    })
  }
}
