/// <reference types="vite/client" />

type DataItem = {
  name: string;
  color: string[];
  features: string[];
};

type ImageItem = {
  url: string;
  accessories: DataItem[];
  clothes: DataItem[];
};

type GraphOptions = {
  clothesCutoff: number;
  accessoriesCutoff: number;
  weightName: number;
  weightColor: number;
  weightFeatures: number;
  seperationWidth: number;
  seperationHeight: number;
  maxImagesInRow: number;
};

type GraphOptionsKey = keyof GraphOptions