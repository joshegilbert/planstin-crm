import GroupDetailView from '@/components/detail/GroupDetailView'

interface GroupDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = await params
  return <GroupDetailView id={id} />
}
