import GroupsView from '@/components/groups/GroupsView'

interface GroupsPageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
  const params = await searchParams
  return <GroupsView initialFilter={params.filter} />
}
