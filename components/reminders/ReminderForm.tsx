'use client'
import { useState } from 'react'
import { AutoTextarea } from '@/components/detail/NotesSection'

interface ReminderFormProps {
  mode: 'create' | 'edit'
  initialDate: string
  initialNote: string
  initialGroupId?: string | null
  groupLocked?: boolean
  groups?: Array<{ id: string; groupName: string }>
  onSave: (patch: { triggerDate: string; note: string; groupId?: string | null }) => void
  onCancel: () => void
  saving?: boolean
}

export function ReminderForm({
  mode,
  initialDate,
  initialNote,
  initialGroupId = null,
  groupLocked = false,
  groups,
  onSave,
  onCancel,
  saving = false,
}: ReminderFormProps) {
  const [date, setDate] = useState(initialDate)
  const [note, setNote] = useState(initialNote)
  const [groupId, setGroupId] = useState<string | null>(initialGroupId)

  const groupName = groups?.find((g) => g.id === initialGroupId)?.groupName

  function handleSave() {
    if (!date) return
    onSave(
      mode === 'create'
        ? { triggerDate: date, note: note.trim(), groupId }
        : { triggerDate: date, note: note.trim() },
    )
  }

  return (
    <div className="space-y-2 p-3 rounded-xl border border-line bg-canvas-subtle">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <AutoTextarea
        value={note}
        onChange={setNote}
        placeholder="Note (optional)"
        className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {groupLocked ? (
        <p className="text-xs text-ink-faint">{groupName ? `Tied to ${groupName}` : 'Personal reminder'}</p>
      ) : (
        <select
          value={groupId ?? ''}
          onChange={(e) => setGroupId(e.target.value || null)}
          className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">No group (personal reminder)</option>
          {groups?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.groupName}
            </option>
          ))}
        </select>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!date || saving}
          className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
