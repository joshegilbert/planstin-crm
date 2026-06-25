'use client'
import type { Workflow, Group } from '@/types'
import { fmt } from '@/lib/dates'
import { useAddTask } from '@/hooks/useWorkflows'
import { WorkflowTaskRow } from './WorkflowTaskRow'

interface WorkflowCardProps {
  workflow: Workflow
  group: Group
  onRemove: (workflowId: string) => void
}

export function WorkflowCard({ workflow, group, onRemove }: WorkflowCardProps) {
  const addTask = useAddTask(group.id)

  let totalTasks = 0
  let doneTasks = 0
  workflow.sections.forEach((sec) =>
    sec.tasks.forEach((t) => {
      totalTasks++
      if (t.completedDate) doneTasks++
    }),
  )
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  function handleRemove() {
    if (window.confirm(`Remove workflow "${workflow.title}"?`)) {
      onRemove(workflow.id)
    }
  }

  function handleAddTask(
    sectionName: string,
    sectionOrder: number,
    taskCount: number,
  ) {
    addTask.mutate({
      workflowId: workflow.id,
      sectionName,
      sectionOrder,
      taskOrder: taskCount,
    })
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-ink text-sm">{workflow.title}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <span>started {fmt(workflow.startedDate)}</span>
            <span>
              {doneTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-ink-faint hover:text-red-500 transition-colors text-lg leading-none"
          title="Remove workflow"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="h-1.5 bg-canvas-subtle rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? 'oklch(0.42 0.09 155)' : 'var(--accent)',
              }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      {workflow.sections.map((section, si) => (
        <div key={section.name} className="mb-4 last:mb-0">
          <div className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {section.name}
          </div>
          {section.tasks.map((task) => (
            <WorkflowTaskRow
              key={task.id}
              task={task}
              workflowId={workflow.id}
              groupId={group.id}
            />
          ))}
          <button
            onClick={() => handleAddTask(section.name, si, section.tasks.length)}
            disabled={addTask.isPending}
            className="mt-1 text-xs text-ink-faint hover:text-accent transition-colors"
          >
            + Add task
          </button>
        </div>
      ))}

      {workflow.sections.length === 0 && (
        <p className="text-xs text-ink-faint">No sections in this workflow.</p>
      )}
    </div>
  )
}
