import { IconButton, type IconButtonProps } from '@mui/material'

export function IconActionButton({ sx, ...props }: IconButtonProps) {
  return <IconButton {...props} sx={{ borderRadius: 2, ...sx }} />
}
