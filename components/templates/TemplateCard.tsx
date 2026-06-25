'use client'

import type { WorkflowTemplate, TemplateSection } from '@/types'

interface TemplateCardProps {
  template: WorkflowTemplate
  isEditing: boolean
  onToggleEdit: () => void
  onUpdate: (patch: Partial<WorkflowTemplate>) => void
  onDelete: () => void
}

function typeBadge(type: string, builtin: boolean) {
  if (!builtin) return { label: 'Custom', className: 'bg-canvas-subtle text-ink-faint' }
  switch (type) {
    case 'oe':
      return { label: 'Open Enrollment', className: 'bg-accent/10 text-accent' }
    case 'renewal':
      return { label: 'Renewal', className: 'bg-accent/10 text-accent' }
    case 'transition':
      return { label: 'Transition', className: 'bg-accent/10 text-accent' }
    default:
      return { label: type, className: 'bg-canvas-subtle text-ink-faint' }
  }
}

function totalTasks(sections: TemplateSection[]) {
  return sections.reduce((sum, s) => sum + s.tasks.length, 0)
}

function cloneSections(sections: TemplateSection[]): TemplateSection[] {
  return sections.map((s) => ({
    name: s.name,
    tasks: s.tasks.map((t) => ({ label: t.label, offsetDays: t.offsetDays })),
  }))
}

export default function TemplateCard({
  template,
  isEditing,
  onToggleEdit,
  onUpdate,
  onDelete,
}: TemplateCardProps) {
  const badge = typeBadge(template.type, template.builtin)
  const showOffset = template.anchor === 'renewal' || template.anchor === 'oe'

  // -- helpers that produce a new sections array and call onUpdate ----------------

  function updateSectionName(si: number, value: string) {
    const sections = cloneSections(template.sections)
    sections[si].name = value
    onUpdate({ sections })
  }

  function updateTaskLabel(si: number, ti: number, value: string) {
    const sections = cloneSections(template.sections)
    sections[si].tasks[ti].label = value
    onUpdate({ sections })
  }

  function updateTaskOffset(si: number, ti: number, raw: string) {
    const sections = cloneSections(template.sections)
    sections[si].tasks[ti].offsetDays = raw === '' ? null : parseInt(raw, 10)
    onUpdate({ sections })
  }

  function addTask(si: number) {
    const sections = cloneSections(template.sections)
    sections[si].tasks.push({ label: 'New task', offsetDays: null })
    onUpdate({ sections })
  }

  function removeTask(si: number, ti: number) {
    const sections = cloneSections(template.sections)
    sections[si].tasks.splice(ti, 1)
    onUpdate({ sections })
  }

  function addSection() {
    const sections = cloneSections(template.sections)
    sections.push({ name: 'New section', tasks: [] })
    onUpdate({ sections })
  }

  function removeSection(si: number) {
    const sections = cloneSections(template.sections)
    sections.splice(si, 1)
    onUpdate({ sections })
  }

  function handleDelete() {
    if (window.confirm(`Delete template "${template.title}"? This cannot be undone.`)) {
      onDelete()
    }
  }

  // ---------------------------------------------------------------------------
  // VIEW (not editing)
  // ---------------------------------------------------------------------------
  if (!isEditing) {
    const taskCount = totalTasks(template.sections)
    const sectionCount = template.sections.length

    return (
      <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-ink leading-snug">{template.title}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-faint">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'} across{' '}
              {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
            </p>
          </div>
          <button
            onClick={onToggleEdit}
            className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Edit →
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // EDIT VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      {/* Title */}
      <div className="mb-5">
        <input
          type="text"
          value={template.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full text-xl font-semibold text-ink bg-transparent border-b border-line focus:border-accent focus:outline-none pb-1 transition-colors"
          placeholder="Template title"
        />
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {template.sections.map((section, si) => (
          <div key={si} className="rounded-xl border border-line bg-canvas-subtle p-4">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={section.name}
                onChange={(e) => updateSectionName(si, e.target.value)}
                className="flex-1 text-sm font-semibold text-ink bg-transparent border-b border-line focus:border-accent focus:outline-none pb-0.5 transition-colors"
                placeholder="Section name"
              />
              <button
                onClick={() => removeSection(si)}
                className="shrink-0 text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                × Remove section
              </button>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {section.tasks.map((task, ti) => (
                <div key={ti} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={task.label}
                    onChange={(e) => updateTaskLabel(si, ti, e.target.value)}
                    className="flex-1 text-sm text-ink bg-canvas rounded-lg border border-line px-2.5 py-1.5 focus:border-accent focus:outline-none transition-colors min-w-0"
                    placeholder="Task label"
                  />
                  {showOffset && (
                    <input
                      type="number"
                      value={task.offsetDays ?? ''}
                      onChange={(e) => updateTaskOffset(si, ti, e.target.value)}
                      className="w-24 shrink-0 text-sm text-ink bg-canvas rounded-lg border border-line px-2.5 py-1.5 focus:border-accent focus:outline-none transition-colors text-right"
                      placeholder="days before"
                    />
                  )}
                  <button
                    onClick={() => removeTask(si, ti)}
                    className="shrink-0 text-ink-faint hover:text-red-400 transition-colors text-base leading-none"
                    aria-label="Remove task"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add task */}
            <button
              onClick={() => addTask(si)}
              className="mt-3 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
            >
              + Add task
            </button>
          </div>
        ))}
      </div>

      {/* Add section */}
      <button
        onClick={addSection}
        className="mt-4 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
      >
        + Add section
      </button>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-4">
        <button
          onClick={onToggleEdit}
          className="text-sm font-medium text-ink-faint hover:text-ink transition-colors"
        >
          ← Done
        </button>
        {!template.builtin && (
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
          >
            Delete template
          </button>
        )}
      </div>
    </div>
  )
}
