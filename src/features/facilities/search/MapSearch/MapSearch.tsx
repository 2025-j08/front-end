'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    if (typeof window === 'undefined') return;

    // ヘルパー関数: オブジェクト({src: string}) または 文字列の両方に対応
    const getUrl = (asset: string | { src: string } | undefined): string => {
      if (typeof asset === 'string') return asset;
      return asset?.src || '';
    };

    // 明示的なアイコン定義（デフォルトアイコンのグローバル設定変更は避ける）
    const customIcon = L.icon({
      iconUrl: getUrl(markerIcon),
      iconRetinaUrl: getUrl(markerIcon2x),
      shadowUrl: getUrl(markerShadow),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    if (!mapRef.current || mapInstance.current) return;

    const markerData = searchMapData as FacilityLocation[];
    if (!markerData || markerData.length === 0) return;

    const firstValid = markerData.find((d) => d.lat && d.lng);
    const initialLat = firstValid?.lat ?? 34.733239;
    const initialLng = firstValid?.lng ?? 135.239857;

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 8);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerData.forEach((data) => {
      if (data.lat && data.lng) {
        const detailUrl = `/facilities/${data.id}`;

        const container = document.createElement('div');
        container.className = styles.popupContent;

        const p = document.createElement('p');
        p.appendChild(document.createTextNode(data.name));
        p.appendChild(document.createElement('br'));
        if (data.postalCode) {
          p.appendChild(document.createTextNode(data.postalCode));
          p.appendChild(document.createElement('br'));
        }
        if (data.address) {
          p.appendChild(document.createTextNode(data.address));
          p.appendChild(document.createElement('br'));
        }
        if (data.phone) {
          p.appendChild(document.createTextNode(data.phone));
        }
        container.appendChild(p);

        const link = document.createElement('a');
        link.href = detailUrl;
        link.className = styles.popupLink;
        link.textContent = '詳細を見る';
        container.appendChild(link);

        L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map).bindPopup(container);
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
