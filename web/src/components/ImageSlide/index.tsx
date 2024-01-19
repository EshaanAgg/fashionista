import { Card, Image, Text } from '@mantine/core';
import { ImageTable } from './ImageTable';

export const ImageSlide = ({
  imageData,
  serialNumber,
}: {
  imageData: ImageItem;
  serialNumber: number;
}) => {
  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="max-w-2xl mx-auto"
      >
        <Card.Section p="md">
          <Text size="lg" className="mx-auto">
            Image {serialNumber}
          </Text>
          <Image
            src={imageData.url}
            radius="md"
            h={250}
            w="auto"
            fit="contain"
            className="mx-auto"
            alt="Failed to load the image"
          />
        </Card.Section>

        <ImageTable imageData={imageData} />
      </Card>
    </>
  );
};
