import { getSimilar } from './similarity';

const defaultOptions: GraphOptions = {
  clothesCutoff: 1,
  accessoriesCutoff: 1,
  weightName: 0.5,
  weightColor: 0.3,
  weightFeatures: 0.2,
  seperationWidth: 10,
  seperationHeight: 10,
};

const getNodes = (items: ImageItem[], options: GraphOptions) => {
  const rows = Math.ceil(Math.sqrt(items.length));
  const columns = Math.ceil(items.length / rows);

  const arrangedList = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      if (index < items.length) {
        arrangedList.push({
          id: index,
          position: {
            x: j * options.seperationWidth,
            y: i * options.seperationHeight,
          },
          data: {
            label: `Image ${index + 1}`,
          },
          ...items[index],
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
          source: i,
          target: j,
          ...distance,
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
