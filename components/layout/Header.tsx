'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { useGroups } from '@/hooks/useGroups'
import { buildVM } from '@/lib/scoring'
import { fmt, todayISO } from '@/lib/dates'

function getViewInfo(pathname: string): { title: string; subtitle: string } {
  if (pathname === '/dashboard') return { title: 'Dashboard', subtitle: 'Overview of your book' }
  if (pathname.startsWith('/groups/') && pathname.length > '/groups/'.length && !pathname.endsWith('/prep')) {
    return { title: 'Group Detail', subtitle: 'Account information' }
  }
  if (pathname.endsWith('/prep')) return { title: 'Meeting Prep', subtitle: 'Pre-call summary' }
  if (pathname.startsWith('/groups')) return { title: 'All Groups', subtitle: 'Your full book of business' }
  if (pathname.startsWith('/templates')) return { title: 'Workflows', subtitle: 'Templates & active workflows' }
  if (pathname.startsWith('/settings')) return { title: 'Settings', subtitle: 'Plan catalog & preferences' }
  return { title: 'Sideline Ops', subtitle: '' }
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { search, setSearch, setShowAddGroup } = useUIStore()
  const { resolvedTheme, setTheme } = useTheme()
  const { data: rawGroups = [] } = useGroups()
  const { title, subtitle } = getViewInfo(pathname)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const todayFormatted = fmt(todayISO())

  const searchResults = search.trim().length > 0
    ? rawGroups
        .filter((g) => {
          const q = search.trim().toLowerCase()
          return (
            g.groupName.toLowerCase().includes(q) ||
            g.currentBM.toLowerCase().includes(q) ||
            (g.contactName?.toLowerCase() ?? '').includes(q)
          )
        })
        .slice(0, 8)
    : []

  const isOnGroupsList = pathname === '/groups' || pathname.startsWith('/groups?')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setDropdownOpen(e.target.value.trim().length > 0)
  }

  function handleSelectResult(id: string) {
    setSearch('')
    setDropdownOpen(false)
    router.push(`/groups/${id}`)
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectResult(searchResults[0].id)
    }
    if (e.key === 'Escape') {
      setSearch('')
      setDropdownOpen(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-4 px-6 border-b border-line bg-canvas"
      style={{ height: 64 }}
    >
      {/* Left: title */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="font-semibold text-ink leading-tight truncate">{title}</span>
        {subtitle && (
          <span className="text-xs text-ink-faint leading-tight truncate">{subtitle}</span>
        )}
      </div>

      {/* Center: search with dropdown */}
      <div className="flex-1 flex justify-center" ref={dropdownRef}>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => search.trim() && setDropdownOpen(true)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />

          {/* Global search dropdown — visible when not on /groups or when on a detail page */}
          {dropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-canvas border border-line rounded-xl shadow-lg overflow-hidden z-50">
              {searchResults.map((g) => {
                const vm = buildVM(g)
                return (
                  <button
                    key={g.id}
                    onClick={() => handleSelectResult(g.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-canvas-subtle text-left transition-colors border-b border-line last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{g.groupName}</div>
                      <div className="text-xs text-ink-faint truncate">
                        {g.status}
                        {vm.renewalSub ? ` · renews ${vm.renewalSub}` : ''}
                        {g.employees ? ` · ${g.employees} employees` : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {dropdownOpen && search.trim().length > 0 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-canvas border border-line rounded-xl shadow-lg px-3 py-3 z-50">
              <p className="text-sm text-ink-faint">No groups match &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-faint hidden sm:block whitespace-nowrap">{todayFormatted}</span>

        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-canvas-subtle transition-colors text-sm font-medium"
          title="Toggle theme"
        >
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
        </button>

        <button
          onClick={() => setShowAddGroup(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors whitespace-nowrap"
        >
          + New group
        </button>
      </div>
    </header>
  )
}
