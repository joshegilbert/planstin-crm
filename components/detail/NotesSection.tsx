'use client'
import { useState } from 'react'
import type { Group, NoteType } from '@/types'
import { fmt } from '@/lib/dates'
import { useAddNote, useDeleteNote } from '@/hooks/useNotes'
import { useUIStore } from '@/lib/store'
import { parseIntake } from '@/lib/intake-parser'
import { Modal } from '@/components/ui/Modal'

interface NotesSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const NOTE_TYPE_STYLES: Record<NoteType, { background: string; color: string }> = {
  Call: { background: 'oklch(0.95 0.03 250)', color: 'oklch(0.44 0.11 255)' },
  Email: { background: 'oklch(0.95 0.04 155)', color: 'oklch(0.40 0.09 155)' },
  Meeting: { background: 'oklch(0.96 0.05 80)', color: 'oklch(0.46 0.11 65)' },
  'Check-in': { background: 'oklch(0.95 0.04 155)', color: 'oklch(0.40 0.09 155)' },
  Monitor: { background: 'oklch(0.96 0.05 80)', color: 'oklch(0.46 0.11 65)' },
  Note: { background: '#f0eee8', color: '#6f6c66' },
}

const NOTE_TYPES: NoteType[] = ['Call', 'Email', 'Meeting', 'Note']
const MAX_CHARS = 220

export function NotesSection({ group, onUpdate }: NotesSectionProps) {
  const addNote = useAddNote(group.id)
  const deleteNote = useDeleteNote(group.id)
  const expandedNotes = useUIStore((s) => s.expandedNotes)
  const toggleNoteExpanded = useUIStore((s) => s.toggleNoteExpanded)

  const [intakeOpen, setIntakeOpen] = useState(false)
  const [intakeRaw, setIntakeRaw] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('Call')
  const [noteText, setNoteText] = useState('')

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

  function handleDeleteNote(noteId: string) {
    if (window.confirm('Delete this note?')) {
      deleteNote.mutate(noteId)
    }
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink text-sm">Notes & call log</h2>
        <button
          onClick={() => setIntakeOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-accent hover:border-accent transition-colors"
        >
          Paste intake notes
        </button>
      </div>

      {/* Note composer */}
      <div className="mb-5 space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as NoteType)}
            className="text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {NOTE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write a note..."
          className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim() || addNote.isPending}
            className="text-sm px-4 py-2 rounded-xl text-white font-medium transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            Add note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-ink-faint text-center py-4">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const style = NOTE_TYPE_STYLES[note.type] || NOTE_TYPE_STYLES.Note
            const isLong = note.text.length > MAX_CHARS
            const isExpanded = !!expandedNotes[note.id]
            const displayText =
              isLong && !isExpanded ? note.text.slice(0, MAX_CHARS) + '…' : note.text

            return (
              <div
                key={note.id}
                className="pb-3 border-b border-line last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={style}
                    >
                      {note.type}
                    </span>
                    <span className="text-xs text-ink-faint">{fmt(note.date)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="flex-shrink-0 text-ink-faint hover:text-red-500 transition-colors text-base leading-none"
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
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
              </div>
            )
          })}
        </div>
      )}

      {/* Intake modal */}
      <Modal
        open={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        title="Paste intake notes"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-faint">
            Paste the transition intake notes below. Fields will be parsed and filled
            automatically.
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
