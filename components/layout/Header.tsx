'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { fmt, todayISO } from '@/lib/dates'

function getViewInfo(pathname: string): { title: string; subtitle: string } {
  if (pathname === '/dashboard') return { title: 'Dashboard', subtitle: 'Overview of your book' }
  if (pathname.startsWith('/groups/') && pathname.length > '/groups/'.length) {
    return { title: 'Group Detail', subtitle: 'Account information' }
  }
  if (pathname.startsWith('/groups')) return { title: 'All Groups', subtitle: 'Your full book of business' }
  if (pathname.startsWith('/templates')) return { title: 'Workflows', subtitle: 'Templates & active workflows' }
  return { title: 'Planstin CRM', subtitle: '' }
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { search, setSearch, setShowAddGroup } = useUIStore()
  const { resolvedTheme, setTheme } = useTheme()
  const { title, subtitle } = getViewInfo(pathname)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    if (e.target.value && !pathname.startsWith('/groups')) {
      router.push('/groups')
    }
  }

  const todayFormatted = fmt(todayISO())

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

      {/* Center: search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search groups…"
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-md px-3 py-1.5 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-faint hidden sm:block whitespace-nowrap">{todayFormatted}</span>

        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-canvas-subtle transition-colors text-base"
          title="Toggle theme"
        >
          {resolvedTheme === 'dark' ? '☀️' : '🌙'}
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
