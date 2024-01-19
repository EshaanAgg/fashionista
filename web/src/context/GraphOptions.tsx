import { useState, createContext, useContext } from 'react';

type GraphContextType = {
  options: GraphOptions;
  updateOption: (key: GraphOptionsKey, value: number) => void;
};

const GraphOptionsContext = createContext<GraphContextType | null>(null);

export const GraphOptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [graphOptions, setGraphOptions] = useState<GraphOptions>({
    clothesCutoff: 1,
    accessoriesCutoff: 1,
    weightName: 0.5,
    weightColor: 0.3,
    weightFeatures: 0.2,
    seperationWidth: 250,
    seperationHeight: 180,
    maxImagesInRow: 6,
  });

  const updateOption = (key: GraphOptionsKey, value: number) => {
    setGraphOptions({
      ...graphOptions, 
      [key]: value
    })
  }

   return (
    <GraphOptionsContext.Provider value={{ options: graphOptions, updateOption }}>
      {children}
    </GraphOptionsContext.Provider>
  );
}

export const useGraphOptionsContext = () => {
  const data = useContext(GraphOptionsContext);
  if (data === null) throw new Error("The useGraphOptionsContext must be called inside a GraphOptionsProvider.")
  return data;
}