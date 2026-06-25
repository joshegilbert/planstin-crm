'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Group, Workflow, WorkflowTemplate } from '@/types'
import { todayISO } from '@/lib/dates'

function patchGroupWorkflows(group: Group | undefined, updater: (wfs: Workflow[]) => Workflow[]): Group | undefined {
  if (!group) return group
  return { ...group, workflows: updater(group.workflows || []) }
}

export function useAttachWorkflow(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      template,
      anchorDate,
    }: {
      template: WorkflowTemplate
      anchorDate: string | null
    }) =>
      fetch(`/api/workflows/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, template, anchorDate }),
      }).then((r) => r.json()),
    onSuccess: (newWf) => {
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) => [...wfs, newWf]),
      )
      qc.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useRemoveWorkflow(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (workflowId: string) =>
      fetch(`/api/workflows/${groupId}/${workflowId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (workflowId) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) => wfs.filter((w) => w.id !== workflowId)),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}

export function useToggleTask(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, completedDate }: { taskId: string; completedDate: string | null }) =>
      fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDate }),
      }).then((r) => r.json()),
    onMutate: async ({ taskId, completedDate }) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) =>
          wfs.map((w) => ({
            ...w,
            sections: w.sections.map((sec) => ({
              ...sec,
              tasks: sec.tasks.map((t) =>
                t.id === taskId ? { ...t, completedDate } : t,
              ),
            })),
          })),
        ),
      )
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}

export function useUpdateTask(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, patch }: { taskId: string; patch: Record<string, unknown> }) =>
      fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).then((r) => r.json()),
    onMutate: async ({ taskId, patch }) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) =>
          wfs.map((w) => ({
            ...w,
            sections: w.sections.map((sec) => ({
              ...sec,
              tasks: sec.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
            })),
          })),
        ),
      )
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}

export function useAddTask(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      workflowId,
      sectionName,
      sectionOrder,
      taskOrder,
    }: {
      workflowId: string
      sectionName: string
      sectionOrder: number
      taskOrder: number
    }) =>
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, sectionName, sectionOrder, taskOrder }),
      }).then((r) => r.json()),
    onSuccess: (newTask) => {
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) =>
          wfs.map((w) =>
            w.id !== newTask.workflowId
              ? w
              : {
                  ...w,
                  sections: w.sections.map((sec) =>
                    sec.name !== newTask.sectionName
                      ? sec
                      : { ...sec, tasks: [...sec.tasks, newTask] },
                  ),
                },
          ),
        ),
      )
    },
  })
}

export function useDeleteTask(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }).then((r) => r.json()),
    onMutate: async (taskId) => {
      await qc.cancelQueries({ queryKey: ['group', groupId] })
      const prev = qc.getQueryData<Group>(['group', groupId])
      qc.setQueryData<Group>(['group', groupId], (old) =>
        patchGroupWorkflows(old, (wfs) =>
          wfs.map((w) => ({
            ...w,
            sections: w.sections.map((sec) => ({
              ...sec,
              tasks: sec.tasks.filter((t) => t.id !== taskId),
            })),
          })),
        ),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['group', groupId], ctx.prev)
    },
  })
}
