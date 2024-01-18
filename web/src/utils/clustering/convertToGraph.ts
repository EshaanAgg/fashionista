import { getSimilar } from './similarity';

const defaultOptions: GraphOptions = {
  clothesCutoff: 1,
  accessoriesCutoff: 1,
  weightName: 0.5,
  weightColor: 0.3,
  weightFeatures: 0.2,
  seperationWidth: 10,
  seperationHeight: 10,
  maxImagesInRow: 8,
};

const getNodes = (items: ImageItem[], options: GraphOptions) => {
  const rows = Math.ceil(items.length / options.maxImagesInRow);

  const arrangedList = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < options.maxImagesInRow; j++) {
      const index = i * options.maxImagesInRow + j;
      if (index < items.length) {
        arrangedList.push({
          id: index.toString(),
          position: {
            x: j * options.seperationWidth,
            y: i * options.seperationHeight,
          },
          data: {
            ...items[index],
          },
          type: 'imageNode',
        });
      }
    }
  }

  return arrangedList;
};

const getEdges = (items: ImageItem[], options: GraphOptions) => {
  const edges = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const distance = getSimilar(items[i], items[j], options);
      if (distance.clothes.length || distance.accessories.length)
        edges.push({
          id: `${i}-${j}`,
          source: i.toString(),
          target: j.toString(),
          data: {
            ...distance,
          },
          type: 'imageEdge',
        });
    }
  }

  return edges;
};

export const convertToGraph = (
  images: ImageItem[],
  options: Partial<GraphOptions>
) => {
  const opts = { ...defaultOptions, ...options };
  return {
    nodes: getNodes(images, opts),
    edges: getEdges(images, opts),
  };
};
