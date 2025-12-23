import { UserRepository } from '../../../domain/repositories/UserRepository'
import { User } from '../../../domain/entities/User'

export class UserRepositoryPostgres implements UserRepository {
  async create(user: User): Promise<void> {
    // salvar no banco
  }

  async findByEmail(email: string): Promise<User | null> {
    // buscar no banco
    return null
  }
}
