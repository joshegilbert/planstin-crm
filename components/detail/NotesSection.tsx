'use client'
import { useState, useRef, useEffect } from 'react'
import type { Group, NoteType } from '@/types'
import { fmt } from '@/lib/dates'
import { useAddNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes'
import { useUIStore } from '@/lib/store'
import { parseIntake } from '@/lib/intake-parser'
import { Modal } from '@/components/ui/Modal'

interface NotesSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const NOTE_STYLES: Record<NoteType, { border: string; badge: string; text: string; icon: string }> = {
  Call:      { border: 'oklch(0.75 0.12 255)', badge: 'oklch(0.95 0.03 250)', text: 'oklch(0.44 0.11 255)', icon: '📞' },
  Email:     { border: 'oklch(0.75 0.10 155)', badge: 'oklch(0.95 0.04 155)', text: 'oklch(0.40 0.09 155)', icon: '✉' },
  Meeting:   { border: 'oklch(0.75 0.12 65)',  badge: 'oklch(0.96 0.05 80)',  text: 'oklch(0.46 0.11 65)',  icon: '🗓' },
  'Check-in':{ border: 'oklch(0.75 0.10 155)', badge: 'oklch(0.95 0.04 155)', text: 'oklch(0.40 0.09 155)', icon: '✓' },
  Monitor:   { border: 'oklch(0.75 0.12 65)',  badge: 'oklch(0.96 0.05 80)',  text: 'oklch(0.46 0.11 65)',  icon: '👁' },
  Note:      { border: '#d0cec8',              badge: '#f0eee8',              text: '#6f6c66',              icon: '📝' },
}

const NOTE_TYPES: NoteType[] = ['Call', 'Email', 'Meeting', 'Note']
const MAX_CHARS = 220

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      style={{ resize: 'none', overflow: 'hidden', minHeight: '2.5rem' }}
    />
  )
}

export function NotesSection({ group, onUpdate }: NotesSectionProps) {
  const addNote = useAddNote(group.id)
  const updateNote = useUpdateNote(group.id)
  const deleteNote = useDeleteNote(group.id)
  const expandedNotes = useUIStore((s) => s.expandedNotes)
  const toggleNoteExpanded = useUIStore((s) => s.toggleNoteExpanded)

  const [intakeOpen, setIntakeOpen] = useState(false)
  const [intakeRaw, setIntakeRaw] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('Call')
  const [noteText, setNoteText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const notes = [...(group.notes || [])].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''),
  )

  function handleImportIntake() {
    const patch = parseIntake(intakeRaw, group)
    onUpdate(patch)
    addNote.mutate({
      type: 'Note',
      text: `Intake notes imported:\n${intakeRaw.slice(0, 500)}`,
    })
    setIntakeRaw('')
    setIntakeOpen(false)
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    addNote.mutate({ type: noteType, text: noteText.trim() })
    setNoteText('')
  }

  function startEdit(noteId: string, currentText: string) {
    setEditingId(noteId)
    setEditText(currentText)
  }

  function saveEdit(noteId: string) {
    if (!editText.trim()) return
    updateNote.mutate({ noteId, text: editText.trim() })
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  function confirmDelete(noteId: string) {
    deleteNote.mutate(noteId)
    setConfirmDeleteId(null)
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink text-sm">Activity</h2>
        <button
          onClick={() => setIntakeOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-accent hover:border-accent transition-colors"
        >
          Paste intake notes
        </button>
      </div>

      {/* Compose area */}
      <div className="mb-5 rounded-xl border border-line bg-canvas-subtle p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          {NOTE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setNoteType(t)}
              className="text-xs px-2.5 py-1 rounded-full transition-colors"
              style={
                noteType === t
                  ? { background: NOTE_STYLES[t].badge, color: NOTE_STYLES[t].text, fontWeight: 600 }
                  : { color: 'var(--text-muted)' }
              }
            >
              {NOTE_STYLES[t].icon} {t}
            </button>
          ))}
        </div>
        <AutoTextarea
          value={noteText}
          onChange={setNoteText}
          placeholder={`Log a ${noteType.toLowerCase()}...`}
          className="w-full text-sm bg-transparent text-ink focus:outline-none placeholder:text-ink-faint"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim() || addNote.isPending}
            className="text-xs px-4 py-1.5 rounded-lg text-white font-medium transition-opacity disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            Log {noteType}
          </button>
        </div>
      </div>

      {/* Activity feed */}
      {notes.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-ink-faint mb-1">No activity yet</p>
          <p className="text-xs text-ink-faint">Log a call, email, or meeting above</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => {
            const style = NOTE_STYLES[note.type] ?? NOTE_STYLES.Note
            const isEditing = editingId === note.id
            const isConfirmingDelete = confirmDeleteId === note.id
            const isLong = note.text.length > MAX_CHARS
            const isExpanded = !!expandedNotes[note.id]
            const displayText =
              isLong && !isExpanded ? note.text.slice(0, MAX_CHARS) + '…' : note.text

            return (
              <div
                key={note.id}
                className="flex gap-3 py-2.5 border-b border-line last:border-0 group"
              >
                {/* Left: color indicator */}
                <div
                  className="w-0.5 flex-shrink-0 rounded-full mt-1 self-stretch"
                  style={{ background: style.border, minHeight: '1.25rem' }}
                />

                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: style.badge, color: style.text }}
                      >
                        {style.icon} {note.type}
                      </span>
                      <span className="text-xs text-ink-faint">{fmt(note.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {!isEditing && !isConfirmingDelete && (
                        <>
                          <button
                            onClick={() => startEdit(note.id, note.text)}
                            className="text-xs text-ink-faint hover:text-ink transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(note.id)}
                            className="text-xs text-ink-faint hover:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {isConfirmingDelete && (
                        <>
                          <span className="text-xs text-ink-faint">Delete?</span>
                          <button
                            onClick={() => confirmDelete(note.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs text-ink-faint hover:text-ink"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <AutoTextarea
                        value={editText}
                        onChange={setEditText}
                        className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(note.id)}
                          disabled={!editText.trim()}
                          className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
                          style={{ background: 'var(--accent)' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-ink whitespace-pre-line leading-relaxed">
                        {displayText}
                      </p>
                      {isLong && (
                        <button
                          onClick={() => toggleNoteExpanded(note.id)}
                          className="text-xs text-accent hover:underline mt-1"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={intakeOpen} onClose={() => setIntakeOpen(false)} title="Paste intake notes">
        <div className="space-y-4">
          <p className="text-sm text-ink-faint">
            Paste the transition intake notes below. Fields will be parsed and filled automatically.
          </p>
          <textarea
            rows={12}
            value={intakeRaw}
            onChange={(e) => setIntakeRaw(e.target.value)}
            placeholder="Paste intake notes here..."
            className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 font-mono"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIntakeOpen(false)}
              className="text-sm px-4 py-2 rounded-xl border border-line text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImportIntake}
              disabled={!intakeRaw.trim() || addNote.isPending}
              className="text-sm px-4 py-2 rounded-xl text-white font-medium disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              Import & fill fields
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
