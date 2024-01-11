import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAN_API_KEY,
});

const ItemSchema = z.object({
  name: z.string(),
  color: z.array(z.string()),
  features: z.array(z.string()),
});

const ResponseSchema = z.object({
  clothes: z.array(ItemSchema),
  accessories: z.array(ItemSchema),
});

const parseResponse = (content, url) => {
  if (content.finish_reason !== 'stop')
    return {
      valid: false,
      message: `The call to the API failed. The finish_reason was ${content.finish_reason}.`,
    };

  try {
    const items = JSON.parse(content.message.content);
    const validationResult = ResponseSchema.safeParse(items);

    if (!validationResult.success)
      return {
        valid: false,
        message: `The call to the API failed. The JSON that OpenAI generated did not adhere to the proper schema required. Content:\n${content.message.content}\nParsing Error:\n${validationResult.error.message}`,
      };

    // Add the image url to the items
    const res = validationResult.data;
    res.accessories.forEach((item) => (item.image = url));
    res.clothes.forEach((item) => (item.image = url));

    return {
      valid: true,
      data: res,
    };
  } catch (err) {
    return {
      valid: false,
      message: `The call to the API failed. The response of the OpenAI could not be parsed as valid JSON. Content:\n${content.message.content}`,
    };
  }
};

// Example data that
const getFeaturesFromImage = async (imageUrl) => {
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

  return parseResponse(response.choices[0], imageUrl);
};

const getData = async (images) => {
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
        )
    )
  );

  // Log the information about all the failed requests
  responses
    .filter((res) => !res.valid)
    .forEach((res) => console.log(res.message));
};

getData([
  'https://assets.vogue.in/photos/5e5f7ab335619f0008e2decf/2:3/w_2560%2Cc_limit/Priyal_%2520Y%2520_Project%2520Fall%25202020.jpg',
  'https://www.shutterstock.com/image-photo/fashion-woman-yellow-silk-dress-600nw-2364067289.jpg',
  'https://assets.vogue.com/photos/6345c499b233071b4e23de2f/master/w_320%2Cc_limit/00023-moschino-spring-2023-ready.jpeg',
]);
