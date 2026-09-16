import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { AccountDashboard } from '../dashboard/AccountDashboard'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useDashboard } from '../../hooks/useDashboard'

type DashboardPageProps = {
  navigation: ReactNode
}

export function DashboardPage({ navigation }: DashboardPageProps) {
  const { dashboard, status } = useDashboard(clientConfig.apiUrl)

  return (
    <PageLayout navigation={navigation}>
      <Box sx={{ flex: 1, p: { xs: 3, sm: 6 } }}>
        <AccountDashboard dashboard={dashboard} status={status} />
      </Box>
    </PageLayout>
  )
}
