'use client'
import { useQuery } from '@tanstack/react-query'
import type { Group } from '@/types'

async function fetchGroup(id: string): Promise<Group> {
  const res = await fetch(`/api/groups/${id}`)
  if (!res.ok) throw new Error('Failed to fetch group')
  return res.json()
}

export function useGroup(id: string | null) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => fetchGroup(id!),
    enabled: !!id,
  })
}
