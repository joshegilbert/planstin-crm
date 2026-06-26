'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CheckInEntry } from '@/types'

async function fetchHistory(groupId: string): Promise<CheckInEntry[]> {
  const res = await fetch(`/api/check-ins/${groupId}`)
  if (!res.ok) return []
  return res.json()
}

export function useCheckInHistory(groupId: string) {
  return useQuery({
    queryKey: ['check-ins', groupId],
    queryFn: () => fetchHistory(groupId),
    enabled: !!groupId,
  })
}

export function useLogCheckIn(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ checkedIn, source }: { checkedIn: string; source?: string }) =>
      fetch(`/api/check-ins/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedIn, source: source || 'manual' }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['check-ins', groupId] }),
  })
}

export function useDeleteCheckIn(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (checkInId: string) =>
      fetch(`/api/check-ins/${groupId}/${checkInId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (checkInId) => {
      await qc.cancelQueries({ queryKey: ['check-ins', groupId] })
      const prev = qc.getQueryData<CheckInEntry[]>(['check-ins', groupId])
      qc.setQueryData<CheckInEntry[]>(['check-ins', groupId], (old) =>
        old ? old.filter((e) => e.id !== checkInId) : old,
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['check-ins', groupId], ctx.prev)
    },
  })
}
