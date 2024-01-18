import hclust from 'ml-hclust';
import { itemDistance } from './distance.js';

export const getClusters = (items) => {
  return hclust(items, {
    distanceFunction: itemDistance,
    linkage: 'average',
  });
};
