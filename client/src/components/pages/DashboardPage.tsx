import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { AccountDashboard } from '../dashboard/AccountDashboard'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useDashboard } from '../../hooks/useDashboard'
import { useListings } from '../../hooks/useListings'
import { useExchangeRequest } from '../../hooks/useExchangeRequest'
import { ListingPreview } from '../marketplace/ListingPreview'

type DashboardPageProps = {
  navigation: ReactNode
}

export function DashboardPage({ navigation }: DashboardPageProps) {
  const { dashboard, status } = useDashboard(clientConfig.apiUrl)
  const listings = useListings(clientConfig.apiUrl)
  const { requestExchange, status: exchangeStatus } = useExchangeRequest(clientConfig.apiUrl)

  return (
    <PageLayout navigation={navigation}>
      <Box sx={{ flex: 1, p: { xs: 3, sm: 6 } }}>
        <AccountDashboard dashboard={dashboard} status={status} />
        <Box sx={{ mt: 5, width: '100%', maxWidth: 960 }}>
          <ListingPreview
            listings={listings}
            viewerId={dashboard?.user.id}
            onRequest={requestExchange}
          />
          {exchangeStatus && <Box sx={{ mt: 2 }}>{exchangeStatus}</Box>}
        </Box>
      </Box>
    </PageLayout>
  )
}
