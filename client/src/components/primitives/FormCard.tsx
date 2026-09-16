import type { ReactNode } from 'react'
import { ContentSurface } from './ContentSurface'

type FormCardProps = {
  children: ReactNode
}

export function FormCard({ children }: FormCardProps) {
  return (
    <ContentSurface
      sx={{ width: '100%', maxWidth: 440, borderRadius: 3, p: { xs: 3, sm: 5 } }}
    >
      {children}
    </ContentSurface>
  )
}
