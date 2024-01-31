import { stringSimilarity } from 'string-similarity-js';

// Returns the average similarity of elements of `arr1` with the most matching element of `arr2`
function arraySimilarityHelper(arr1: string[], arr2: string[]) {
  return (
    arr1
      .map((ele) =>
        arr2.reduce((acc, val) => Math.max(acc, stringSimilarity(ele, val)), 0),
      )
      .reduce((acc, val) => acc + val, 0) / arr1.length
  );
}

function arraySimilarity(arr1: string[], arr2: string[]) {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  return (
    (arraySimilarityHelper(arr1, arr2) + arraySimilarityHelper(arr2, arr1)) / 2
  );
}

function itemSimilarity(
  item1: DataItem,
  item2: DataItem,
  weightName: number,
  weightColor: number,
  weightFeatures: number,
) {
  const nameSimilarity = stringSimilarity(item1.name, item2.name);
  const colorSimilarity = arraySimilarity(item1.color, item2.color);
  const featuresSimilarity = arraySimilarity(item1.features, item2.features);

  return (
    (weightName * nameSimilarity +
      weightFeatures * featuresSimilarity +
      weightColor * colorSimilarity) /
    (weightName + weightFeatures + weightColor)
  );
}

// Returns an array of the names of the items in `item1` and `item2` that are similar for a particular key
const getSimilarItems = (
  item1: ImageItem,
  item2: ImageItem,
  key: 'clothes' | 'accessories',
  weightName: number,
  weightColor: number,
  weightFeatures: number,
  cutoff: number,
) => {
  const arr1 = item1[key];
  const arr2 = item2[key];

  const res = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (
        itemSimilarity(
          arr1[i],
          arr2[j],
          weightName,
          weightColor,
          weightFeatures,
        ) >= cutoff
      )
        res.push(arr1[i].name);
    }
  }

  return res;
};

// Returns an object of common clothes and accessories between `item1` and `item2`
export const getSimilar = (
  item1: ImageItem,
  item2: ImageItem,
  options: GraphOptions,
) => {
  return {
    clothes: getSimilarItems(
      item1,
      item2,
      'clothes',
      options.weightName,
      options.weightColor,
      options.weightFeatures,
      options.clothesCutoff,
    ),
    accessories: getSimilarItems(
      item1,
      item2,
      'accessories',
      options.weightName,
      options.weightColor,
      options.weightFeatures,
      options.accessoriesCutoff,
    ),
  };
};

// Returns the intersection over union of two arrays
const getIntersectionOverUnion = (arr1: string[], arr2: string[]) => {
  const intersection = arr1.filter((x) => arr2.includes(x));
  const union = [...new Set([...arr1, ...arr2])];
  return intersection.length / union.length;
};

// Given an item and a list of other items, returns a list of items that are similar to the given item
const findSimilarItems = (
  object: DataItemWithImage,
  otherItems: DataItemWithImage[],
  options: GraphOptions,
  dataType: 'clothes' | 'accessories',
) => {
  return otherItems
    .map((item) => {
      const nameSimilarity = stringSimilarity(object.name, item.name);
      const colorSimilarity = getIntersectionOverUnion(
        object.color,
        item.color,
      );
      const featuresSimilarity = getIntersectionOverUnion(
        object.features,
        item.features,
      );

      return {
        item,
        similarity:
          (options.weightName * nameSimilarity +
            options.weightColor * colorSimilarity +
            options.weightFeatures * featuresSimilarity) /
          (options.weightName + options.weightColor + options.weightFeatures),
      };
    })
    .filter((item) => {
      const threshold =
        dataType === 'clothes'
          ? options.clothesCutoff
          : options.accessoriesCutoff;
      return item.similarity >= threshold;
    })
    .map((item) => item.item);
};

// Given a list of items, returns a list of clusters of similar items
const groupItems = (
  items: DataItemWithImage[],
  options: GraphOptions,
  dataType: 'clothes' | 'accessories',
) => {
  const clusters: DataItemWithImage[][] = [];
  const visited = new Set<DataItemWithImage>();

  for (const item of items) {
    if (visited.has(item)) continue;

    const cluster = findSimilarItems(item, items, options, dataType);
    clusters.push(cluster);
    for (const ele of cluster) visited.add(ele);
  }

  return clusters;
};

// Given the ImageItems, returns a list of clusters of similar items for clothes and accessories
export const getClustersFromImageItems = (
  items: ImageItem[],
  options: GraphOptions,
) => {
  const allClothes = [],
    allAccessories = [];

  for (const item of items) {
    allClothes.push(...item.clothes.map((ele) => ({ ...ele, url: item.url })));
    allAccessories.push(
      ...item.accessories.map((ele) => ({ ...ele, url: item.url })),
    );
  }

  return {
    clothes: groupItems(allClothes, options, 'clothes'),
    accessories: groupItems(allAccessories, options, 'accessories'),
  };
};
