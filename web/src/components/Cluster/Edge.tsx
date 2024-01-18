import { Text } from '@mantine/core';
import {
  BezierEdge,
  EdgeProps,
  EdgeLabelRenderer,
  getBezierPath,
} from 'reactflow';

export function ImageEdge(
  props: EdgeProps<{
    clothes: string[];
    accessories: string[];
  }>
) {
  const [, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
  });

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <Text
          size="xs"
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          {props.data?.clothes.join(', ')}
          <br />
          {props.data?.accessories.join(', ')}
        </Text>
      </EdgeLabelRenderer>
    </>
  );
}
