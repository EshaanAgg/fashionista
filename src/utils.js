import fs from 'fs';

export const convertToImageData = () => {
  const { accessories, clothes } = JSON.parse(
    fs.readFileSync('./data/extractedData.json', 'utf-8')
  );
  const imageItems = {};

  for (const item of accessories) {
    if (!imageItems[item.image]) {
      imageItems[item.image] = {
        url: item.image,
        accessories: [item],
        clothes: [],
      };
    } else {
      imageItems[item.image].accessories.push(item);
    }
  }

  for (const item of clothes) {
    if (!imageItems[item.image]) {
      imageItems[item.image] = {
        url: item.image,
        accessories: [],
        clothes: [item],
      };
    } else {
      imageItems[item.image].clothes.push(item);
    }
  }

  const imageItemsArray = [];
  for (const key in imageItems) {
    imageItemsArray.push({
      url: key,
      ...imageItems[key],
    });
  }

  fs.writeFileSync(
    './web/src/data/imageItems.json',
    JSON.stringify(imageItemsArray)
  );
};
