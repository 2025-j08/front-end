import React from 'react';

type FacilityBoxProps = {
  name: string;
  postal: string;
  address1: string;
  address2?: string;
  tel: string;
};

const FacilityBox: React.FC<FacilityBoxProps> = ({ name, postal, address1, address2, tel }) => {
  return (
    <div
      style={{
        border: '2px solid #9ae5a6',
        background: '#eaffea',
        borderRadius: '12px',
        padding: '20px',
        width: '520px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      {/* 左側（施設情報） */}
      <div style={{ width: '65%' }}>
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: '6px',
            borderBottom: '1px solid #666',
            width: '90%',
          }}
        >
          {name}
        </div>

        <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
          <div>住所</div>
          <div>〒 {postal}</div>
          <div>{address1}</div>
          {address2 && <div>{address2}</div>}
          <div>TEL {tel}</div>
        </div>
      </div>

      {/* 右側（画像） */}
      <div
        style={{
          width: '130px',
          height: '130px',
          background: '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        image
      </div>
    </div>
  );
};

export default FacilityBox;
