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
    weightName * nameSimilarity +
    weightFeatures * featuresSimilarity +
    weightColor * colorSimilarity
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
