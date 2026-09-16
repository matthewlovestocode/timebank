import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { InputField } from '../primitives/InputField'
import type { AuthUser, SignUpInput } from '../../hooks/useDemoAuth'

type SignUpFormProps = {
  authenticated: boolean
  onSignUp: (input: SignUpInput) => Promise<boolean>
}

export function SignUpForm({ authenticated, onSignUp }: SignUpFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = async (role: AuthUser['role']) => {
    await onSignUp({ name, email, password, role })
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Create a demo account
      </Typography>
      <InputField
        label="Name"
        value={name}
        disabled={authenticated}
        onChange={(event) => setName(event.target.value)}
      />
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
      <Stack direction="row" spacing={1}>
        <ActionButton
          variant="contained"
          disabled={authenticated}
          onClick={() => signUp('member')}
        >
          Create member
        </ActionButton>
        <ActionButton
          variant="outlined"
          disabled={authenticated}
          onClick={() => signUp('admin')}
        >
          Create admin
        </ActionButton>
      </Stack>
    </Stack>
  )
}
