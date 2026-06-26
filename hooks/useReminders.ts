'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Reminder } from '@/types'

async function fetchReminders(groupId?: string): Promise<Reminder[]> {
  const url = groupId ? `/api/reminders?groupId=${groupId}` : '/api/reminders'
  const res = await fetch(url)
  if (!res.ok) return []
  return res.json()
}

export function useReminders(groupId?: string) {
  return useQuery({
    queryKey: ['reminders', groupId ?? 'all'],
    queryFn: () => fetchReminders(groupId),
  })
}

export function useAddReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      groupId,
      triggerDate,
      note,
    }: {
      groupId?: string | null
      triggerDate: string
      note?: string
    }) =>
      fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupId || null, triggerDate, note }),
      }).then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || `Failed (${r.status})`)
        return data
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['reminders', vars.groupId ?? 'all'] })
      qc.invalidateQueries({ queryKey: ['reminders', 'all'] })
    },
  })
}

export function useUpdateReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: Partial<Pick<Reminder, 'triggerDate' | 'note' | 'completed'>>
    }) =>
      fetch(`/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}

export function useDeleteReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/reminders/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}
