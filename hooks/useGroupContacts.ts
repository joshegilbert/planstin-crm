'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { GroupContact } from '@/types'

async function fetchContacts(groupId: string): Promise<GroupContact[]> {
  const res = await fetch(`/api/contacts/${groupId}`)
  if (!res.ok) return []
  return res.json()
}

export function useGroupContacts(groupId: string) {
  return useQuery({
    queryKey: ['contacts', groupId],
    queryFn: () => fetchContacts(groupId),
    enabled: !!groupId,
  })
}

export function useAddContact(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<GroupContact, 'id' | 'groupId' | 'createdAt'>) =>
      fetch(`/api/contacts/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || `Failed (${r.status})`)
        return data
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts', groupId] }),
  })
}

export function useUpdateContact(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contactId, patch }: { contactId: string; patch: Partial<GroupContact> }) =>
      fetch(`/api/contacts/${groupId}/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts', groupId] }),
  })
}

export function useDeleteContact(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (contactId: string) =>
      fetch(`/api/contacts/${groupId}/${contactId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (contactId) => {
      await qc.cancelQueries({ queryKey: ['contacts', groupId] })
      const prev = qc.getQueryData<GroupContact[]>(['contacts', groupId])
      qc.setQueryData<GroupContact[]>(['contacts', groupId], (old) =>
        old ? old.filter((c) => c.id !== contactId) : old,
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['contacts', groupId], ctx.prev)
    },
  })
}
