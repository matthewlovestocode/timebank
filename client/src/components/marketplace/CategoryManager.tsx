import { useState } from 'react'
import { MenuItem, Stack, Typography } from '@mui/material'
import { ActionButton } from '../primitives/ActionButton'
import { ContentSurface } from '../primitives/ContentSurface'
import { InputField } from '../primitives/InputField'
import type { Category } from '../../hooks/useCategories'

export function CategoryManager({ categories, onCreate }: { categories: Category[]; onCreate: (name: string, appliesTo: Array<'item' | 'service'>) => Promise<boolean> }) {
  const [name, setName] = useState('')
  const [appliesTo, setAppliesTo] = useState<'item' | 'service'>('service')
  const submit = async () => { if (await onCreate(name, [appliesTo])) setName('') }
  return <Stack spacing={3} sx={{ width: '100%', maxWidth: 960 }}>
    <Typography variant="h4" component="h1">Category management</Typography>
    <ContentSurface sx={{ p: { xs: 3, sm: 4 } }}><Stack spacing={2} sx={{ maxWidth: 400 }}>
      <InputField label="Category name" value={name} onChange={(event) => setName(event.target.value)} />
      <InputField select label="Applies to" value={appliesTo} onChange={(event) => setAppliesTo(event.target.value as 'item' | 'service')}><MenuItem value="service">Services</MenuItem><MenuItem value="item">Items</MenuItem></InputField>
      <ActionButton variant="contained" disabled={!name} onClick={submit}>Create category</ActionButton>
    </Stack></ContentSurface>
    {categories.map((category) => <ContentSurface key={category.id} sx={{ p: 2.5 }}>{category.name}</ContentSurface>)}
  </Stack>
}
