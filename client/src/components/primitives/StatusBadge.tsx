import { Chip, type ChipProps } from '@mui/material'

export function StatusBadge({ sx, ...props }: ChipProps) {
  return <Chip {...props} sx={{ fontWeight: 600, ...sx }} />
}
