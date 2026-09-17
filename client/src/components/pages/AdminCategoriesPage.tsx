import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { CategoryManager } from '../marketplace/CategoryManager'
import { PageLayout } from '../layout/PageLayout'
import { clientConfig } from '../../config/env'
import { useCategories } from '../../hooks/useCategories'
import { useMarketplaceActions } from '../../hooks/useMarketplaceActions'

export function AdminCategoriesPage({ navigation }: { navigation: ReactNode }) {
  const { categories, reload } = useCategories(clientConfig.apiUrl)
  const { createCategory, status } = useMarketplaceActions(clientConfig.apiUrl)
  const create = async (name: string, appliesTo: Array<'item' | 'service'>) => { const result = await createCategory(name, appliesTo); if (result) await reload(); return result }
  return (
    <PageLayout navigation={navigation}>
      <title>Categories | Admin | Timebank</title>
      <Box sx={{ p: { xs: 3, sm: 6 } }}>
        <CategoryManager categories={categories} onCreate={create} />
        {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
      </Box>
    </PageLayout>
  )
}
