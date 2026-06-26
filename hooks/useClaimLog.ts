'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ClaimLogEntry } from '@/types'

async function fetchClaimLog(groupId: string): Promise<ClaimLogEntry[]> {
  const res = await fetch(`/api/claim-log/${groupId}`)
  if (!res.ok) return []
  return res.json()
}

export function useClaimLog(groupId: string) {
  return useQuery({
    queryKey: ['claim-log', groupId],
    queryFn: () => fetchClaimLog(groupId),
    enabled: !!groupId,
  })
}

export function useAddClaimEntry(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      logDate,
      claimsPaid,
      claimsFund,
      note,
    }: {
      logDate: string
      claimsPaid: number
      claimsFund: number
      note?: string
    }) =>
      fetch(`/api/claim-log/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logDate, claimsPaid, claimsFund, note }),
      }).then((r) => r.json()),
    onSuccess: (newEntry: ClaimLogEntry) => {
      qc.setQueryData<ClaimLogEntry[]>(['claim-log', groupId], (old) =>
        old ? [newEntry, ...old] : [newEntry],
      )
    },
  })
}

export function useDeleteClaimEntry(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) =>
      fetch(`/api/claim-log/${groupId}/${entryId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (entryId) => {
      await qc.cancelQueries({ queryKey: ['claim-log', groupId] })
      const prev = qc.getQueryData<ClaimLogEntry[]>(['claim-log', groupId])
      qc.setQueryData<ClaimLogEntry[]>(['claim-log', groupId], (old) =>
        old ? old.filter((e) => e.id !== entryId) : old,
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['claim-log', groupId], ctx.prev)
    },
  })
}
