import React from 'react';
import { getIncomers, getOutgoers, Node, Edge } from 'reactflow';

const REDUCED_OPACITY = 0.18;

const getNodesToHighlight = (node: Node, nodes: Node[], edges: Edge[]) => {
  const allIncomers = getIncomers(node, nodes, edges);
  const allOutgoers = getOutgoers(node, nodes, edges);
  return [...allIncomers, ...allOutgoers, node];
};

export const highlightNodes = (
  node: Node,
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node<ImageItem>[]>>
) => {
  const nodeIdsToHighlight = getNodesToHighlight(node, nodes, edges).map(
    (node) => node.id
  );

  setNodes((nodes) => {
    return nodes.map((elem) => {
      elem.style = {
        ...elem.style,
        opacity: nodeIdsToHighlight.includes(elem.id) ? 1 : REDUCED_OPACITY,
        zIndex: nodeIdsToHighlight.includes(elem.id) ? 1 : -1,
      };

      return elem;
    });
  });
};

const getConnectedEdges = (nodeId: string, edges: Edge[]) => {
  return edges.filter((edge) => {
    return nodeId === edge.source || nodeId === edge.target;
  });
};

export const highlightEdges = (
  node: Node,
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  const edgeIdsToHighlight = getConnectedEdges(node.id, edges).map(
    (edge) => edge.id
  );

  setEdges((edges) => {
    return edges.map((elem) => {
      const selected = edgeIdsToHighlight.includes(elem.id);
      elem.animated = selected;
      elem.style = {
        ...elem.style,
        stroke: selected ? 'black' : 'grey',
        opacity: selected ? 1 : REDUCED_OPACITY,
        zIndex: selected ? 1 : -1,
      };
      return elem;
    });
  });
};

export const resetNodeStyles = (
  setNodes: React.Dispatch<React.SetStateAction<Node<ImageItem>[]>>
) => {
  setNodes((nodes) => {
    return nodes.map((elem) => {
      elem.style = {
        ...elem.style,
        opacity: 1,
        zIndex: 0,
      };
      return elem;
    });
  });
};

export const resetEdgeStyles = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  setEdges((edges) => {
    return edges.map((elem) => {
      elem.animated = false;
      elem.style = {
        ...elem.style,
        stroke: 'black',
        opacity: 1,
        zIndex: 0,
      };
      return elem;
    });
  });
};
