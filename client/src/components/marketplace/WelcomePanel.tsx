import { Box, Stack, Typography } from '@mui/material'
import { ContentSurface } from '../primitives/ContentSurface'

export function WelcomePanel() {
  return (
    <ContentSurface sx={{ flex: 1, width: '100%', borderRadius: 0, p: { xs: 3, sm: 6 } }}>
      <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Timebank
          </Typography>
          <Typography color="text.secondary">
            A local marketplace where every exchange is valued in time.
          </Typography>
        </Box>
        <Typography color="text.secondary">
          Share items, offer services, and build credit through your community.
        </Typography>
      </Stack>
    </ContentSurface>
  )
}
