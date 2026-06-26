'use client'
import { useState } from 'react'
import type { GroupContact } from '@/types'
import { useGroupContacts, useAddContact, useDeleteContact, useUpdateContact } from '@/hooks/useGroupContacts'

interface LegacyContact {
  name: string
  email: string
  phone: string
  role: string
}

interface ContactsSectionProps {
  groupId: string
  legacyContact?: LegacyContact | null
  onPrimaryChange?: (contact: GroupContact) => void
}

const inputClass =
  'w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'
const labelClass = 'block text-xs text-ink-faint mb-1'

const emptyForm = { name: '', role: '', email: '', phone: '', isPrimary: false }

export function ContactsSection({ groupId, legacyContact, onPrimaryChange }: ContactsSectionProps) {
  const { data: contacts = [], isLoading } = useGroupContacts(groupId)
  const addContact = useAddContact(groupId)
  const deleteContact = useDeleteContact(groupId)
  const updateContact = useUpdateContact(groupId)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function handleAdd() {
    if (!form.name.trim()) return
    addContact.mutate(form, {
      onSuccess: (c: GroupContact) => {
        if (c.isPrimary && onPrimaryChange) onPrimaryChange(c)
        setForm(emptyForm)
        setShowForm(false)
      },
    })
  }

  function startEdit(contact: GroupContact) {
    setEditingId(contact.id)
    setEditForm({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      isPrimary: contact.isPrimary,
    })
  }

  function saveEdit(contactId: string) {
    updateContact.mutate({ contactId, patch: editForm }, {
      onSuccess: (c: GroupContact) => {
        if (c.isPrimary && onPrimaryChange) onPrimaryChange(c)
        setEditingId(null)
      },
    })
  }

  return (
    <div className="mt-5 pt-4 border-t border-line">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
          Group contacts
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-accent hover:underline"
          >
            + Add contact
          </button>
        )}
      </div>

      {isLoading && (
        <p className="text-xs text-ink-faint">Loading...</p>
      )}

      {/* Contact list */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-3 rounded-xl border border-line bg-canvas-subtle">
            {editingId === contact.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input type="text" value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input type="text" value={editForm.role}
                      onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                      className={inputClass} placeholder="e.g. HR Manager" />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                      className={inputClass} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isPrimary}
                    onChange={(e) => setEditForm((p) => ({ ...p, isPrimary: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-xs text-ink-faint">Primary contact</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(contact.id)}
                    className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                    style={{ background: 'var(--accent)' }}>
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas text-ink-faint border border-line">
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.role && (
                      <span className="text-xs text-ink-faint">{contact.role}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(contact)}
                      className="text-xs text-ink-faint hover:text-ink transition-colors">
                      Edit
                    </button>
                    {confirmDeleteId === contact.id ? (
                      <>
                        <span className="text-xs text-ink-faint">Remove?</span>
                        <button onClick={() => { deleteContact.mutate(contact.id); setConfirmDeleteId(null) }}
                          className="text-xs text-red-500 hover:underline">Yes</button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-ink-faint hover:text-ink">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(contact.id)}
                        className="text-xs text-ink-faint hover:text-red-500 transition-colors">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}
                      className="block text-xs text-accent hover:underline">
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}
                      className="block text-xs text-ink-faint hover:text-ink">
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add contact form */}
      {showForm && (
        <div className="mt-3 p-3 rounded-xl border border-line bg-canvas-subtle space-y-3">
          <p className="text-xs font-medium text-ink">New contact</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div>
              <label className={labelClass}>Name *</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input type="text" value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className={inputClass} placeholder="e.g. HR Manager" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(e) => setForm((p) => ({ ...p, isPrimary: e.target.checked }))}
              className="rounded"
            />
            <span className="text-xs text-ink-faint">Primary contact</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.name.trim() || addContact.isPending}
              className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              Add
            </button>
            <button
              onClick={() => { setForm(emptyForm); setShowForm(false) }}
              className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 && legacyContact && !showForm && !isLoading && (
        <div className="p-3 rounded-xl border border-line bg-canvas-subtle opacity-75">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-ink">{legacyContact.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas text-ink-faint border border-line">
              Legacy
            </span>
          </div>
          {legacyContact.role && (
            <span className="text-xs text-ink-faint block">{legacyContact.role}</span>
          )}
          {legacyContact.email && (
            <a href={`mailto:${legacyContact.email}`} className="block text-xs text-accent hover:underline mt-1">
              {legacyContact.email}
            </a>
          )}
          {legacyContact.phone && (
            <a href={`tel:${legacyContact.phone}`} className="block text-xs text-ink-faint hover:text-ink mt-0.5">
              {legacyContact.phone}
            </a>
          )}
        </div>
      )}

      {contacts.length === 0 && !legacyContact && !showForm && !isLoading && (
        <p className="text-xs text-ink-faint italic">No contacts added yet.</p>
      )}
    </div>
  )
}
