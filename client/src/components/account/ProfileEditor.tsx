import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { ContentSurface } from '../primitives/ContentSurface'
import { InputField } from '../primitives/InputField'
import type { AuthUser, ProfileInput } from '../../hooks/useDemoAuth'

type ProfileEditorProps = {
  user: AuthUser | null
  status: string
  onSave: (input: ProfileInput) => Promise<boolean>
}

export function ProfileEditor({ user, status, onSave }: ProfileEditorProps) {
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [location, setLocation] = useState(user?.location ?? '')

  if (!user) return <Typography color="text.secondary">Please sign in to edit your profile.</Typography>

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 720 }}>
      <Typography variant="h4" component="h1">Your profile</Typography>
      <ContentSurface sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2}>
          <InputField label="Display name" value={name} onChange={(event) => setName(event.target.value)} />
          <InputField label="Location" value={location} onChange={(event) => setLocation(event.target.value)} helperText="Optional—share only as much as feels right." />
          <InputField label="About you" value={bio} onChange={(event) => setBio(event.target.value)} multiline minRows={5} slotProps={{ htmlInput: { maxLength: 500 } }} helperText={`${bio.length}/500`} />
          <ActionButton variant="contained" onClick={() => onSave({ name, bio, location })} disabled={!name.trim()}>
            Save profile
          </ActionButton>
          {status !== 'Not signed in' && <Typography color="text.secondary">{status}</Typography>}
        </Stack>
      </ContentSurface>
    </Stack>
  )
}
