'use client';

import React, { useEffect, useRef } from 'react';

import searchMapData from '@/dummy_data/searchmap_data.json';

import styles from './MapSearch.module.scss';

declare global {
  interface Window {
    L: any;
  }
}

type FacilityLocation = {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};

export const MapSearch = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // 1. Leaflet読み込み
    const loadLeaflet = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.L) {
          resolve();
          return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Leaflet failed to load'));
        document.head.appendChild(script);
      });
    };

    // 2. 地図描画
    const initMap = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;
      if (mapInstance.current) return;

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

          // ▼ styles.popupLink を使用してクラスを割り当て
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
    };

    loadLeaflet().then(initMap).catch(console.error);

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
      <div className={styles.mapArea} ref={mapRef}></div>
    </div>
  );
};
