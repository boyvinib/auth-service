import { User } from '../../src/domain/entities/User'
import { UserRepository } from '../../src/domain/repositories/UserRepository'

export class UserRepositoryInMemory implements UserRepository {
  public users: User[] = []

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email)
    return user ?? null
  }
}
