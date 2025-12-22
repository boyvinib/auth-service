export class Password {
  private readonly _value: string

  private constructor(password: string, shouldValidate: boolean) {
    if (shouldValidate) {
      this.validate(password)
    }
    this._value = password
  }

  static create(password: string): Password {
    return new Password(password, true)
  }

  static restore(hashedPassword: string): Password {
    return new Password(hashedPassword, false)
  }

  private validate(password: string) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/

    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must contain uppercase, lowercase, number and special character'
      )
    }
  }

  get value() {
    return this._value
  }
}
