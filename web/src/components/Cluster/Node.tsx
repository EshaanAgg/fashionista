import { Image, HoverCard, Card, Text } from '@mantine/core';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';

export function ImageNode({ data, selected, id }: NodeProps<ImageItem>) {
  const { getEdges } = useReactFlow();
  const hasEdge = getEdges().some(
    (edge) => edge.source === id || edge.target === id
  );

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <HoverCard>
        <HoverCard.Target>
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
        </HoverCard.Target>
        <HoverCard.Dropdown p="md">
          {data.clothes.length !== 0 && (
            <>
              <Text size="sm" td="underline" c="dimmed">
                Clothes
              </Text>
              {data.clothes.map((element) => (
                <Text key={element.name} size="xs">
                  {element.name} | {element.color.join(', ')} |{' '}
                  {element.features.join(', ')}
                </Text>
              ))}
            </>
          )}
          {data.accessories.length !== 0 && (
            <>
              <Text size="sm" td="underline" c="dimmed">
                Accessories
              </Text>
              {data.accessories.map((element) => (
                <Text key={element.name} size="xs">
                  {element.name} | {element.color.join(', ')} |
                  {element.features.join(', ')}
                </Text>
              ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
