'use client'
import { create } from 'zustand'
import type { ListFilter, SortOption } from '@/types'

interface UIStore {
  search: string
  setSearch: (s: string) => void
  listFilter: ListFilter
  setListFilter: (f: ListFilter) => void
  sort: SortOption
  setSort: (s: SortOption) => void
  showAddGroup: boolean
  setShowAddGroup: (v: boolean) => void
  showSnoozed: boolean
  setShowSnoozed: (v: boolean) => void
  expandedNotes: Record<string, boolean>
  toggleNoteExpanded: (noteId: string) => void
  expandedTasks: Record<string, boolean>
  toggleTaskExpanded: (taskId: string) => void
  setTaskExpanded: (taskId: string, val: boolean) => void
  collapsedSections: Record<string, boolean>
  toggleSection: (key: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  search: '',
  setSearch: (s) => set({ search: s }),
  listFilter: 'all',
  setListFilter: (f) => set({ listFilter: f }),
  sort: 'priority',
  setSort: (s) => set({ sort: s }),
  showAddGroup: false,
  setShowAddGroup: (v) => set({ showAddGroup: v }),
  showSnoozed: false,
  setShowSnoozed: (v) => set({ showSnoozed: v }),
  expandedNotes: {},
  toggleNoteExpanded: (noteId) =>
    set((s) => ({ expandedNotes: { ...s.expandedNotes, [noteId]: !s.expandedNotes[noteId] } })),
  expandedTasks: {},
  toggleTaskExpanded: (taskId) =>
    set((s) => ({ expandedTasks: { ...s.expandedTasks, [taskId]: !s.expandedTasks[taskId] } })),
  setTaskExpanded: (taskId, val) =>
    set((s) => ({ expandedTasks: { ...s.expandedTasks, [taskId]: val } })),
  collapsedSections: {},
  toggleSection: (key) =>
    set((s) => ({
      collapsedSections: { ...s.collapsedSections, [key]: !s.collapsedSections[key] },
    })),
}))
