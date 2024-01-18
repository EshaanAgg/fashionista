import { Image, Card } from '@mantine/core';
import { Handle, Position } from 'reactflow';

export function ImageNode({ data }: { data: ImageItem }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card h={160} w={160} radius="xl" withBorder p="sm">
        <Image
          src={data.url}
          h="100%"
          w="auto"
          fit="contain"
          alt={`Failed to load the image ${data.url}`}
        />
      </Card>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
