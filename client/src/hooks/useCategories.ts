import { useCallback, useEffect, useState } from 'react'

export type Category = { id: string; name: string; appliesTo: Array<'item' | 'service'> }

export function useCategories(apiUrl: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const reload = useCallback(
    () => fetch(`${apiUrl}/marketplace/categories`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load categories')
        return response.json() as Promise<unknown>
      })
      .then((data) => setCategories(Array.isArray(data) ? data as Category[] : []))
      .catch(() => setCategories([])),
    [apiUrl],
  )
  useEffect(() => { void reload() }, [reload])
  return { categories, reload }
}
