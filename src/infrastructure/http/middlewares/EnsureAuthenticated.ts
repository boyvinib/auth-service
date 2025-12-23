import { Request, Response, NextFunction } from 'express'
import { JwtTokenValidator } from '../../security/JwtTokenValidator'

interface JwtPayload {
  userId: string
  email: string
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' })
  }

  const [, token] = authHeader.split(' ')

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined')
    }

    const tokenValidator = new JwtTokenValidator(process.env.JWT_SECRET)

    const decoded = await tokenValidator.validate(token) as JwtPayload

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
