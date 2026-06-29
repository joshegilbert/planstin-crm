'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useGroups } from '@/hooks/useGroups'
import { buildVM } from '@/lib/scoring'
import { Suspense } from 'react'

interface PipelineCount {
  reach: number
  oeNow: number
  oe90: number
  followUp: number
  flagged: number
  transition: number
}

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: groups = [] } = useGroups()

  const counts: PipelineCount = groups.reduce(
    (acc, g) => {
      const vm = buildVM(g)
      if (vm.score > 0 && !vm.snoozed) acc.reach++
      if (vm.oeWindow === 'now') acc.oeNow++
      if (vm.oeWindow === 'soon') acc.oe90++
      if (vm.followUpDue) acc.followUp++
      if (g.priority) acc.flagged++
      if (g.status === 'transition') acc.transition++
      return acc
    },
    { reach: 0, oeNow: 0, oe90: 0, followUp: 0, flagged: 0, transition: 0 },
  )

  const currentFilter = searchParams.get('filter') ?? ''

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'All Groups', href: '/groups' },
    { label: 'Workflows', href: '/templates' },
    { label: 'Settings', href: '/settings' },
  ]

  const pipelineItems = [
    { label: 'Reach out', count: counts.reach, filter: 'reachout' },
    { label: 'On OE now', count: counts.oeNow, filter: 'oenow' },
    { label: '90 days out', count: counts.oe90, filter: 'oe90' },
    { label: 'Follow-ups', count: counts.followUp, filter: 'followup' },
    { label: 'Flagged', count: counts.flagged, filter: 'priority' },
    { label: 'In transition', count: counts.transition, filter: 'transition' },
  ]

  function isNavActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/calendar') return pathname.startsWith('/calendar')
    if (href === '/groups') return pathname.startsWith('/groups')
    if (href === '/templates') return pathname.startsWith('/templates')
    if (href === '/settings') return pathname.startsWith('/settings')
    return false
  }

  function isPillActive(filter: string) {
    return pathname.startsWith('/groups') && currentFilter === filter
  }

  return (
    <aside
      className="flex flex-col h-screen overflow-y-auto flex-shrink-0"
      style={{
        width: 238,
        backgroundColor: 'var(--sidebar)',
        color: 'var(--text-sidebar)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="text-lg font-semibold leading-tight" style={{ color: '#fff' }}>
          Sideline Ops
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Account Manager
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors',
              isNavActive(item.href)
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/70 hover:bg-white/8 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-white/10" />

      {/* Pipeline */}
      <div className="px-3 flex-1">
        <div
          className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Reach Out
        </div>
        <div className="space-y-0.5">
          {pipelineItems.map((item) => (
            <Link
              key={item.filter}
              href={`/groups?filter=${item.filter}`}
              className={[
                'flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm transition-colors',
                isPillActive(item.filter)
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/8 hover:text-white',
              ].join(' ')}
            >
              <span>{item.label}</span>
              {item.count > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom user card */}
      <div
        className="mt-auto mx-3 mb-4 px-3 py-3 rounded-lg"
        style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Account Manager
        </div>
      </div>
    </aside>
  )
}

export default function Sidebar() {
  return (
    <Suspense fallback={
      <aside
        className="flex flex-col h-screen flex-shrink-0"
        style={{ width: 238, backgroundColor: 'var(--sidebar)' }}
      />
    }>
      <SidebarInner />
    </Suspense>
  )
}
