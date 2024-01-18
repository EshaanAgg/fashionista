import ReactFlow from 'reactflow';
import { convertToGraph } from '../utils/clustering/convertToGraph';
import imageData from '../data/imageItems.json';

import 'reactflow/dist/style.css';

const initialGraph = convertToGraph(imageData, {});

export function Cluster() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={initialGraph.nodes} edges={initialGraph.edges} />
    </div>
  );
}
