import { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { ImageNode } from './Node';
import { ImageEdge } from './Edge';
import { convertToGraph } from '../../utils/clustering/convertToGraph';
import imageData from '../../data/imageItems.json';

import 'reactflow/dist/style.css';

const initialGraph = convertToGraph(imageData, {
  seperationWidth: 250,
  seperationHeight: 180,
  maxImagesInRow: 6,
});

export function Cluster() {
  const nodeTypes = useMemo(() => ({ imageNode: ImageNode }), []);
  const edgeTypes = useMemo(() => ({ imageEdge: ImageEdge }), []);

  const [nodes, _setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        elementsSelectable={true}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
