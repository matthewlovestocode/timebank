import type { ReactNode } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { ContentSurface } from '../primitives/ContentSurface'
import { ActionButton } from '../primitives/ActionButton'
import { clientConfig } from '../../config/env'
import { useListing } from '../../hooks/useListing'
import { useExchangeRequest } from '../../hooks/useExchangeRequest'
import type { AuthUser } from '../../hooks/useDemoAuth'

function credits(minutes: number | null) {
  if (minutes === null) return 'Gift'
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
}

export function ListingDetailPage({ navigation, user }: { navigation: ReactNode; user: AuthUser | null }) {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { listing, status } = useListing(clientConfig.apiUrl, listingId)
  const exchange = useExchangeRequest(clientConfig.apiUrl)
  const request = async () => {
    if (!user) { navigate('/sign-in'); return }
    await exchange.requestExchange(listing!.id)
  }
  return <PageLayout navigation={navigation}><Box sx={{ flex: 1, p: { xs: 3, sm: 6 } }}><Stack spacing={3} sx={{ maxWidth: 760 }}>
    <ActionButton variant="text" onClick={() => navigate('/dashboard')}>Back to marketplace</ActionButton>
    {!listing ? <Typography color="text.secondary">{status}</Typography> : <ContentSurface sx={{ p: { xs: 3, sm: 4 } }}><Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Typography variant="h4" component="h1">{listing.title}</Typography><Chip label={listing.kind} size="small" /></Stack>
      <Typography color="text.secondary">{listing.description}</Typography><Typography variant="h6">{credits(listing.creditMinutes)}</Typography>
      {listing.ownerId !== user?.id && <ActionButton variant="contained" onClick={request}>Request listing</ActionButton>}
      {exchange.status && <Typography color="text.secondary">{exchange.status}</Typography>}
    </Stack></ContentSurface>}
  </Stack></Box></PageLayout>
}
