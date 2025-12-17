'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leafletデフォルトアイコンのインポート
// src/types/images.d.ts により { src: string } 型として定義されています
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import searchMapData from '@/dummy_data/searchmap_data.json';
import { FacilityLocation } from '@/types/facilityLocation';

import styles from './MapSearch.module.scss';

/**
 * MapSearch コンポーネント
 *
 * 施設の位置情報を地図上に表示し、地理的な検索機能を提供します。
 * Leafletライブラリを使用して地図を描画し、登録された施設の座標にマーカーを配置します。
 *
 * 各マーカーをクリックすると、施設名や住所などの概要情報と、
 * 施設詳細ページへのリンクを含むポップアップが表示されます。
 *
 * @returns {JSX.Element} 地図検索エリアを表示するJSX要素
 */
export const MapSearch = () => {
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

    if (!mapRef.current || mapInstance.current) return;

    const markerData = searchMapData as FacilityLocation[];

    if (!markerData || markerData.length === 0) return;

    // 中心座標の決定
    const firstValid = markerData.find((d) => d.lat && d.lng);
    const initialLat = firstValid?.lat ?? 34.733239;
    const initialLng = firstValid?.lng ?? 135.239857;

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 8);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // マーカー配置
    markerData.forEach((data) => {
      if (data.lat && data.lng) {
        const detailUrl = `/facilities/${data.id}`;

        // ポップアップの内容をDOM要素として作成（XSS対策 & CSS Modules対応）
        // 文字列埋め込みではなく、DOMノードを作成してテキストを設定することで
        // 悪意のあるスクリプトの実行を防ぎます。
        // また、styles.popupContent を直接代入することで、ハッシュ化されたクラス名が正しく適用されます。
        const container = document.createElement('div');
        container.className = styles.popupContent;

        const p = document.createElement('p');

        // 名前
        p.appendChild(document.createTextNode(data.name));
        p.appendChild(document.createElement('br'));

        // 郵便番号
        if (data.postalCode) {
          p.appendChild(document.createTextNode(data.postalCode));
          p.appendChild(document.createElement('br'));
        }

        // 住所
        if (data.address) {
          p.appendChild(document.createTextNode(data.address));
          p.appendChild(document.createElement('br'));
        }

        // 電話番号
        if (data.phone) {
          p.appendChild(document.createTextNode(data.phone));
        }

        container.appendChild(p);

        // 詳細リンク
        const link = document.createElement('a');
        link.href = detailUrl;
        link.className = styles.popupLink;
        link.textContent = '詳細を見る';
        container.appendChild(link);

        // 作成したDOM要素をポップアップにバインド
        L.marker([data.lat, data.lng]).addTo(map).bindPopup(container);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.badge}>地図から探す</div>
      <div
        className={styles.mapArea}
        ref={mapRef}
        role="region"
        aria-label="施設の位置を示す地図"
      ></div>
    </div>
  );
};
