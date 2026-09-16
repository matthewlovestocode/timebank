import { describe, expect, it } from 'vitest'
import { AuthSessions } from './AuthSessions.js'
import { User } from '../users/User.js'

describe('AuthSessions', () => {
  it('finds a user by its issued token and rejects a missing token', () => {
    const sessions = new AuthSessions()
    const user = User.create({ name: 'Ada Lovelace', email: 'ada@example.com' })

    const token = sessions.create(user)

    expect(sessions.find(token)).toBe(user)
    expect(sessions.find(undefined)).toBeUndefined()
  })
})
