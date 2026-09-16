import type { ReactNode } from 'react'
import { AppBar, Toolbar } from '@mui/material'

type NavigationSurfaceProps = {
  children: ReactNode
}

export function NavigationSurface({ children }: NavigationSurfaceProps) {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar disableGutters sx={{ minHeight: 56, gap: 1, px: { xs: 2, sm: 4 } }}>
        {children}
      </Toolbar>
    </AppBar>
  )
}
