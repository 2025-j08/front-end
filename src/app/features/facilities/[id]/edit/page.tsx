/**
 * 施設編集ページ（App Router）
 */
import { FacilityEdit } from '@/features/facilities/[id]/edit/page';

type Props = {
  params: Promise<{ id: string }>;
};

const FacilityEditPage = async ({ params }: Props) => {
  const { id } = await params;
  return <FacilityEdit id={id} />;
};

export default FacilityEditPage;
