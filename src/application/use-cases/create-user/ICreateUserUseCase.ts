import { CreateUserDTO } from '../../dtos/CreateUserDTO'

export interface ICreateUserUseCase {
  execute(data: CreateUserDTO): Promise<void>
}
