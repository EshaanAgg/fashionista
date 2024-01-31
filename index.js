import fs from 'fs';

// import { getFeaturesFromImage_Path, getDataBatched } from './src/requests.js';
// import { getClusters } from './src/clustering/clustering.js';
// import { getImagesInDirectory } from './src/io/imageData.js';

// getDataBatched(getImagesInDirectory('./data/sample'), getFeaturesFromImage_Path)
//   .then((data) => {
//     fs.writeFileSync(
//       './data/sampleData.json',
//       JSON.stringify({
//         accessories: data.accessories,
//         clothes: data.clothes,
//       })
//     );

//     fs.writeFileSync('./data/sampleErrors.json', JSON.stringify(data.errors));
//   })
//   .catch((err) => console.log(err));

// import { convertToImageData } from './src/utils.js';
// convertToImageData('./data/sampleData.json');

import { clusterWithGPT } from './src/cluster/clusterWithGPT.js';

clusterWithGPT('./data/sampleData.json').then((data) => {
  if (!data.valid) {
    console.error(data.place);
    console.log(data.message);
    return;
  }

  fs.writeFileSync(
    './data/sampleClusteredData.json',
    JSON.stringify(data.data)
  );
});
