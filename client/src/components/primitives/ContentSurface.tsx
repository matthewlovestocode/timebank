import { Paper, type PaperProps } from '@mui/material'

export function ContentSurface({ sx, ...props }: PaperProps) {
  return <Paper {...props} elevation={0} sx={{ borderRadius: 3, ...sx }} />
}
