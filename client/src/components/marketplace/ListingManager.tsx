import { useState } from 'react'
import { MenuItem, Stack, Typography } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { ContentSurface } from '../primitives/ContentSurface'
import { InputField } from '../primitives/InputField'
import type { Category } from '../../hooks/useCategories'
import type { Listing } from '../../hooks/useListings'

type ListingManagerProps = {
  categories: Category[]
  listings: Listing[]
  onCreate: (input: { categoryId: string; kind: 'item' | 'service'; title: string; description: string; creditMinutes: number | null }) => Promise<boolean>
}

export function ListingManager({ categories, listings, onCreate }: ListingManagerProps) {
  const [kind, setKind] = useState<'item' | 'service'>('service')
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [credits, setCredits] = useState('')
  const availableCategories = categories.filter((category) => Array.isArray(category.appliesTo) && category.appliesTo.includes(kind))

  const submit = async () => {
    const created = await onCreate({ categoryId, kind, title, description, creditMinutes: credits ? Number(credits) * 60 : null })
    if (created) { setTitle(''); setDescription(''); setCredits('') }
  }

  return <Stack spacing={3} sx={{ width: '100%', maxWidth: 960 }}>
    <Typography variant="h4" component="h1">My listings</Typography>
    <ContentSurface sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <Typography variant="h6">Create a listing</Typography>
        <InputField select label="Offering type" value={kind} onChange={(event) => { setKind(event.target.value as 'item' | 'service'); setCategoryId('') }}>
          <MenuItem value="service">Service</MenuItem><MenuItem value="item">Item</MenuItem>
        </InputField>
        <InputField select label="Category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          {availableCategories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
        </InputField>
        <InputField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <InputField label="Description" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        <InputField label="Time-credit value in hours, or leave blank to gift" type="number" value={credits} onChange={(event) => setCredits(event.target.value)} />
        <ActionButton variant="contained" onClick={submit} disabled={!categoryId || !title || !description}>Publish listing</ActionButton>
      </Stack>
    </ContentSurface>
    {listings.map((listing) => <ContentSurface key={listing.id} sx={{ p: 2.5 }}><Typography sx={{ fontWeight: 700 }}>{listing.title}</Typography><Typography color="text.secondary">{listing.status}</Typography></ContentSurface>)}
  </Stack>
}
