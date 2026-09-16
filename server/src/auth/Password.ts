import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

  return `scrypt$${salt}$${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [algorithm, salt, key] = hash.split('$')
  if (algorithm !== 'scrypt' || !salt || !key) return false

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  const storedKey = Buffer.from(key, 'hex')

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey)
}
