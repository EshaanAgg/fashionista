import { useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
} from 'reactflow';
import { ImageNode } from './Node';
import { ImageEdge } from './Edge';
import {
  highlightNodes,
  resetNodeStyles,
  highlightEdges,
  resetEdgeStyles,
} from './utils';
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  const [_selectedNode, setSelectedNode] = useState<Node<ImageItem> | null>();

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
        onSelectionChange={(selectedElements) => {
          if (selectedElements.nodes.length === 0) return;
          const node = selectedElements.nodes[0];
          setSelectedNode(node);
          highlightNodes(node, nodes, edges, setNodes);
          highlightEdges(node, nodes, edges, setEdges);
        }}
        onPaneClick={() => {
          resetNodeStyles(setNodes);
          resetEdgeStyles(setEdges);
          setSelectedNode(null);
        }}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
