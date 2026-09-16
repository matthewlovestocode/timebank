import { TextField, type TextFieldProps } from '@mui/material'

export function InputField({ sx, ...props }: TextFieldProps) {
  return <TextField {...props} size="small" sx={{ minWidth: 0, ...sx }} />
}
