import { describe, expect, it } from 'vitest'
import { User } from './User.js'

describe('User', () => {
  it('creates a user with an ID and lifecycle timestamps', () => {
    const user = User.create({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })

    expect(user.id).toBeTypeOf('string')
    expect(user.name).toBe('Ada Lovelace')
    expect(user.email).toBe('ada@example.com')
    expect(user.createdAt).toBeTypeOf('string')
    expect(user.updatedAt).toBe(user.createdAt)
    expect(user.joinedAt).toBe(user.createdAt)
    expect(user.role).toBe('member')
  })

  it('serializes to plain JSON data', () => {
    const user = new User({
      id: '8e9b734e-8125-43f3-8f8c-3a2094e1ced9',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-09-16T00:00:00.000Z',
      updatedAt: '2026-09-16T00:00:00.000Z',
      joinedAt: '2026-09-16T00:00:00.000Z',
      role: 'admin',
    })

    expect(user.toJSON()).toEqual({
      id: '8e9b734e-8125-43f3-8f8c-3a2094e1ced9',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-09-16T00:00:00.000Z',
      updatedAt: '2026-09-16T00:00:00.000Z',
      joinedAt: '2026-09-16T00:00:00.000Z',
      role: 'admin',
    })
  })

})
