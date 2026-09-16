import { Button, type ButtonProps } from '@mui/material'

export function ActionButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, ...sx }}
    />
  )
}
