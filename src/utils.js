import fs from 'fs';

export const convertToImageData = (from) => {
  const { accessories, clothes } = JSON.parse(fs.readFileSync(from, 'utf-8'));
  const imageItems = {};

  for (const item of accessories) {
    const key = item.image;
    delete item.image;
    if (!imageItems[key]) {
      imageItems[key] = {
        url: key,
        accessories: [item],
        clothes: [],
      };
    } else {
      imageItems[key].accessories.push(item);
    }
  }

  for (const item of clothes) {
    const key = item.image;
    delete item.image;
    if (!imageItems[key]) {
      imageItems[key] = {
        url: key,
        accessories: [],
        clothes: [item],
      };
    } else {
      imageItems[key].clothes.push(item);
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
