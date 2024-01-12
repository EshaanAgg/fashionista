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
