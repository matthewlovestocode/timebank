import type { JsonFile } from '../files/JsonFile.js'
import type { User, UserAttributes } from './User.js'

export type PersistedUser = UserAttributes & {
  passwordHash: string
}

export class UsersFile {
  constructor(private readonly file: JsonFile<PersistedUser>) {}

  async findByEmail(email: string): Promise<PersistedUser | undefined> {
    return (await this.file.read()).find((user) => user.email === email)
  }

  async add(user: User, passwordHash: string): Promise<void> {
    const users = await this.file.read()
    await this.file.write([...users, { ...user.toJSON(), passwordHash }])
  }
}
