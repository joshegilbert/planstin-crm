'use client'
import { useState } from 'react'
import type { Group, WorkflowTemplate } from '@/types'
import { useAttachWorkflow, useRemoveWorkflow } from '@/hooks/useWorkflows'
import { WorkflowCard } from './WorkflowCard'

interface WorkflowsSectionProps {
  group: Group
  templates: WorkflowTemplate[]
}

export function WorkflowsSection({ group, templates }: WorkflowsSectionProps) {
  const attachWorkflow = useAttachWorkflow(group.id)
  const removeWorkflow = useRemoveWorkflow(group.id)
  const [selecting, setSelecting] = useState(false)

  const workflows = group.workflows || []

  function getAnchorDate(template: WorkflowTemplate): string | null {
    if (template.anchor === 'oe') {
      return group.oeStartDate || group.renewalDate || null
    }
    if (template.anchor === 'renewal') {
      return group.renewalDate || null
    }
    // transition or null anchor
    return null
  }

  function handleTemplateSelect(templateId: string) {
    if (!templateId) {
      setSelecting(false)
      return
    }
    const template = templates.find((t) => t.id === templateId)
    if (!template) return
    const anchorDate = getAnchorDate(template)
    attachWorkflow.mutate({ template, anchorDate })
    setSelecting(false)
  }

  function handleRemove(workflowId: string) {
    removeWorkflow.mutate(workflowId)
  }

  const hasRenewalWf = workflows.some((w) => w.type === 'renewal')
  const renewalDate = group.renewalDate
    ? new Date(group.renewalDate + 'T00:00:00')
    : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const renewalDays = renewalDate
    ? Math.round((renewalDate.getTime() - today.getTime()) / 86400000)
    : null
  const showRenewalSuggest =
    !hasRenewalWf && renewalDays != null && renewalDays >= 0 && renewalDays <= 90

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink text-sm">Workflows</h2>
        <div className="flex items-center gap-2">
          {selecting ? (
            <select
              autoFocus
              onChange={(e) => handleTemplateSelect(e.target.value)}
              onBlur={() => setSelecting(false)}
              className="text-sm border border-line rounded-lg px-2 py-1 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              defaultValue=""
            >
              <option value="">Select a template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          ) : (
            <button
              onClick={() => setSelecting(true)}
              disabled={attachWorkflow.isPending}
              className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-accent hover:border-accent transition-colors"
            >
              + Attach workflow
            </button>
          )}
        </div>
      </div>

      {/* Renewal suggestion */}
      {showRenewalSuggest && (
        <div
          className="rounded-xl p-3 mb-4 border flex items-center justify-between gap-3"
          style={{
            background: 'oklch(0.95 0.03 250)',
            borderColor: 'oklch(0.85 0.07 250)',
          }}
        >
          <span className="text-xs" style={{ color: 'oklch(0.44 0.11 255)' }}>
            Renewal is in {renewalDays} days — start the renewal workflow?
          </span>
          <button
            onClick={() => setSelecting(true)}
            className="text-xs font-medium px-2 py-1 rounded-lg"
            style={{
              background: 'oklch(0.44 0.11 255)',
              color: '#fff',
            }}
          >
            Start workflow
          </button>
        </div>
      )}

      {/* Workflow list */}
      {workflows.length === 0 ? (
        <div className="text-center py-6">
          <button
            onClick={() => setSelecting(true)}
            className="text-sm text-ink-faint hover:text-accent transition-colors"
          >
            + Attach a workflow to get started
          </button>
        </div>
      ) : (
        workflows.map((wf) => (
          <WorkflowCard
            key={wf.id}
            workflow={wf}
            group={group}
            onRemove={handleRemove}
          />
        ))
      )}
    </div>
  )
}
