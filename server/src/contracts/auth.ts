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

export const DashboardResponseContract = z.object({
  user: UserContract,
  balanceMinutes: z.number().int(),
})

export const ErrorResponseContract = z.object({
  error: z.string(),
})

export const DemoSignInParamsContract = z.object({
  role: z.enum(userRoles),
})

export type SignInRequest = z.input<typeof SignInRequestContract>
export type SignInResponse = z.infer<typeof SignInResponseContract>
