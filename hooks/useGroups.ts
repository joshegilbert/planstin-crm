'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Group } from '@/types'

async function fetchGroups(): Promise<Group[]> {
  const res = await fetch('/api/groups')
  if (!res.ok) throw new Error('Failed to fetch groups')
  return res.json()
}

export function useGroups() {
  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      groupName: string
      status: string
      renewalDate?: string
      employees?: number
      currentBM?: string
    }) =>
      fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}

export function useUpdateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Group> }) =>
      fetch(`/api/groups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).then((r) => r.json()),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['groups'] })
      await qc.cancelQueries({ queryKey: ['group', id] })
      const prevGroups = qc.getQueryData<Group[]>(['groups'])
      const prevGroup = qc.getQueryData<Group>(['group', id])

      qc.setQueryData<Group[]>(['groups'], (old) =>
        old ? old.map((g) => (g.id === id ? { ...g, ...patch } : g)) : old,
      )
      qc.setQueryData<Group>(['group', id], (old) => (old ? { ...old, ...patch } : old))

      return { prevGroups, prevGroup }
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prevGroups) qc.setQueryData(['groups'], ctx.prevGroups)
      if (ctx?.prevGroup) qc.setQueryData(['group', id], ctx.prevGroup)
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: ['groups'] })
      qc.invalidateQueries({ queryKey: ['group', id] })
    },
  })
}

export function useDeleteGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/groups/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}
