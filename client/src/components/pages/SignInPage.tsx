import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import { SignInForm } from '../auth/SignInForm'
import { ActionButton } from '../primitives/ActionButton'
import { FormCard } from '../primitives/FormCard'
import { PageLayout } from '../layout/PageLayout'
import type { SignInInput } from '../../hooks/useDemoAuth'

type SignInPageProps = {
  authenticated: boolean
  status: string
  navigation: ReactNode
  onSignIn: (input: SignInInput) => Promise<boolean>
}

export function SignInPage({ authenticated, status, navigation, onSignIn }: SignInPageProps) {
  const navigate = useNavigate()

  const signIn = async (input: SignInInput) => {
    const signedIn = await onSignIn(input)
    if (signedIn) navigate('/dashboard')
    return signedIn
  }

  return (
    <PageLayout navigation={navigation}>
      <title>Sign In | Timebank</title>
      <Stack
        sx={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}
      >
        <FormCard>
        <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Typography variant="h4" component="h1">
            Welcome back
          </Typography>
          <SignInForm authenticated={authenticated} onSignIn={signIn} />
          {status !== 'Not signed in' && (
            <Typography variant="body2" color="text.secondary">
              {status}
            </Typography>
          )}
          <ActionButton variant="text" onClick={() => navigate('/sign-up')}>
            Need an account? Sign up
          </ActionButton>
        </Stack>
        </FormCard>
      </Stack>
    </PageLayout>
  )
}
