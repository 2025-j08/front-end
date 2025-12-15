export type Facility = {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  imagePath: string | null;
};

export type FacilitiesData = {
  totalCount: number;
  limit: number;
  pages: {
    [key: string]: Facility[];
  };
};
