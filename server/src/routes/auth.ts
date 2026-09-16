import { Router } from 'express'
import { resolve } from 'node:path'
import { AuthSessions } from '../auth/AuthSessions.js'
import { hashPassword, verifyPassword } from '../auth/Password.js'
import { serverConfig } from '../config/env.js'
import {
  CurrentUserResponseContract,
  DashboardResponseContract,
  DemoSignInParamsContract,
  ErrorResponseContract,
  SignInRequestContract,
  SignInResponseContract,
  SignUpRequestContract,
} from '../contracts/auth.js'
import { JsonFile } from '../files/JsonFile.js'
import { Ledger } from '../ledgers/Ledger.js'
import { LedgerEntriesFile } from '../ledgers/LedgerEntriesFile.js'
import { LedgerEntry } from '../ledgers/LedgerEntry.js'
import { LedgersFile } from '../ledgers/LedgersFile.js'
import { User } from '../users/User.js'
import { UsersFile } from '../users/UsersFile.js'

const sessions = new AuthSessions()
const usersFile = new UsersFile(new JsonFile(resolve(process.cwd(), 'data/users.json')))
const ledgersFile = new LedgersFile(new JsonFile(resolve(process.cwd(), 'data/ledgers.json')))
const ledgerEntriesFile = new LedgerEntriesFile(
  new JsonFile(resolve(process.cwd(), 'data/ledger-entries.json')),
)

export function createAuthRouter(
  authSessions: AuthSessions,
  users: UsersFile,
  ledgers: LedgersFile,
  ledgerEntries: LedgerEntriesFile,
  isDemoAuthEnabled: boolean,
): Router {
  const router = Router()

  function createSessionResponse(user: User) {
    const token = authSessions.create(user)
    return SignInResponseContract.parse({ token, user: user.toJSON() })
  }

  router.post('/sign-in', async (request, response) => {
    const result = SignInRequestContract.safeParse(request.body)

    if (!result.success) {
      return response
        .status(400)
        .json(ErrorResponseContract.parse({ error: result.error.issues[0]?.message }))
    }

    const persistedUser = await users.findByEmail(result.data.email)

    if (!persistedUser || !(await verifyPassword(result.data.password, persistedUser.passwordHash))) {
      return response
        .status(401)
        .json(ErrorResponseContract.parse({ error: 'Invalid email or password' }))
    }

    const { passwordHash: _passwordHash, ...attributes } = persistedUser
    const user = new User(attributes)

    return response.status(201).json(createSessionResponse(user))
  })

  router.post('/sign-up', async (request, response) => {
    const result = SignUpRequestContract.safeParse(request.body)

    if (!result.success) {
      return response
        .status(400)
        .json(ErrorResponseContract.parse({ error: result.error.issues[0]?.message }))
    }

    if (await users.findByEmail(result.data.email)) {
      return response.status(409).json(ErrorResponseContract.parse({ error: 'Email is already in use' }))
    }

    const user = User.create({
      name: result.data.name,
      email: result.data.email,
      role: result.data.role,
    })
    await users.add(user, await hashPassword(result.data.password))
    const ledger = Ledger.create(user.id)
    await ledgers.add(ledger)
    await ledgerEntries.add(
      LedgerEntry.createAccountCreationDeposit(ledger.id, serverConfig.signupCreditMinutes),
    )

    return response.status(201).json(createSessionResponse(user))
  })

  router.post('/quick-sign-in/:role', (request, response) => {
    if (!isDemoAuthEnabled) {
      return response.status(404).json(ErrorResponseContract.parse({ error: 'Not found' }))
    }

    const result = DemoSignInParamsContract.safeParse(request.params)

    if (!result.success) {
      return response.status(404).json(ErrorResponseContract.parse({ error: 'Not found' }))
    }

    const { role } = result.data
    const user = User.create({
      name: role === 'admin' ? 'Demo Admin' : 'Demo Member',
      email: `demo-${role}@timebank.local`,
      role,
    })

    return response.status(201).json(createSessionResponse(user))
  })

  router.get('/me', (request, response) => {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '')
    const user = authSessions.find(token)

    if (!user) {
      return response
        .status(401)
        .json(ErrorResponseContract.parse({ error: 'Authentication is required' }))
    }

    return response.json(CurrentUserResponseContract.parse({ user: user.toJSON() }))
  })

  router.get('/dashboard', async (request, response) => {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '')
    const user = authSessions.find(token)

    if (!user) {
      return response
        .status(401)
        .json(ErrorResponseContract.parse({ error: 'Authentication is required' }))
    }

    const ledger = await ledgers.findByUserId(user.id)

    if (!ledger) {
      return response.status(404).json(ErrorResponseContract.parse({ error: 'Ledger not found' }))
    }

    const entries = await ledgerEntries.findByLedgerId(ledger.id)
    return response.json(
      DashboardResponseContract.parse({
        user: user.toJSON(),
        balanceMinutes: ledger.balance(entries),
      }),
    )
  })

  router.post('/sign-out', (request, response) => {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '')
    const user = authSessions.find(token)

    if (!user || !token) {
      return response
        .status(401)
        .json(ErrorResponseContract.parse({ error: 'Authentication is required' }))
    }

    authSessions.remove(token)
    return response.status(204).send()
  })

  return router
}

export const authRouter = createAuthRouter(
  sessions,
  usersFile,
  ledgersFile,
  ledgerEntriesFile,
  serverConfig.demoAuthEnabled,
)
