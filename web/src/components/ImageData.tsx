import imageDataJSON from '../data/imageItems.json';
import { ImageSlide } from './ImageSlide';
import { Grid } from '@mantine/core';

export const ImageData = () => {
  return (
    <Grid grow justify="center" align="center">
      {imageDataJSON.map((imageItem, index) => (
        <Grid.Col span={4} key={`${imageItem.url}`}>
          <ImageSlide imageData={imageItem} serialNumber={index + 1} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
