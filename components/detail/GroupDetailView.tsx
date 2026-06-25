'use client'
import { useRouter } from 'next/navigation'
import type { Group, NoteType } from '@/types'
import { useGroup } from '@/hooks/useGroup'
import { useUpdateGroup } from '@/hooks/useGroups'
import { useTemplates } from '@/hooks/useTemplates'
import { useAddNote } from '@/hooks/useNotes'
import { buildVM } from '@/lib/scoring'
import { DetailHeader } from './DetailHeader'
import { WatchOutBanner } from './WatchOutBanner'
import { WorkflowsSection } from './WorkflowsSection'
import { GroupDetailsSection } from './GroupDetailsSection'
import { PlansOfferedSection } from './PlansOfferedSection'
import { NotesSection } from './NotesSection'
import { CheckInSection } from './CheckInSection'
import { OpenEnrollmentSection } from './OpenEnrollmentSection'
import { WatchOutsSection } from './WatchOutsSection'
import { FollowUpSection } from './FollowUpSection'
import { KeyDatesSection } from './KeyDatesSection'

interface GroupDetailViewProps {
  id: string
}

export function GroupDetailView({ id }: GroupDetailViewProps) {
  const router = useRouter()
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
        <div className="text-ink-faint text-sm animate-pulse">Loading…</div>
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
          ← Back to all groups
        </button>
      </div>
    )
  }

  const vm = buildVM(group)

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="max-w-[1280px] mx-auto px-8 py-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/groups')}
          className="flex items-center gap-1 text-sm text-ink-faint hover:text-ink transition-colors mb-5"
        >
          ← All Groups
        </button>

        {/* Header card */}
        <DetailHeader group={group} vm={vm} onUpdate={handleUpdate} />

        {/* Watch-out banner */}
        {group.watchOuts && (
          <WatchOutBanner group={group} vm={vm} onUpdate={handleUpdate} />
        )}

        {/* Main two-column layout */}
        <div className="flex gap-8 items-start">
          {/* Left column */}
          <div style={{ flex: '1.55', minWidth: 0 }}>
            <WorkflowsSection group={group} templates={templates} />
            <GroupDetailsSection group={group} onUpdate={handleUpdate} />
            <PlansOfferedSection group={group} onUpdate={handleUpdate} />
            <NotesSection group={group} onUpdate={handleUpdate} />
          </div>

          {/* Right column */}
          <div style={{ flex: '1', minWidth: 0 }}>
            <CheckInSection
              group={group}
              onUpdate={handleUpdate}
              onAddNote={handleAddNote}
            />
            <OpenEnrollmentSection group={group} onUpdate={handleUpdate} />
            <WatchOutsSection group={group} onUpdate={handleUpdate} />
            <FollowUpSection group={group} onUpdate={handleUpdate} />
            <KeyDatesSection group={group} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupDetailView
