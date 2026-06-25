import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import AddGroupModal from '@/components/groups/AddGroupModal'

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <AddGroupModal />
    </div>
  )
}
