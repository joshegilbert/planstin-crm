import PlanCatalogSettings from '@/components/settings/PlanCatalogSettings'

export default function SettingsPage() {
  return (
    <div className="px-8 py-6 max-w-[900px]">
      <h1 className="text-lg font-semibold text-ink mb-1">Settings</h1>
      <p className="text-sm text-ink-faint mb-8">
        Manage your plan catalog and application preferences.
      </p>
      <PlanCatalogSettings />
    </div>
  )
}
