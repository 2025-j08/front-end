import { FacilityEdit } from '@/features/facilities/[id]/edit/components/FacilityEdit';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminFacilityEditPage({ params }: Props) {
  const { id } = await params;
  return <FacilityEdit id={id} />;
}
