import { Card, Image, Table, Badge, Text } from '@mantine/core';

const ContentTable = ({
  rows,
  heading,
}: {
  rows: DataItem[];
  heading: string;
}) => {
  return (
    <Table
      captionSide="top"
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      my="sm"
    >
      <Table.Caption>{heading}</Table.Caption>

      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Colors</Table.Th>
          <Table.Th>Features</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {rows.map((element) => (
          <Table.Tr key={`${element.name}`}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>
              {element.color.map((color) => (
                <Badge key={color} mx={5}>
                  {color}
                </Badge>
              ))}
            </Table.Td>
            <Table.Td>
              {element.features.map((feature) => (
                <Badge key={feature} mx={5}>
                  {feature}
                </Badge>
              ))}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

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

        <ContentTable rows={imageData.clothes} heading="Clothes" />
        <ContentTable rows={imageData.accessories} heading="Accessories" />
      </Card>
    </>
  );
};
