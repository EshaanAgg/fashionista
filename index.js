import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAN_API_KEY,
});

const ItemSchema = z.object({
  name: z.string().default(''),
  color: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
});

const ResponseSchema = z.object({
  clothes: z.array(ItemSchema).default([]),
  accessories: z.array(ItemSchema).default([]),
});

const parseResponse = (content, url) => {
  if (content.finish_reason !== 'stop')
    return {
      valid: false,
      message: `The call to the API failed. The finish_reason was ${content.finish_reason}.`,
      url,
    };

  try {
    const items = JSON.parse(content.message.content);
    const validationResult = ResponseSchema.safeParse(items);

    if (!validationResult.success)
      return {
        valid: false,
        message: `The call to the API failed. The JSON that OpenAI generated did not adhere to the proper schema required. Content:\n${content.message.content}\nParsing Error:\n${validationResult.error.message}`,
        url,
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
      url,
    };
  }
};

// Example data that
const getFeaturesFromImage = async (imageUrl) => {
  try {
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
  } catch (err) {
    return {
      valid: false,
      message: `The call to the API failed. The error was ${err.message}`,
      url: imageUrl,
    };
  }
};

const getData = async (images) => {
  const responses = await Promise.all(
    images.map((img) => getFeaturesFromImage(img))
  );

  // Log the information about all the failed requests
  responses
    .filter((res) => !res.valid)
    .forEach((res) => console.log(res.message));

  // Append these urls to a logging file
  fs.appendFileSync(
    './data/failedURLs.txt',
    responses
      .filter((res) => !res.valid)
      .map((res) => res.url)
      .join('\n')
  );

  return responses
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
    );
};

const getDataBatched = async (images) => {
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < images.length; i += batchSize)
    batches.push(images.slice(i, i + batchSize));

  let data = {
    accessories: [],
    clothes: [],
  };

  for (let i = 0; i < batches.length; i++) {
    const res = await getData(batches[i]);
    console.log(`Completed batch ${i + 1}`);

    data.accessories.push(...res.accessories);
    data.clothes.push(...res.clothes);
  }

  fs.writeFileSync('./data/extractedData.json', JSON.stringify(data));
};

getDataBatched(
  JSON.parse(fs.readFileSync('./data/coyo.json', 'utf-8')).map(
    (item) => item.url
  )
);
