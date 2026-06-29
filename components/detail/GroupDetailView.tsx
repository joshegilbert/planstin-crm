'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import type { Group, NoteType } from '@/types'
import { useGroup } from '@/hooks/useGroup'
import { useUpdateGroup } from '@/hooks/useGroups'
import { useTemplates } from '@/hooks/useTemplates'
import { useAddNote } from '@/hooks/useNotes'
import { buildVM } from '@/lib/scoring'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { DetailHeader } from './DetailHeader'
import { WatchOutBanner } from './WatchOutBanner'
import { WorkflowsSection } from './WorkflowsSection'
import { GroupDetailsSection } from './GroupDetailsSection'
import { PlansOfferedSection } from './PlansOfferedSection'
import { NotesSection } from './NotesSection'
import { CheckInSection } from './CheckInSection'
import { OpenEnrollmentSection } from './OpenEnrollmentSection'
import { WatchOutsSection } from './WatchOutsSection'
import { RemindersSection } from './RemindersSection'
import { KeyDatesSection } from './KeyDatesSection'
import { ClaimUtilizationSection } from './ClaimUtilizationSection'

interface GroupDetailViewProps {
  id: string
}

function GroupDetailViewInner({ id }: GroupDetailViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromDashboard = searchParams.get('from') === 'dashboard'
  const { data: group, isLoading, isError } = useGroup(id)
  const updateGroupMutation = useUpdateGroup()
  const { data: templates = [] } = useTemplates()
  const addNote = useAddNote(id)

  function handleUpdate(patch: Partial<Group>) {
    updateGroupMutation.mutate({ id, patch })
  }

  function handleAddNote(args: { text: string; type: NoteType; date?: string }) {
    addNote.mutate(args)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-ink-faint text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (isError || !group) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <p className="text-ink-faint text-sm">Could not load group.</p>
        <button
          onClick={() => router.push('/groups')}
          className="text-sm text-accent hover:underline"
        >
          Back to all groups
        </button>
      </div>
    )
  }

  const vm = (() => {
    try {
      return buildVM(group)
    } catch {
      return buildVM({ ...group, workflows: [], notes: [] })
    }
  })()

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="max-w-[1280px] mx-auto px-8 py-6">
        <button
          onClick={() => router.push(fromDashboard ? '/dashboard' : '/groups')}
          className="flex items-center gap-1 text-sm text-ink-faint hover:text-ink transition-colors mb-5"
        >
          ← {fromDashboard ? 'Back to dashboard' : 'All Groups'}
        </button>

        <ErrorBoundary fallbackTitle="Header could not be displayed">
          <DetailHeader group={group} vm={vm} onUpdate={handleUpdate} />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Watch-out banner could not be displayed">
          {group.watchOuts && (
            <WatchOutBanner group={group} vm={vm} onUpdate={handleUpdate} />
          )}
        </ErrorBoundary>

        <div className="flex gap-8 items-start">
          {/* Left column */}
          <div style={{ flex: '1.55', minWidth: 0 }}>
            <ErrorBoundary fallbackTitle="Workflows could not be displayed">
              <WorkflowsSection group={group} templates={templates} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Group details could not be displayed">
              <GroupDetailsSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Plans offered could not be displayed">
              <PlansOfferedSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Claim utilization could not be displayed">
              <ClaimUtilizationSection groupId={group.id} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Notes could not be displayed">
              <NotesSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
          </div>

          {/* Right column */}
          <div style={{ flex: '1', minWidth: 0 }}>
            <ErrorBoundary fallbackTitle="Check-in section could not be displayed">
              <CheckInSection
                group={group}
                onUpdate={handleUpdate}
                onAddNote={handleAddNote}
              />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Reminders could not be displayed">
              <RemindersSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Open enrollment could not be displayed">
              <OpenEnrollmentSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Watch-outs could not be displayed">
              <WatchOutsSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Key dates could not be displayed">
              <KeyDatesSection group={group} onUpdate={handleUpdate} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GroupDetailView({ id }: GroupDetailViewProps) {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center">
        <div className="text-ink-faint text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <GroupDetailViewInner id={id} />
    </Suspense>
  )
}

export default GroupDetailView
