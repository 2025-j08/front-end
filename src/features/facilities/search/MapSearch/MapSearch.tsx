'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leafletデフォルトアイコンのインポート
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import searchMapData from '@/dummy_data/searchmap_data.json';
import { FacilityLocation } from '@/types/facilityLocation';

import styles from './MapSearch.module.scss';

export const MapSearch = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // サーバーサイドでの実行ガード
    if (typeof window === 'undefined') return;

    const iconUrl = (markerIcon as any).src || (markerIcon as unknown as string);
    const iconRetinaUrl = (markerIcon2x as any).src || (markerIcon2x as unknown as string);
    const shadowUrl = (markerShadow as any).src || (markerShadow as unknown as string);

    delete (L.Icon.Default.prototype as any)._getIconUrl;

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

        // iconオプションを削除（デフォルト設定を使用
        L.marker([data.lat, data.lng]).addTo(map).bindPopup(`<div class="${styles.popupContent}">
                            <p>${data.name}<br>
                            ${data.postalCode || ''}<br>
                            ${data.address || ''}<br>
                            ${data.phone || ''}</p>
                            <a href="${detailUrl}" class="${styles.popupLink}">
                                詳細を見る
                            </a>
                            </div>`);
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
