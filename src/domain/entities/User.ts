import { randomUUID } from 'crypto'
import { Password } from '../value-objects/Password';

interface IUser {
  id?: string;
  name: string;
  email: string;
  password: Password;
  isActive?: boolean;
  createdAt?: Date;
}
export class User {
    private _id: string
    private _name: string
    private _email: string
     private _password: Password
    private _isActive: boolean
    private _createdAt: Date

  constructor(user: IUser) {
    this._id = user.id ?? randomUUID();
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._isActive = user.isActive ?? true;
    this._createdAt = user.createdAt ?? new Date();

    this.validate();
  }

  private validate() {
    this.validateName()
    this.validateEmail()
  }

  private validateName() {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Name must have at least 3 characters')
    }
  }

   private validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(this._email)) {
      throw new Error('Invalid email format')
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password.value
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  deactivate() {
    this._isActive = false;
  }
}