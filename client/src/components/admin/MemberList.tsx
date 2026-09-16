import { Chip, Stack, Typography } from '@mui/material'
import { ContentSurface } from '../primitives/ContentSurface'
import type { AuthUser } from '../../hooks/useDemoAuth'

export function MemberList({ members }: { members: AuthUser[] }) {
  return <Stack spacing={2} sx={{ width: '100%', maxWidth: 960 }}>
    <Typography variant="h4" component="h1">Member management</Typography>
    {members.map((member) => <ContentSurface key={member.id} sx={{ p: 2.5 }}><Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}><Stack><Typography sx={{ fontWeight: 700 }}>{member.name}</Typography><Typography color="text.secondary">{member.email}</Typography></Stack><Chip label={member.role} size="small" /></Stack></ContentSurface>)}
  </Stack>
}
