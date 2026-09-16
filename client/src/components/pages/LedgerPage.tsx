import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { LedgerHistory } from '../account/LedgerHistory'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useLedger } from '../../hooks/useLedger'

export function LedgerPage({ navigation }: { navigation: ReactNode }) {
  const { entries } = useLedger(clientConfig.apiUrl)
  return (
    <PageLayout navigation={navigation}>
      <Box sx={{ p: { xs: 3, sm: 6 } }}>
        <LedgerHistory entries={entries} />
      </Box>
    </PageLayout>
  )
}
