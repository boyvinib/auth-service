import { Router } from 'express'
import { makeCreateUserController } from '../../../main/factories/CreateUserFactory'
import { makeAuthenticateUserController } from '../../../main/factories/AuthenticateUserFactory'

const routes = Router()

routes.post('/register', (req, res) =>
  makeCreateUserController().handle(req, res)
)

routes.post('/login', (req, res) =>
  makeAuthenticateUserController().handle(req, res)
)

export { routes }
