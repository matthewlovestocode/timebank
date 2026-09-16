import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { PageLayout } from '../layout/PageLayout'
import { ProfileEditor } from '../account/ProfileEditor'
import type { AuthUser, ProfileInput } from '../../hooks/useDemoAuth'

type ProfilePageProps = {
  navigation: ReactNode
  user: AuthUser | null
  status: string
  onSave: (input: ProfileInput) => Promise<boolean>
}

export function ProfilePage({ navigation, user, status, onSave }: ProfilePageProps) {
  return <PageLayout navigation={navigation}><Box sx={{ flex: 1, p: { xs: 3, sm: 6 } }}><ProfileEditor user={user} status={status} onSave={onSave} /></Box></PageLayout>
}
