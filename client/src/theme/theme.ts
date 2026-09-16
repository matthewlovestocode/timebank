import { createTheme, type PaletteMode } from '@mui/material'

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#2e5e4e' : '#80c6a9' },
      background: {
        default: mode === 'light' ? '#f7f8f6' : '#121613',
        paper: mode === 'light' ? '#ffffff' : '#1a211d',
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.15 },
      h3: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2 },
      h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25 },
      body1: { fontSize: '1rem', lineHeight: 1.55 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  })
}
