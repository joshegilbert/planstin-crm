'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Group, Note, NoteType } from '@/types'
import { todayISO } from '@/lib/dates'

export function useAddNote(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ text, type, date }: { text: string; type: NoteType; date?: string }) =>
      fetch(`/api/notes/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, date: date || todayISO() }),
      }).then((r) => r.json()),
    onSuccess: (newNote: Note) => {
      qc.setQueryData<Group>(['group', groupId], (old) => {
        if (!old) return old
        return { ...old, notes: [newNote, ...(old.notes || [])] }
      })
    },
  })
}

export function useUpdateNote(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, text }: { noteId: string; text: string }) =>
      fetch(`/api/notes/${groupId}/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      }).then((r) => r.json()),
    onMutate: async ({ noteId, text }) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) => {
        if (!old) return old
        return {
          ...old,
          notes: (old.notes || []).map((n) => (n.id === noteId ? { ...n, text } : n)),
        }
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}

export function useDeleteNote(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) =>
      fetch(`/api/notes/${groupId}/${noteId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (noteId) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) => {
        if (!old) return old
        return { ...old, notes: (old.notes || []).filter((n) => n.id !== noteId) }
      })
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}
