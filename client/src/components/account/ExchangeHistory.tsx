import { Chip, Stack, Typography } from '@mui/material'
import { ContentSurface } from '../primitives/ContentSurface'
import { ActionButton } from '../primitives/ActionButton'
import type { Exchange } from '../../hooks/useExchanges'

export function ExchangeHistory({ exchanges, userId, onAction }: { exchanges: Exchange[]; userId?: string; onAction: (id: string, action: 'accept' | 'complete' | 'cancel') => Promise<boolean> }) {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 960 }}>
      <Typography variant="h4" component="h1">My exchanges</Typography>
      {exchanges.length === 0 ? <Typography color="text.secondary">No exchanges yet.</Typography> : exchanges.map((exchange) => (
        <ContentSurface key={exchange.id} sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{exchange.agreedCreditMinutes === null ? 'Gift exchange' : `${exchange.agreedCreditMinutes} minutes`}</Typography>
            <Chip label={exchange.status} size="small" />
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {exchange.status === 'requested' && exchange.ownerId === userId && <ActionButton variant="outlined" onClick={() => onAction(exchange.id, 'accept')}>Accept</ActionButton>}
            {exchange.status === 'accepted' && exchange.ownerId === userId && <ActionButton variant="contained" onClick={() => onAction(exchange.id, 'complete')}>Complete</ActionButton>}
            {(exchange.status === 'requested' || exchange.status === 'accepted') && <ActionButton variant="text" onClick={() => onAction(exchange.id, 'cancel')}>Cancel</ActionButton>}
          </Stack>
        </ContentSurface>
      ))}
    </Stack>
  )
}
