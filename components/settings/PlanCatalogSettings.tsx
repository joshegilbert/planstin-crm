'use client'
import { useState } from 'react'
import type { PlanCatalogItem } from '@/types'
import { usePlanCatalog, useAddPlanCatalogItem, useDeletePlanCatalogItem } from '@/hooks/usePlanCatalog'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]

const inputClass =
  'text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'

export default function PlanCatalogSettings() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const { data: items = [], isLoading } = usePlanCatalog(selectedYear)
  const addItem = useAddPlanCatalogItem()
  const deleteItem = useDeletePlanCatalogItem()

  const [newFamily, setNewFamily] = useState('')
  const [newPlan, setNewPlan] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const families = [...new Set(items.map((i) => i.familyName))]

  function handleAdd() {
    if (!newFamily.trim() || !newPlan.trim()) return
    const familyItems = items.filter((i) => i.familyName === newFamily.trim())
    addItem.mutate({
      planYear: selectedYear,
      familyName: newFamily.trim(),
      planName: newPlan.trim(),
      sortOrder: familyItems.length,
    }, {
      onSuccess: () => { setNewPlan('') },
    })
  }

  function handleDelete(item: PlanCatalogItem) {
    deleteItem.mutate({ id: item.id, planYear: item.planYear }, {
      onSuccess: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="space-y-8">
      {/* Year selector */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-3">Plan catalog</h2>
        <p className="text-xs text-ink-faint mb-4">
          These plan offerings appear in the group detail view. Each group can be assigned a specific
          plan year, allowing 2025 and 2026 offerings to coexist.
        </p>
        <div className="flex items-center gap-3 mb-6">
          <label className="text-xs text-ink-faint">Viewing year:</label>
          <div className="flex gap-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className="px-3 py-1.5 text-sm rounded-lg border transition-colors"
                style={
                  selectedYear === y
                    ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                    : { borderColor: 'var(--border)', color: 'var(--text-muted)' }
                }
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-ink-faint">Loading...</p>
        ) : (
          <div className="space-y-6">
            {families.map((family) => {
              const familyItems = items.filter((i) => i.familyName === family)
              return (
                <div key={family}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
                    {family}
                  </p>
                  <div className="space-y-1">
                    {familyItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg border border-line bg-canvas-subtle"
                      >
                        <span className="text-sm text-ink">{item.planName}</span>
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-ink-faint">Remove?</span>
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs text-ink-faint hover:text-ink"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="text-xs text-ink-faint hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {items.length === 0 && (
              <p className="text-sm text-ink-faint italic">
                No plans in catalog for {selectedYear}. Add some below, or run the migration to
                seed the default 2025 offerings.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add plan form */}
      <div className="pt-6 border-t border-line">
        <h3 className="text-sm font-semibold text-ink mb-3">Add plan to {selectedYear}</h3>
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="block text-xs text-ink-faint mb-1">Family name</label>
            <input
              type="text"
              value={newFamily}
              onChange={(e) => setNewFamily(e.target.value)}
              className={inputClass}
              placeholder="e.g. Care+"
              list="family-suggestions"
            />
            <datalist id="family-suggestions">
              {families.map((f) => <option key={f} value={f} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-ink-faint mb-1">Plan name</label>
            <input
              type="text"
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
              className={inputClass}
              placeholder="e.g. Care+ Core"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newFamily.trim() || !newPlan.trim() || addItem.isPending}
            className="text-sm px-4 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            Add plan
          </button>
        </div>
      </div>

      {/* Copy year */}
      <div className="pt-6 border-t border-line">
        <h3 className="text-sm font-semibold text-ink mb-1">Copy catalog to next year</h3>
        <p className="text-xs text-ink-faint mb-3">
          To create {selectedYear + 1} offerings, add plans above with year set to {selectedYear + 1},
          or contact your administrator to bulk-copy the catalog.
        </p>
      </div>
    </div>
  )
}
