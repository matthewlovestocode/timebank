import { Chip, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ContentSurface } from '../primitives/ContentSurface'
import { ActionButton } from '../primitives/ActionButton'
import type { Listing } from '../../hooks/useListings'

type ListingPreviewProps = {
  listings: Listing[]
  viewerId?: string
  onRequest: (listingId: string) => Promise<boolean>
}

function formatCredits(minutes: number | null) {
  if (minutes === null) return 'Gift'
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
}

export function ListingPreview({ listings, viewerId, onRequest }: ListingPreviewProps) {
  const navigate = useNavigate()
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2">
        Marketplace
      </Typography>
      {listings.length === 0 ? (
        <Typography color="text.secondary">No active listings yet.</Typography>
      ) : (
        listings.map((listing) => (
          <ContentSurface
            key={listing.id}
            role="link"
            tabIndex={0}
            onClick={() => navigate(`/marketplace/listings/${listing.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') navigate(`/marketplace/listings/${listing.id}`)
            }}
            sx={{ p: 2.5, cursor: 'pointer', transition: 'box-shadow 160ms ease', '&:hover': { boxShadow: 3 } }}
          >
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{listing.title}</Typography>
                <Chip label={listing.kind} size="small" />
              </Stack>
              <Typography color="text.secondary">{listing.description}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatCredits(listing.creditMinutes)}
              </Typography>
              {listing.ownerId !== viewerId && (
                <ActionButton variant="outlined" onClick={(event) => { event.stopPropagation(); void onRequest(listing.id) }}>
                  Request listing
                </ActionButton>
              )}
            </Stack>
          </ContentSurface>
        ))
      )}
    </Stack>
  )
}
