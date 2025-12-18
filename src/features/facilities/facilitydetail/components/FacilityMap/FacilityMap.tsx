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

    // Leafletのデフォルトアイコン設定を一度だけ実行するためのフラグを使用
    // L.Icon.Defaultを拡張してカスタムプロパティを追加
    interface ExtendedIconDefault extends L.Icon.Default {
      _isIconSet?: boolean;
      _getIconUrl?: string | (() => string); // Leaflet内部プロパティ
    }

    const iconPrototype = L.Icon.Default.prototype as unknown as ExtendedIconDefault;

    if (!iconPrototype._isIconSet) {
      // 画像パスの取得: 型定義を行い、安全にプロパティへアクセスする
      // インポートされた画像がオブジェクト({ src: string })か文字列パスか両方の可能性を考慮
      type IconSource = string | { src: string };

      const getIconSrc = (icon: IconSource): string => {
        if (typeof icon === 'object' && icon !== null && 'src' in icon) {
          return icon.src;
        }
        if (typeof icon === 'string') {
          return icon;
        }
        return '';
      };

      const iconUrl = getIconSrc(markerIcon as IconSource);
      const iconRetinaUrl = getIconSrc(markerIcon2x as IconSource);
      const shadowUrl = getIconSrc(markerShadow as IconSource);

      delete iconPrototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
      });
      iconPrototype._isIconSet = true;
    }

    if (!mapRef.current) return;

    // マップインスタンスが既に存在する場合は、マップを破棄して再作成する方針をとる
    // シンプルかつ確実な更新のため
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
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
  }, [lat, lng, name, address]); // 依存配列に変更があった場合は再実行され、マップも再作成される

  return (
    <div className={styles.container}>
      <div className={styles.mapArea} ref={mapRef} role="region" aria-label={`${name}の地図`}></div>
    </div>
  );
};
