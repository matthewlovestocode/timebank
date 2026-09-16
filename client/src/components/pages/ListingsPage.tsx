import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ListingManager } from '../marketplace/ListingManager'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useCategories } from '../../hooks/useCategories'
import { useMarketplaceActions } from '../../hooks/useMarketplaceActions'
import { useMyListings } from '../../hooks/useMyListings'

export function ListingsPage({ navigation }: { navigation: ReactNode }) {
  const { categories } = useCategories(clientConfig.apiUrl)
  const { listings, reload } = useMyListings(clientConfig.apiUrl)
  const { createListing, status } = useMarketplaceActions(clientConfig.apiUrl)
  const create = async (input: Parameters<typeof createListing>[0]) => { const result = await createListing(input); if (result) await reload(); return result }
  return <PageLayout navigation={navigation}><Box sx={{ p: { xs: 3, sm: 6 } }}><ListingManager categories={categories} listings={listings} onCreate={create} />{status && <Typography sx={{ mt: 2 }}>{status}</Typography>}</Box></PageLayout>
}
