'use client'
import { statusInfo } from '@/lib/scoring'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const info = statusInfo(status)
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: info.color + '22',
        color: info.color,
        border: `1px solid ${info.color}44`,
      }}
    >
      {info.label}
    </span>
  )
}
