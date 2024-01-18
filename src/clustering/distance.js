import { stringSimilarity } from 'string-similarity-js';

// Returns the average similarity of elements of `arr1` with the most matching element of `arr2`
function arraySimilarityHelper(arr1, arr2) {
  return (
    arr1
      .map((ele) =>
        arr2.reduce((acc, val) => Math.max(acc, stringSimilarity(ele, val)), 0)
      )
      .reduce((acc, val) => acc + val, 0) / arr1.length
  );
}

function arraySimilarity(arr1, arr2) {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  return (
    (arraySimilarityHelper(arr1, arr2) + arraySimilarityHelper(arr2, arr1)) / 2
  );
}

export function itemDistance(item1, item2) {
  const nameSimilarity = stringSimilarity(item1.name, item2.name);
  const colorSimilarity = arraySimilarity(item1.colors, item2.colors);
  const notesSimilarity = arraySimilarity(item1.notes, item2.notes);

  const weightName = 0.5;
  const weightColor = 0.4;
  const weightNotes = 0.3;

  return -(
    weightName * nameSimilarity +
    weightNotes * notesSimilarity +
    weightColor * colorSimilarity
  );
}
