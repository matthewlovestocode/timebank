import { Stack, Typography } from '@mui/material'
import { ContentSurface } from '../primitives/ContentSurface'
import type { DashboardData } from '../../hooks/useDashboard'

type AccountDashboardProps = {
  dashboard: DashboardData | null
  status: string
}

function formatCredits(minutes: number) {
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
}

export function AccountDashboard({ dashboard, status }: AccountDashboardProps) {
  if (!dashboard) {
    return <Typography color="text.secondary">{status}</Typography>
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 960 }}>
      <Typography variant="h3" component="h1">
        Welcome, {dashboard.user.name}
      </Typography>
      <ContentSurface sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Available time credits
          </Typography>
          <Typography variant="h2">{formatCredits(dashboard.balanceMinutes)}</Typography>
          <Typography color="text.secondary">
            Your services and items will appear here as the marketplace takes shape.
          </Typography>
        </Stack>
      </ContentSurface>
    </Stack>
  )
}
