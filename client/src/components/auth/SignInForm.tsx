import { useState } from 'react'
import { Stack } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { InputField } from '../primitives/InputField'
import type { SignInInput } from '../../hooks/useDemoAuth'

type SignInFormProps = {
  authenticated: boolean
  onSignIn: (input: SignInInput) => Promise<boolean>
}

export function SignInForm({ authenticated, onSignIn }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    await onSignIn({ email, password })
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360 }}>
      <InputField
        label="Email"
        type="email"
        value={email}
        disabled={authenticated}
        onChange={(event) => setEmail(event.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        disabled={authenticated}
        onChange={(event) => setPassword(event.target.value)}
      />
      <ActionButton variant="contained" disabled={authenticated} onClick={signIn}>
        Sign in
      </ActionButton>
    </Stack>
  )
}
