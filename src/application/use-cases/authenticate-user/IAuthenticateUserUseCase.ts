import { AuthenticateUserDTO } from '../../dtos/AuthenticateUserDTO'

export interface IAuthenticateUserUseCase {
  execute(data: AuthenticateUserDTO): Promise<{ token: string }>
}
