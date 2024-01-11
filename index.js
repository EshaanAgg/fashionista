import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAN_API_KEY,
});

async function getFeaturesFromImage(imageUrl) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a fashion expert. You need to identify the clothes, apparels and all the fashion accessories in the provided images. Reply only with the valid JSON and nothing else.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `What clothes and accessories are in this image? Reply only with valid JSON without the pretty formatting. The format that you should reply in is as follows:
            """
            ${fs.readFileSync('./src/sampleListing.json', 'utf-8')}
            """
            `,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'low',
            },
          },
        ],
      },
    ],
    max_tokens: 350,
  });

  const content = response.choices[0];
  if (content.finish_reason === 'stop') {
    // Get the items and add the image url to them
    const items = JSON.parse(content.message.content);
    items.clothes.forEach((item) => (item.image = imageUrl));
    items.accessories.forEach((item) => (item.image = imageUrl));

    return {
      valid: true,
      data: items,
    };
  }

  return {
    valid: false,
    message: `The call to the API failed. The finish_reason was ${content.finish_reason}. The message was ${content.message.content}`,
  };
}

async function getData(images) {
  const responses = await Promise.all(
    images.map((img) => getFeaturesFromImage(img))
  );

  // Write the data to a file
  fs.writeFileSync(
    './data/extractedData.json',
    JSON.stringify(
      responses
        .filter((res) => res.valid)
        .reduce(
          (acc, res) => ({
            accessories: [...acc.accessories, ...res.data.accessories],
            clothes: [...acc.clothes, ...res.data.clothes],
          }),
          {
            accessories: [],
            clothes: [],
          }
        ),
      null,
      2
    )
  );

  // Log the information about all the failed requests
  responses
    .filter((res) => !res.valid)
    .forEach((res) => console.log(res.message));
}

getData([
  'https://assets.vogue.in/photos/5e5f7ab335619f0008e2decf/2:3/w_2560%2Cc_limit/Priyal_%2520Y%2520_Project%2520Fall%25202020.jpg',
  'https://www.shutterstock.com/image-photo/fashion-woman-yellow-silk-dress-600nw-2364067289.jpg',
  'https://assets.vogue.com/photos/6345c499b233071b4e23de2f/master/w_320%2Cc_limit/00023-moschino-spring-2023-ready.jpeg',
]);
