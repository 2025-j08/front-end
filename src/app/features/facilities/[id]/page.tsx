import { FacilityDetail } from '@/features/facilities/[id]/page';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FacilityDetailPage({ params }: Props) {
  const { id } = await params;
  return <FacilityDetail id={id} />;
}
