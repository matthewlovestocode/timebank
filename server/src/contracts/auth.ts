import { z } from 'zod'
import { userRoles } from '../users/User.js'

export const UserContract = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  joinedAt: z.iso.datetime(),
  role: z.enum(userRoles),
  bio: z.string().default(''),
  location: z.string().default(''),
})

export const SignInRequestContract = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email('A valid email is required'))
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, 'A password must be at least 8 characters'),
})

export const SignUpRequestContract = z.object({
  name: z.string().trim().min(1, 'A user name is required'),
  email: z
    .string()
    .trim()
    .pipe(z.email('A valid email is required'))
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, 'A password must be at least 8 characters'),
  role: z.enum(userRoles).default('member'),
})

export const SignInResponseContract = z.object({
  token: z.string().min(1),
  user: UserContract,
})

export const CurrentUserResponseContract = z.object({
  user: UserContract,
})

export const UsersResponseContract = z.object({ users: z.array(UserContract) })

export const UpdateProfileRequestContract = z.object({
  name: z.string().trim().min(1, 'A user name is required'),
  bio: z.string().trim().max(500, 'Bio must be 500 characters or less').default(''),
  location: z.string().trim().max(120, 'Location must be 120 characters or less').default(''),
})

export const DashboardResponseContract = z.object({
  user: UserContract,
  balanceMinutes: z.number().int(),
})

export const LedgerResponseContract = z.object({
  balanceMinutes: z.number().int(),
  entries: z.array(
    z.object({
      id: z.uuid(),
      ledgerId: z.uuid(),
      direction: z.enum(['credit', 'debit']),
      kind: z.enum(['account-creation-deposit', 'exchange-settlement']),
      minutes: z.number().int().positive(),
      exchangeId: z.uuid().nullable(),
      createdAt: z.iso.datetime(),
    }),
  ),
})

export const ErrorResponseContract = z.object({
  error: z.string(),
})

export const DemoSignInParamsContract = z.object({
  role: z.enum(userRoles),
})

export type SignInRequest = z.input<typeof SignInRequestContract>
export type SignInResponse = z.infer<typeof SignInResponseContract>
