export interface TokenValidator {
  validate(token: string): Promise<Record<string, any>>
}
