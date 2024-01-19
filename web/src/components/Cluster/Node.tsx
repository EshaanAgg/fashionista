import { Image, Card } from '@mantine/core';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';

export function ImageNode({ data, selected, id }: NodeProps<ImageItem>) {
  const { getEdges } = useReactFlow();
  const hasEdge = getEdges().some(
    (edge) => edge.source === id || edge.target === id
  );

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card
        h={160}
        w={160}
        radius="xl"
        withBorder
        p="sm"
        bg={selected ? 'blue.2' : hasEdge ? 'white' : 'red.1'}
      >
        <Image
          src={data.url}
          h="100%"
          w="auto"
          fit="contain"
          alt={`Failed to load the image ${data.url}`}
        />
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
