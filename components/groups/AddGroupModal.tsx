'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { useCreateGroup } from '@/hooks/useGroups'
import { Modal } from '@/components/ui/Modal'
import type { GroupStatus } from '@/types'

export default function AddGroupModal() {
  const router = useRouter()
  const { showAddGroup, setShowAddGroup } = useUIStore()
  const createGroup = useCreateGroup()

  const [groupName, setGroupName] = useState('')
  const [status, setStatus] = useState<GroupStatus>('active')
  const [renewalDate, setRenewalDate] = useState('')
  const [employees, setEmployees] = useState('')
  const [currentBM, setCurrentBM] = useState('')

  function handleClose() {
    setShowAddGroup(false)
    setGroupName('')
    setStatus('active')
    setRenewalDate('')
    setEmployees('')
    setCurrentBM('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!groupName.trim()) return

    const result = await createGroup.mutateAsync({
      groupName: groupName.trim(),
      status,
      renewalDate: renewalDate || undefined,
      employees: employees ? Number(employees) : undefined,
      currentBM: currentBM.trim() || undefined,
    })

    handleClose()
    if (result?.id) {
      router.push(`/groups/${result.id}`)
    }
  }

  const statusOptions: { value: GroupStatus; label: string }[] = [
    { value: 'active', label: 'Active client' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'transition', label: 'In transition' },
    { value: 'open-enrollment', label: 'Open enrollment' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'at-risk', label: 'At risk' },
    { value: 'parked', label: 'Parked' },
  ]

  return (
    <Modal open={showAddGroup} onClose={handleClose} title="Add new group">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Group name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as GroupStatus)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Renewal date</label>
          <input
            type="date"
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Employees</label>
          <input
            type="number"
            min="0"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Previous BM name</label>
          <input
            type="text"
            value={currentBM}
            onChange={(e) => setCurrentBM(e.target.value)}
            placeholder="Jane Smith"
            className="w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-lg border border-line text-ink hover:bg-canvas-subtle transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createGroup.isPending || !groupName.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createGroup.isPending ? 'Creating…' : 'Create group'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
