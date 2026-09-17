import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { ExchangeHistory } from '../account/ExchangeHistory'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useExchanges } from '../../hooks/useExchanges'
import { useDashboard } from '../../hooks/useDashboard'
import { useExchangeActions } from '../../hooks/useExchangeActions'

export function ExchangesPage({ navigation }: { navigation: ReactNode }) {
  const { exchanges, reload } = useExchanges(clientConfig.apiUrl)
  const { dashboard } = useDashboard(clientConfig.apiUrl)
  const { act, status } = useExchangeActions(clientConfig.apiUrl)
  const action = async (exchangeId: string, type: 'accept' | 'complete' | 'cancel') => { const result = await act(exchangeId, type); if (result) await reload(); return result }
  return ( 
    <PageLayout navigation={navigation}>
      <title>Exchanges | Timebank</title>
      <Box sx={{ p: { xs: 3, sm: 6 } }}>
        <ExchangeHistory exchanges={exchanges} userId={dashboard?.user.id} onAction={action} />
        {status}
      </Box>
    </PageLayout>
  )
}
