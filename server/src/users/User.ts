import { randomUUID } from 'node:crypto'

export type UserAttributes = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  joinedAt: string
  role: UserRole
  bio: string
  location: string
}

export const userRoles = ['member', 'admin'] as const
export type UserRole = (typeof userRoles)[number]

export type NewUserAttributes = {
  name: string
  email: string
  role?: UserRole
  bio?: string
  location?: string
}

export class User {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly joinedAt: string
  readonly role: UserRole
  readonly bio: string
  readonly location: string

  constructor(attributes: UserAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.email = attributes.email
    this.createdAt = attributes.createdAt
    this.updatedAt = attributes.updatedAt
    this.joinedAt = attributes.joinedAt
    this.role = attributes.role
    this.bio = attributes.bio ?? ''
    this.location = attributes.location ?? ''
  }

  static create(attributes: NewUserAttributes): User {
    const timestamp = new Date().toISOString()

    return new User({
      id: randomUUID(),
      name: attributes.name,
      email: attributes.email,
      createdAt: timestamp,
      updatedAt: timestamp,
      joinedAt: timestamp,
      role: attributes.role ?? 'member',
      bio: attributes.bio ?? '',
      location: attributes.location ?? '',
    })
  }

  updateProfile(profile: Pick<NewUserAttributes, 'name' | 'bio' | 'location'>): User {
    return new User({
      ...this.toJSON(),
      name: profile.name,
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      updatedAt: new Date().toISOString(),
    })
  }

  toJSON(): UserAttributes {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      joinedAt: this.joinedAt,
      role: this.role,
      bio: this.bio,
      location: this.location,
    }
  }
}
