import { z } from 'zod'

const kind = z.enum(['item', 'service'])

export const CreateCategoryContract = z.object({
  name: z.string().trim().min(1),
  appliesTo: z.array(kind).min(1),
})

export const CreateListingContract = z.object({
  categoryId: z.uuid(),
  kind,
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  creditMinutes: z.number().int().positive().nullable(),
})
