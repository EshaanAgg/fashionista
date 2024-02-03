import { Table, Image, Group, Title, Text } from '@mantine/core';
import { getClustersFromImageItems } from '../utils/clustering/similarity';
import { useGraphOptionsContext } from '../context/GraphOptions';
import { ClusterPanel } from './Cluster/ClusterPanel';

import imageData from '../data/imageItems.json';

type TableRowProps = {
  cluster: DataItemWithImage[];
};

const TableRow = ({ cluster }: TableRowProps) => {
  const clusterName = cluster[0].name;
  const clusterColours: Record<string, number> = {},
    clusterFeatures: Record<string, number> = {};

  cluster.forEach((item) => {
    item.color.forEach((color) => {
      if (clusterColours[color]) clusterColours[color] += 1;
      else clusterColours[color] = 1;
    });
    item.features.forEach((accessory) => {
      if (clusterFeatures[accessory]) clusterFeatures[accessory] += 1;
      else clusterFeatures[accessory] = 1;
    });
  });

  return (
    <Table.Tr>
      {/* Row Header */}
      <Table.Td>
        {/* Name */}
        <Title order={5}>Name</Title>
        <Text>{clusterName}</Text>
        {/* Colors */}
        <Title order={5}>Colors</Title>
        <Text>
          {Object.keys(clusterColours)
            .map((color) => `${color} (${clusterColours[color]}) `)
            .join(', ')}
        </Text>
        <Title order={5}>Features</Title>
        <Text>
          {Object.keys(clusterFeatures)
            .map((feature) => `${feature} (${clusterFeatures[feature]}) `)
            .join(', ')}
        </Text>
      </Table.Td>

      {/* Images */}
      <Table.Td>
        <Group justify="center">
          {cluster.map((item) => (
            <Image
              src={item.url}
              h={140}
              radius="sm"
              w="auto"
              fit="contain"
              key={item.url}
              alt={`Failed to load the image ${item.url}`}
            />
          ))}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

type ClusterCategoryProps = {
  category: string;
  clusters: DataItemWithImage[][];
};
const ClusterCategory = ({ category, clusters }: ClusterCategoryProps) => {
  return (
    <>
      <Table.Thead>
        <Table.Tr aria-colspan={2}>
          <Group justify="center">
            <Title order={4}>{category}</Title>
          </Group>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w="40%">Description</Table.Th>
          <Table.Th w="60%">Items</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {clusters.map((cluster, index) => (
          <TableRow cluster={cluster} key={index} />
        ))}
      </Table.Tbody>
    </>
  );
};

export const Clusters = () => {
  const { options } = useGraphOptionsContext();
  const clusters = getClustersFromImageItems(imageData, options);

  return (
    <>
      {/* Cluster Panel to change the graphing options */}
      {/* Would be pinned in a corner */}
      <div className="fixed top-0 w-full z-10">
        <ClusterPanel />
      </div>

      {/* Main table of content for the page */}
      <Table
        m="md"
        p="md"
        w="95%"
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <ClusterCategory
          category="Clothes"
          clusters={clusters.clothes.filter((ele) => ele.length)}
        />
        <ClusterCategory
          category="Accessories"
          clusters={clusters.accessories.filter((ele) => ele.length)}
        />
      </Table>
    </>
  );
};
