import express from 'express'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../app.js'
import { AuthSessions } from '../auth/AuthSessions.js'
import {
  CurrentUserResponseContract,
  DashboardResponseContract,
  ErrorResponseContract,
  SignInResponseContract,
} from '../contracts/auth.js'
import { JsonFile } from '../files/JsonFile.js'
import { LedgersFile } from '../ledgers/LedgersFile.js'
import { LedgerEntriesFile } from '../ledgers/LedgerEntriesFile.js'
import { UsersFile } from '../users/UsersFile.js'
import { createAuthRouter } from './auth.js'

async function createPersistentAuthApp() {
  const directory = await mkdtemp(join(tmpdir(), 'timebank-auth-'))
  const ledgers = new LedgersFile(new JsonFile(join(directory, 'ledgers.json')))
  const ledgerEntries = new LedgerEntriesFile(new JsonFile(join(directory, 'ledger-entries.json')))
  const testApp = express()
  testApp.use(express.json())
  testApp.use(
    '/api/auth',
    createAuthRouter(
      new AuthSessions(),
      new UsersFile(new JsonFile(join(directory, 'users.json'))),
      ledgers,
      ledgerEntries,
      true,
    ),
  )
  return { ledgerEntries, ledgers, testApp }
}

describe('authentication routes', () => {
  it('signs up and signs in a persistent admin user', async () => {
    const { ledgerEntries, ledgers, testApp: persistentAuthApp } = await createPersistentAuthApp()
    const signUp = await request(persistentAuthApp).post('/api/auth/sign-up').send({
      name: '  Ada Lovelace ',
      email: ' ADA@EXAMPLE.COM ',
      password: 'correct-horse-battery-staple',
      role: 'admin',
    })

    expect(signUp.status).toBe(201)
    expect(signUp.body.user.role).toBe('admin')
    const ledger = await ledgers.findByUserId(signUp.body.user.id)
    expect(ledger).toMatchObject({
      userId: signUp.body.user.id,
    })
    expect(await ledgerEntries.findByLedgerId(ledger!.id)).toMatchObject([
      {
        direction: 'credit',
        kind: 'account-creation-deposit',
        minutes: 1200,
      },
    ])

    const duplicateSignUp = await request(persistentAuthApp).post('/api/auth/sign-up').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse-battery-staple',
      role: 'admin',
    })

    expect(duplicateSignUp.status).toBe(409)

    const signIn = await request(persistentAuthApp).post('/api/auth/sign-in').send({
      email: 'ada@example.com',
      password: 'correct-horse-battery-staple',
    })

    expect(signIn.status).toBe(201)
    expect(signIn.body.token).toBeTypeOf('string')
    expect(signIn.body.user.name).toBe('Ada Lovelace')
    expect(signIn.body.user.email).toBe('ada@example.com')
    expect(signIn.body.user.role).toBe('admin')
    expect(SignInResponseContract.parse(signIn.body)).toEqual(signIn.body)

    const currentUser = await request(persistentAuthApp)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${signIn.body.token}`)

    expect(currentUser.status).toBe(200)
    expect(currentUser.body.user).toEqual(signIn.body.user)
    expect(CurrentUserResponseContract.parse(currentUser.body)).toEqual(currentUser.body)

    const dashboard = await request(persistentAuthApp)
      .get('/api/auth/dashboard')
      .set('Authorization', `Bearer ${signIn.body.token}`)

    expect(dashboard.status).toBe(200)
    expect(dashboard.body.balanceMinutes).toBe(1200)
    expect(DashboardResponseContract.parse(dashboard.body)).toEqual(dashboard.body)
  })

  it('validates sign-in payloads at the route boundary', async () => {
    const response = await request(app)
      .post('/api/auth/sign-in')
      .send({ email: 'not-an-email', password: 'correct-horse-battery-staple' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'A valid email is required' })
    expect(ErrorResponseContract.parse(response.body)).toEqual(response.body)
  })

  it('validates signup payloads at the route boundary', async () => {
    const response = await request(app)
      .post('/api/auth/sign-up')
      .send({ name: '', email: 'ada@example.com', password: 'short' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'A user name is required' })
  })

  it('rejects requests without a valid bearer token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Authentication is required' })
    expect(ErrorResponseContract.parse(response.body)).toEqual(response.body)

    const dashboard = await request(app).get('/api/auth/dashboard')
    expect(dashboard.status).toBe(401)
  })

  it('creates a demo admin session', async () => {
    const response = await request(app).post('/api/auth/quick-sign-in/admin')

    expect(response.status).toBe(201)
    expect(response.body.user).toMatchObject({
      name: 'Demo Admin',
      email: 'demo-admin@timebank.local',
      role: 'admin',
    })
    expect(SignInResponseContract.parse(response.body)).toEqual(response.body)
  })

  it('creates a demo member session and rejects unknown demo roles', async () => {
    const member = await request(app).post('/api/auth/quick-sign-in/member')
    const unknown = await request(app).post('/api/auth/quick-sign-in/owner')

    expect(member.status).toBe(201)
    expect(member.body.user.role).toBe('member')
    expect(unknown.status).toBe(404)
    expect(unknown.body).toEqual({ error: 'Not found' })
  })

  it('does not expose demo sign-in when it is disabled', async () => {
    const disabledDemoApp = express()
    disabledDemoApp.use(express.json())
    disabledDemoApp.use(
      '/api/auth',
      createAuthRouter(
        new AuthSessions(),
        new UsersFile(new JsonFile(join(tmpdir(), 'timebank-disabled-users.json'))),
        new LedgersFile(new JsonFile(join(tmpdir(), 'timebank-disabled-ledgers.json'))),
        new LedgerEntriesFile(
          new JsonFile(join(tmpdir(), 'timebank-disabled-ledger-entries.json')),
        ),
        false,
      ),
    )

    const response = await request(disabledDemoApp).post('/api/auth/quick-sign-in/admin')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Not found' })
  })

  it('removes a signed-in session', async () => {
    const signIn = await request(app).post('/api/auth/quick-sign-in/member')
    const token = signIn.body.token as string

    const signOut = await request(app)
      .post('/api/auth/sign-out')
      .set('Authorization', `Bearer ${token}`)

    expect(signOut.status).toBe(204)

    const currentUser = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(currentUser.status).toBe(401)
  })
})
