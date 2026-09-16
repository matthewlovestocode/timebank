import 'dotenv/config'
import { z } from 'zod'

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  DEMO_AUTH_ENABLED: z.enum(['true', 'false']).default('true'),
  SIGNUP_CREDIT_HOURS: z.coerce.number().positive().default(20),
})

const environment = environmentSchema.parse(process.env)

export const serverConfig = {
  port: environment.PORT,
  clientOrigin: environment.CLIENT_ORIGIN,
  demoAuthEnabled: environment.DEMO_AUTH_ENABLED === 'true',
  signupCreditMinutes: environment.SIGNUP_CREDIT_HOURS * 60,
}
