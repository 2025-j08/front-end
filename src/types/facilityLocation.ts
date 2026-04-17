export type FacilityLocation = {
  id: number;
  name: string;
  /** 運営法人名（DB: TEXT NOT NULL） */
  corporation: string;
  postalCode: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};
