import type { ReactNode } from 'react'
import { Box } from '@mui/material'

type PageLayoutProps = {
  children: ReactNode
  navigation: ReactNode
}

export function PageLayout({ children, navigation }: PageLayoutProps) {
  return (
    <Box
      sx={{ minHeight: '100dvh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>{navigation}</Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {children}
      </Box>
    </Box>
  )
}
