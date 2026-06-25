'use client'
import { useState } from 'react'
import type { WorkflowTask } from '@/types'
import { fmt, daysUntil, todayISO } from '@/lib/dates'
import {
  useToggleTask,
  useUpdateTask,
  useDeleteTask,
} from '@/hooks/useWorkflows'
import { useUIStore } from '@/lib/store'

interface WorkflowTaskRowProps {
  task: WorkflowTask
  workflowId: string
  groupId: string
}

export function WorkflowTaskRow({ task, groupId }: Omit<WorkflowTaskRowProps, 'workflowId'> & { workflowId?: string }) {
  const toggleTask = useToggleTask(groupId)
  const updateTask = useUpdateTask(groupId)
  const deleteTask = useDeleteTask(groupId)
  const expandedTasks = useUIStore((s) => s.expandedTasks)
  const toggleTaskExpanded = useUIStore((s) => s.toggleTaskExpanded)

  const [labelVal, setLabelVal] = useState(task.label)
  const [noteVal, setNoteVal] = useState(task.note)

  const isExpanded = !!expandedTasks[task.id]

  const du = daysUntil(task.dueDate)
  const isOverdue = !task.completedDate && du != null && du < 0
  const isDueSoon = !task.completedDate && du != null && du >= 0 && du <= 7

  const dueDateColor = isOverdue
    ? 'oklch(0.47 0.16 30)'
    : isDueSoon
    ? 'oklch(0.46 0.11 65)'
    : '#8a877f'

  function handleToggle() {
    const newCompleted = task.completedDate ? null : todayISO()
    toggleTask.mutate({ taskId: task.id, completedDate: newCompleted })
  }

  function handleLabelBlur() {
    if (labelVal !== task.label) {
      updateTask.mutate({ taskId: task.id, patch: { label: labelVal } })
    }
  }

  function handleNoteBlur() {
    if (noteVal !== task.note) {
      updateTask.mutate({ taskId: task.id, patch: { note: noteVal } })
    }
  }

  function handleDelete() {
    if (window.confirm(`Delete task "${task.label}"?`)) {
      deleteTask.mutate(task.id)
    }
  }

  return (
    <div className="mb-1">
      {/* Main row */}
      <div className="flex items-center gap-2 py-1 group/row">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className="flex-shrink-0 w-4 h-4 rounded border border-line flex items-center justify-center hover:border-accent transition-colors"
          style={
            task.completedDate
              ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
              : {}
          }
        >
          {task.completedDate && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 10 10"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Label */}
        <span
          className={`flex-1 text-sm min-w-0 truncate ${
            task.completedDate ? 'line-through text-ink-faint' : 'text-ink'
          }`}
        >
          {task.label || 'Untitled task'}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className="text-xs flex-shrink-0" style={{ color: dueDateColor }}>
            {fmt(task.dueDate)}
          </span>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => toggleTaskExpanded(task.id)}
          className="flex-shrink-0 text-xs text-ink-faint hover:text-ink opacity-0 group-hover/row:opacity-100 transition-opacity"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▾' : '▸'}
        </button>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="ml-6 mt-2 mb-3 p-3 rounded-xl border border-line bg-canvas-subtle space-y-3">
          {/* Label */}
          <div>
            <label className="block text-xs text-ink-faint mb-1">Label</label>
            <input
              type="text"
              value={labelVal}
              onChange={(e) => setLabelVal(e.target.value)}
              onBlur={handleLabelBlur}
              className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs text-ink-faint mb-1">Due date</label>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) =>
                updateTask.mutate({
                  taskId: task.id,
                  patch: { dueDate: e.target.value || null },
                })
              }
              className="text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Assigned date */}
          <div>
            <label className="block text-xs text-ink-faint mb-1">Assigned date</label>
            <input
              type="date"
              value={task.assignedDate || ''}
              onChange={(e) =>
                updateTask.mutate({
                  taskId: task.id,
                  patch: { assignedDate: e.target.value || null },
                })
              }
              className="text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Reminder date */}
          <div>
            <label className="block text-xs text-ink-faint mb-1">Reminder date</label>
            <input
              type="date"
              value={task.reminderDate || ''}
              onChange={(e) =>
                updateTask.mutate({
                  taskId: task.id,
                  patch: { reminderDate: e.target.value || null },
                })
              }
              className="text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Completed */}
          <div>
            <span className="text-xs text-ink-faint">
              Completed: {task.completedDate ? fmt(task.completedDate) : '—'}
            </span>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-ink-faint mb-1">Note</label>
            <textarea
              value={noteVal}
              onChange={(e) => setNoteVal(e.target.value)}
              onBlur={handleNoteBlur}
              rows={2}
              placeholder="Add a note..."
              className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Delete task
          </button>
        </div>
      )}
    </div>
  )
}
