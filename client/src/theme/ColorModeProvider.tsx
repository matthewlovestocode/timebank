import { useMemo, useState, type ReactNode } from 'react'
import { CssBaseline, ThemeProvider, type PaletteMode } from '@mui/material'
import { ColorModeContext } from './colorModeContext'
import { createAppTheme } from './theme'

function initialColorMode(): PaletteMode {
  const savedMode = localStorage.getItem('timebank.colorMode')
  if (savedMode === 'light' || savedMode === 'dark') return savedMode

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(initialColorMode)
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const toggleColorMode = () => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('timebank.colorMode', nextMode)
      return nextMode
    })
  }

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
