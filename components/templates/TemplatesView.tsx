'use client'

import { useState } from 'react'
import {
  useTemplates,
  useUpdateTemplate,
  useCreateTemplate,
  useDeleteTemplate,
  useResetTemplates,
} from '@/hooks/useTemplates'
import type { WorkflowTemplate } from '@/types'
import TemplateCard from './TemplateCard'

export default function TemplatesView() {
  const { data: templates, isLoading } = useTemplates()
  const updateTemplate = useUpdateTemplate()
  const createTemplate = useCreateTemplate()
  const deleteTemplate = useDeleteTemplate()
  const resetTemplates = useResetTemplates()

  const [editTplId, setEditTplId] = useState<string | null>(null)

  function handleToggleEdit(id: string) {
    setEditTplId((prev) => (prev === id ? null : id))
  }

  function handleUpdate(id: string, patch: Partial<WorkflowTemplate>) {
    updateTemplate.mutate({ id, patch })
  }

  function handleDelete(id: string) {
    deleteTemplate.mutate(id)
    if (editTplId === id) setEditTplId(null)
  }

  async function handleCreate() {
    const result = await createTemplate.mutateAsync('New custom workflow')
    if (result?.id) {
      setEditTplId(result.id)
    }
  }

  function handleReset() {
    if (
      window.confirm(
        'Reset all templates to defaults? This will remove custom templates and restore built-in templates to their original state.',
      )
    ) {
      resetTemplates.mutate(undefined, {
        onSuccess: () => setEditTplId(null),
      })
    }
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="px-8 py-6 max-w-[900px]">
        <div className="mb-6">
          <div className="h-7 w-48 bg-canvas-subtle rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-canvas-subtle rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4 animate-pulse"
          >
            <div className="h-5 w-40 bg-canvas-subtle rounded mb-2" />
            <div className="h-4 w-24 bg-canvas-subtle rounded" />
          </div>
        ))}
      </div>
    )
  }

  const templateList = templates ?? []

  return (
    <div className="px-8 py-6 max-w-[900px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Workflow templates</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Define the sections and tasks used when starting a workflow for a group. Built-in
          templates can be edited but not deleted.
        </p>
      </div>

      {/* Template cards */}
      {templateList.length === 0 ? (
        <p className="text-sm text-ink-faint py-4">No templates found.</p>
      ) : (
        templateList.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            isEditing={editTplId === tpl.id}
            onToggleEdit={() => handleToggleEdit(tpl.id)}
            onUpdate={(patch) => handleUpdate(tpl.id, patch)}
            onDelete={() => handleDelete(tpl.id)}
          />
        ))
      )}

      {/* Bottom actions */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleCreate}
          disabled={createTemplate.isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + New custom workflow
        </button>
        <button
          onClick={handleReset}
          disabled={resetTemplates.isPending}
          className="text-sm text-ink-faint hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetTemplates.isPending ? 'Resetting…' : 'Reset all to defaults'}
        </button>
      </div>
    </div>
  )
}
