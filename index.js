// import fs from 'fs';
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

//     // fs.writeFileSync(
//     //   './data/sampleClusters.json',
//     //   JSON.stringify({
//     //     accessories: getClusters(data.accessories),
//     //     clothes: getClusters(data.clothes),
//     //   })
//     // );
//   })
//   .catch((err) => console.log(err));

import { convertToImageData } from './src/utils.js';
convertToImageData('./data/sampleData.json');
