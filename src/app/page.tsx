import FacilityBox from '@/components/FacilityBoxFixed';

export default function TestPage() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>施設カードテスト</h2>

      <FacilityBox
        name="xxxx（施設名）"
        postal="123-4567"
        address1="xx県xx市xx..."
        address2="xx丁目xx-xx"
        tel="000-1234-5678"
      />
    </div>
  );
}
