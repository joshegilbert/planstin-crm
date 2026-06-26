'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PlanCatalogItem, PlanFamily } from '@/types'
import { PLAN_FAMILIES } from '@/constants/plan-families'

async function fetchCatalog(year: number): Promise<PlanCatalogItem[]> {
  const res = await fetch(`/api/plan-catalog?year=${year}`)
  if (!res.ok) return []
  return res.json()
}

export function usePlanCatalog(year: number) {
  return useQuery({
    queryKey: ['plan-catalog', year],
    queryFn: () => fetchCatalog(year),
    enabled: !!year,
  })
}

export function usePlanCatalogYears() {
  return useQuery({
    queryKey: ['plan-catalog-years'],
    queryFn: async () => {
      const res = await fetch('/api/plan-catalog')
      if (!res.ok) return []
      const items: PlanCatalogItem[] = await res.json()
      const years = [...new Set(items.map((i) => i.planYear))].sort((a, b) => b - a)
      return years
    },
  })
}

export function catalogToFamilies(items: PlanCatalogItem[]): PlanFamily[] {
  if (!items.length) return PLAN_FAMILIES

  const map = new Map<string, string[]>()
  for (const item of items) {
    if (!map.has(item.familyName)) map.set(item.familyName, [])
    map.get(item.familyName)!.push(item.planName)
  }
  return Array.from(map.entries()).map(([name, plans]) => ({ name, plans }))
}

export function useAddPlanCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      planYear: number
      familyName: string
      planName: string
      sortOrder?: number
    }) =>
      fetch('/api/plan-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['plan-catalog', vars.planYear] })
      qc.invalidateQueries({ queryKey: ['plan-catalog-years'] })
    },
  })
}

export function useDeletePlanCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, planYear }: { id: string; planYear: number }) =>
      fetch(`/api/plan-catalog/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['plan-catalog', vars.planYear] })
    },
  })
}
