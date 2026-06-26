import { MeetingPrepView } from '@/components/detail/MeetingPrepView'

interface PrepPageProps {
  params: Promise<{ id: string }>
}

export default async function MeetingPrepPage({ params }: PrepPageProps) {
  const { id } = await params
  return <MeetingPrepView id={id} />
}
