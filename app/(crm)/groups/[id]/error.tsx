'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GroupError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[GroupDetailPage error]', error)
  }, [error])

  const router = useRouter()

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <p className="text-ink-faint text-sm">Something went wrong loading this group.</p>
      <p className="text-xs text-ink-faint opacity-60">{error.message}</p>
      <div className="flex gap-3 mt-1">
        <button
          onClick={reset}
          className="text-sm text-accent hover:underline"
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/groups')}
          className="text-sm text-ink-faint hover:text-ink transition-colors"
        >
          Back to groups
        </button>
      </div>
    </div>
  )
}
