import { Stack, Typography } from '@mui/material'
import { ContentSurface } from '../primitives/ContentSurface'
import type { LedgerEntry } from '../../hooks/useLedger'

export function LedgerHistory({ entries }: { entries: LedgerEntry[] }) {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 960 }}>
      <Typography variant="h4" component="h1">Ledger history</Typography>
      {entries.map((entry) => (
        <ContentSurface key={entry.id} sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 700 }}>
            {entry.direction === 'credit' ? '+' : '-'}{entry.minutes} minutes
          </Typography>
          <Typography variant="body2" color="text.secondary">{entry.kind.replaceAll('-', ' ')}</Typography>
        </ContentSurface>
      ))}
    </Stack>
  )
}
