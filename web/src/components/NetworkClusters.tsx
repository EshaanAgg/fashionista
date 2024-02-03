import { Table, Image, Group, Title, Text } from '@mantine/core';
import imageData from '../data/clusters.json';

type ClusterData = {
  name: string;
  color: string[];
  features: string[];
  items: string[];
};

const TableRow = ({ cluster }: { cluster: ClusterData }) => {
  return (
    <Table.Tr>
      <Table.Td>
        <Title order={5}>Name</Title>
        <Text>{cluster.name}</Text>
        <Title order={5}>Colors</Title>
        <Text>{cluster.color.join(', ')}</Text>
        <Title order={5}>Features</Title>
        <Text>{cluster.features.join(', ')}</Text>
      </Table.Td>

      <Table.Td>
        <Group justify="center">
          {cluster.items.map((url) => (
            <Image
              src={url}
              h={140}
              radius="sm"
              w="auto"
              fit="contain"
              key={url}
              alt={`Failed to load the image ${url}`}
            />
          ))}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

export const NetworkClusters = () => {
  return (
    <>
      <Table
        m="md"
        p="md"
        w="95%"
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>
          <Table.Tr aria-colspan={2}>
            <Group justify="center">
              <Title order={4}>Clusters</Title>
            </Group>
          </Table.Tr>
          <Table.Tr>
            <Table.Th w="40%">Description</Table.Th>
            <Table.Th w="60%">Items</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {imageData.map((cluster: ClusterData, index: number) => (
            <TableRow cluster={cluster} key={index} />
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};
