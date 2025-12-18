'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leafletデフォルトアイコンのインポート
// src/types/images.d.ts により { src: string } 型として定義されています
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import styles from './FacilityMap.module.scss';

type FacilityMapProps = {
  lat: number;
  lng: number;
  name: string;
  address?: string;
};

/**
 * FacilityMap コンポーネント
 *
 * 単一施設の位置情報を地図上に表示します。
 * ピンをクリックするとGoogleマップへのリンクが表示されます。
 *
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {string} name - 施設名
 * @param {string} [address] - 施設住所（Googleマップ検索用）
 * @returns {JSX.Element} 地図表示コンポーネント
 */
export const FacilityMap = ({ lat, lng, name, address }: FacilityMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // サーバーサイドでの実行ガード
    if (typeof window === 'undefined') return;

    // 画像パスの取得: any を回避し、安全にプロパティへアクセスする
    // インポートされた画像がオブジェクト({ src: string })か文字列パスか両方の可能性を考慮
    const getIconSrc = (icon: unknown): string => {
      // オブジェクトかつ src プロパティがある場合
      if (typeof icon === 'object' && icon !== null && 'src' in icon) {
        return (icon as { src: string }).src;
      }
      // 文字列の場合
      if (typeof icon === 'string') {
        return icon;
      }
      return '';
    };

    const iconUrl = getIconSrc(markerIcon);
    const iconRetinaUrl = getIconSrc(markerIcon2x);
    const shadowUrl = getIconSrc(markerShadow);

    // Leafletのデフォルトアイコンパス解決ロジックを削除して、バンドルされた画像を使用するように設定
    // _getIconUrl は型定義に含まれていないため、unknown 経由でキャストして削除
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
    });

    if (!mapRef.current) return;

    // マップインスタンスが既に存在する場合は、ビューを更新して終了
    if (mapInstance.current) {
      mapInstance.current.setView([lat, lng], 15);
      // 既存のマーカーを削除して新しいマーカーを追加するなどの処理が必要ならここで行う
      // 今回はコンポーネントが再マウントされるケースが主と想定し、シンプルにクリーンアップ後に再生成する方針
      // ただしuseEffectの依存配列により再生成される
      return;
    }

    const map = L.map(mapRef.current).setView([lat, lng], 15);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // ポップアップの内容をDOM要素として作成
    const container = document.createElement('div');
    container.className = styles.popupContent;

    const p = document.createElement('p');
    p.textContent = name;
    p.className = styles.facilityName;
    container.appendChild(p);

    // Googleマップへのリンク
    const query = address ? encodeURIComponent(address) : `${lat},${lng}`;
    const link = document.createElement('a');
    link.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = styles.googleMapLink;
    link.textContent = 'Googleマップで見る';
    container.appendChild(link);

    // マーカー追加
    L.marker([lat, lng]).addTo(map).bindPopup(container);

    // クリーンアップ関数
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng, name, address]);

  return (
    <div className={styles.container}>
      <div className={styles.mapArea} ref={mapRef} role="region" aria-label={`${name}の地図`}></div>
    </div>
  );
};
