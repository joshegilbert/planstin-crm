'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WorkflowTemplate, TemplateSection } from '@/types'
import { DEFAULT_WORKFLOW_TEMPLATES } from '@/constants/workflow-templates'

async function fetchTemplates(): Promise<WorkflowTemplate[]> {
  const res = await fetch('/api/templates')
  if (!res.ok) return DEFAULT_WORKFLOW_TEMPLATES
  return res.json()
}

export function useTemplates() {
  return useQuery({ queryKey: ['templates'], queryFn: fetchTemplates })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<WorkflowTemplate> }) =>
      fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).then((r) => r.json()),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['templates'] })
      const prev = qc.getQueryData<WorkflowTemplate[]>(['templates'])
      qc.setQueryData<WorkflowTemplate[]>(['templates'], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, ...patch } : t)) : old,
      )
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['templates'], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (title: string) =>
      fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sections: [{ name: 'Tasks', tasks: [] }] }),
      }).then((r) => r.json()),
    onSuccess: (newTpl) => {
      qc.setQueryData<WorkflowTemplate[]>(['templates'], (old) => [...(old || []), newTpl])
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/templates/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['templates'] })
      const prev = qc.getQueryData<WorkflowTemplate[]>(['templates'])
      qc.setQueryData<WorkflowTemplate[]>(['templates'], (old) =>
        old ? old.filter((t) => t.id !== id) : old,
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['templates'], ctx.prev)
    },
  })
}

export function useResetTemplates() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      // Delete all custom templates and re-seed built-ins via API
      const templates = qc.getQueryData<WorkflowTemplate[]>(['templates']) || []
      const custom = templates.filter((t) => !t.builtin)
      await Promise.all(
        custom.map((t) => fetch(`/api/templates/${t.id}`, { method: 'DELETE' })),
      )
      // Re-seed built-ins if needed
      for (const tpl of DEFAULT_WORKFLOW_TEMPLATES) {
        await fetch(`/api/templates/${tpl.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: tpl.title, sections: tpl.sections }),
        })
      }
      return fetch('/api/templates').then((r) => r.json())
    },
    onSuccess: (data) => qc.setQueryData(['templates'], data),
  })
}
