'use client'
import { useEffect, useMemo } from 'react'
import { useGroups } from '@/hooks/useGroups'
import { buildVM } from '@/lib/scoring'
import { useUIStore } from '@/lib/store'
import FilterChips from './FilterChips'
import SortDropdown from './SortDropdown'
import GroupsTable from './GroupsTable'
import AddGroupModal from './AddGroupModal'
import type { GroupViewModel, ListFilter, SortOption } from '@/types'

interface GroupsViewProps {
  initialFilter?: string
}

function applyFilter(groups: GroupViewModel[], filter: ListFilter): GroupViewModel[] {
  switch (filter) {
    case 'reachout':
      return groups.filter((g) => g.score > 0 && !g.snoozed)
    case 'oenow':
      return groups.filter((g) => g.oeWindow === 'now')
    case 'oe90':
      return groups.filter((g) => g.oeWindow === 'soon')
    case 'transition':
      return groups.filter((g) => g.status === 'transition')
    case 'followup':
      return groups.filter((g) => g.followUpDue)
    case 'priority':
      return groups.filter((g) => g.priority)
    default:
      return groups
  }
}

function applySort(groups: GroupViewModel[], sort: SortOption): GroupViewModel[] {
  const sorted = [...groups]
  switch (sort) {
    case 'name':
      return sorted.sort((a, b) => a.groupName.localeCompare(b.groupName))
    case 'renewal':
      return sorted.sort((a, b) => {
        if (!a.renewalDate && !b.renewalDate) return 0
        if (!a.renewalDate) return 1
        if (!b.renewalDate) return -1
        return a.renewalDate.localeCompare(b.renewalDate)
      })
    case 'employees':
      return sorted.sort((a, b) => (b.employees ?? 0) - (a.employees ?? 0))
    case 'reachout-window':
      return sorted.sort((a, b) => {
        const aDate = a.followUpDate || a.nextCheckIn || a.renewalDate || ''
        const bDate = b.followUpDate || b.nextCheckIn || b.renewalDate || ''
        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1
        return aDate.localeCompare(bDate)
      })
    case 'handoff': {
      const handoffDate = (g: GroupViewModel) =>
        g.fullOwnership || g.commissionEffective || g.warmHandoffDate || null
      return sorted.sort((a, b) => {
        const aInTransition = a.status === 'transition'
        const bInTransition = b.status === 'transition'
        const aDate = handoffDate(a)
        const bDate = handoffDate(b)
        // Transition groups with dates come first, soonest first
        if (aDate && bDate) return aDate.localeCompare(bDate)
        if (aDate) return -1
        if (bDate) return 1
        // Transition groups without dates before non-transition
        if (aInTransition !== bInTransition) return aInTransition ? -1 : 1
        return b.score - a.score
      })
    }
    case 'priority':
    default:
      return sorted.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority ? -1 : 1
        return b.score - a.score
      })
  }
}

function applySearch(groups: GroupViewModel[], search: string): GroupViewModel[] {
  if (!search.trim()) return groups
  const q = search.trim().toLowerCase()
  return groups.filter(
    (g) =>
      g.groupName.toLowerCase().includes(q) ||
      g.currentBM.toLowerCase().includes(q) ||
      g.contactName?.toLowerCase().includes(q),
  )
}

const VALID_FILTERS = ['all', 'reachout', 'oenow', 'oe90', 'transition', 'followup', 'priority']

export default function GroupsView({ initialFilter }: GroupsViewProps) {
  const { data: rawGroups = [], isLoading } = useGroups()
  const { listFilter, setListFilter, sort, search } = useUIStore()

  // Sync initialFilter from URL to store on mount
  useEffect(() => {
    if (initialFilter && VALID_FILTERS.includes(initialFilter)) {
      setListFilter(initialFilter as ListFilter)
    }
  }, [initialFilter, setListFilter])

  const groups = useMemo(() => {
    const vms = rawGroups.map(buildVM)
    const filtered = applyFilter(vms, listFilter)
    const searched = applySearch(filtered, search)
    return applySort(searched, sort)
  }, [rawGroups, listFilter, sort, search])

  return (
    <div className="px-8 py-6">
      {/* Filter + sort row */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <FilterChips />
        <SortDropdown />
      </div>

      {/* Table */}
      <GroupsTable groups={groups} loading={isLoading} />

      {/* Add group modal */}
      <AddGroupModal />
    </div>
  )
}
