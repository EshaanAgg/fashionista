import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAN_API_KEY,
});

const ClusterSchema = z.object({
  name: z.string().default(''),
  color: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

const parseResponse = (content, imageIdsToNames) => {
  if (content.finish_reason !== 'stop')
    return {
      valid: false,
      message: `The call to the API failed. The finish_reason was ${content.finish_reason}.`,
    };

  try {
    const items = JSON.parse(content.message.content);
    const validationResult = ClusterSchema.safeParse(items);

    if (!validationResult.success)
      return {
        valid: false,
        message: `The call to the API failed. The JSON that OpenAI generated did not adhere to the proper schema required. Content:\n${content.message.content}\nParsing Error:\n${validationResult.error.message}`,
      };

    validationResult.data.forEach((item) => {
      item.images = item.images.map((id) => imageIdsToNames[id]);
    });

    return {
      valid: true,
      data: validationResult.data,
    };
  } catch (err) {
    return {
      valid: false,
      message: `The call to the API failed. The response of the OpenAI could not be parsed as valid JSON. Content:\n${content.message.content}`,
    };
  }
};

const makeRequest = async (data) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a fashion expert. You will be given a JSON describing the clothes and accessories that have been extracted from multiple images of an user. You need to identify the repeating items and cluster them together. Reply only with the valid JSON in the body (without formatting) and nothing else!',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You need to cluster the items. The image property on each is a special ID, so handle it with care. Also remember you need to cluster only the same data items. For example, there might be multiple shirts described in the data, one white checked, one white plain, one black plain, etc. Do not cluster them as a single entity, but as different entities as they look different.

              For the sample data:
              """
              ${fs.readFileSync('./src/cluster/sampleItemData.json', 'utf-8')}
              """
              you need to respond with the data in the following format:
              """
              ${fs.readFileSync(
                './src/cluster/sampleClusterData.json',
                'utf-8'
              )}
              """
              
              Remember to reply only with JSON and nothing else. The data that you should cluster is:
              """
              ${JSON.stringify(data)}
              """
            `,
            },
          ],
        },
      ],
    });

    return response.choices[0];
  } catch (err) {
    return {
      valid: false,
      message: `The call to the API failed. The error was ${err.message}`,
    };
  }
};

export const clusterWithGPT = async (path) => {
  let availableImageID = 0;
  const imageNamesToIDs = {};

  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  data.clothes.forEach((item) => {
    if (!imageNamesToIDs[item.image]) {
      imageNamesToIDs[item.image] = availableImageID;
      availableImageID++;
    }
    item.image = imageNamesToIDs[item.image];
  });

  data.accessories.forEach((item) => {
    if (!imageNamesToIDs[item.image]) {
      imageNamesToIDs[item.image] = availableImageID;
      availableImageID++;
    }
    item.image = imageNamesToIDs[item.image];
  });

  const imageIdsToNames = {};
  Object.keys(imageNamesToIDs).forEach((key) => {
    imageIdsToNames[imageNamesToIDs[key]] = key;
  });

  const resClothes = await makeRequest(data.accessories);
  if (!resClothes.valid) return resClothes;
  const resAccessories = await makeRequest(data.clothes);
  if (!resAccessories.valid) return resAccessories;

  const parsedClothes = parseResponse(resClothes, imageIdsToNames);
  if (!parsedClothes.valid) return parsedClothes;
  const parsedAccessories = parseResponse(resAccessories, imageIdsToNames);
  if (!parsedAccessories.valid) return parsedAccessories;

  return {
    valid: true,
    data: {
      clothes: parsedClothes.data,
      accessories: parsedAccessories.data,
    },
  };
};
