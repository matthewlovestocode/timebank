import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import { SignUpForm } from '../auth/SignUpForm'
import { ActionButton } from '../primitives/ActionButton'
import { FormCard } from '../primitives/FormCard'
import { PageLayout } from '../layout/PageLayout'
import type { SignUpInput } from '../../hooks/useDemoAuth'

type SignUpPageProps = {
  authenticated: boolean
  onSignUp: (input: SignUpInput) => Promise<boolean>
  navigation: ReactNode
  status: string
}

export function SignUpPage({ authenticated, onSignUp, navigation, status }: SignUpPageProps) {
  const navigate = useNavigate()

  const createAccount = async (input: SignUpInput) => {
    const created = await onSignUp(input)
    if (created) navigate('/dashboard')
    return created
  }

  return (
    <PageLayout navigation={navigation}>
      <title>Sign Up | Timebank</title>
      <Stack
        sx={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}
      >
        <FormCard>
        <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Typography variant="h4" component="h1">
            Join Timebank
          </Typography>
          <SignUpForm authenticated={authenticated} onSignUp={createAccount} />
          <Typography variant="body2" color="text.secondary">
            {status}
          </Typography>
          <ActionButton variant="text" onClick={() => navigate('/')}>
            Back to home
          </ActionButton>
        </Stack>
        </FormCard>
      </Stack>
    </PageLayout>
  )
}
