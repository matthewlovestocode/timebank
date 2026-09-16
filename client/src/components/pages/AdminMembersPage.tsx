import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { MemberList } from '../admin/MemberList'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useMembers } from '../../hooks/useMembers'

export function AdminMembersPage({ navigation }: { navigation: ReactNode }) {
  const members = useMembers(clientConfig.apiUrl)
  return <PageLayout navigation={navigation}><Box sx={{ p: { xs: 3, sm: 6 } }}><MemberList members={members} /></Box></PageLayout>
}
