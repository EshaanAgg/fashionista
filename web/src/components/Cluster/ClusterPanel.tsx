import { useState } from 'react';
import { Panel } from 'reactflow';
import { useReactFlow } from 'reactflow';
import { Slider, Text, Box } from '@mantine/core';
import { useGraphOptionsContext } from '../../context/GraphOptions';
import { convertToGraph } from '../../utils/clustering/convertToGraph';
import imageData from '../../data/imageItems.json';

const TuneableOptions = [
  'clothesCutoff',
  'accessoriesCutoff',
  'weightName',
  'weightColor',
  'weightFeatures',
];

export function ClusterPanel() {
  const { options, updateOption } = useGraphOptionsContext();
  const { setNodes, setEdges } = useReactFlow();

  const [values, setValues] = useState<GraphOptions>({ ...options });

  return (
    <Panel position="top-right">
      <Box maw={600} className="p-4 m-4 bg-white border-2 border-black">
        {(Object.keys(values) as GraphOptionsKey[])
          .filter((key) => TuneableOptions.includes(key))
          .map((key) => (
            <div key={key}>
              <Text size="sm"> {key} </Text>
              <Slider
                value={values[key]}
                onChange={(newValue) => {
                  setValues({
                    ...values,
                    [key]: newValue,
                  });
                }}
                onChangeEnd={(newValue) => {
                  updateOption(key, newValue);
                  const newGraph = convertToGraph(imageData, {
                    ...options,
                    [key]: newValue,
                  });
                  setNodes(newGraph.nodes);
                  setEdges(newGraph.edges);
                }}
                min={0}
                max={1.5}
                step={0.005}
              />
            </div>
          ))}
      </Box>
    </Panel>
  );
}
