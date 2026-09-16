import { randomBytes } from 'node:crypto'
import type { User } from '../users/User.js'

export class AuthSessions {
  private readonly usersByToken = new Map<string, User>()

  create(user: User): string {
    const token = randomBytes(32).toString('hex')
    this.usersByToken.set(token, user)
    return token
  }

  find(token: string | undefined): User | undefined {
    return token ? this.usersByToken.get(token) : undefined
  }

  remove(token: string): boolean {
    return this.usersByToken.delete(token)
  }

  replace(token: string, user: User): void {
    this.usersByToken.set(token, user)
  }
}
