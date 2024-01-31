import { Table, Image } from '@mantine/core';
import { getClustersFromImageItems } from '../utils/clustering/similarity';
import { useGraphOptionsContext } from '../context/GraphOptions';

import imageData from '../data/imageItems.json';

const TableRow = (cluster: DataItemWithImage[]) => {
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
        Name: {clusterName}
        Colors:{' '}
        {Object.keys(clusterColours)
          .map((color) => `${color} (${clusterColours[color]}) `)
          .join(', ')}
        Features:{' '}
        {Object.keys(clusterFeatures)
          .map((feature) => `${feature} (${clusterFeatures[feature]}) `)
          .join(', ')}
      </Table.Td>

      {/* Images */}
      <Table.Td>
        {cluster.map((item) => (
          <Image src={item.url} key={item.url} />
        ))}
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
        <Table.Tr aria-colspan={2}>{category}</Table.Tr>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
          <Table.Th>Items</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {clusters.map((cluster, index) => (
          <TableRow {...cluster} key={index} />
        ))}
      </Table.Tbody>
    </>
  );
};

export const Clusters = () => {
  const { options } = useGraphOptionsContext();
  const clusters = getClustersFromImageItems(imageData, options);

  return (
    <Table>
      <ClusterCategory category="Clothes" clusters={clusters.clothes} />
      <ClusterCategory category="Accessories" clusters={clusters.accessories} />
    </Table>
  );
};
