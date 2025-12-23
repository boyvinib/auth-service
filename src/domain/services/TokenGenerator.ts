export interface TokenGenerator {
  generate(payload: Record<string, any>): Promise<string>
}
