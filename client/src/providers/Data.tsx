import * as React from 'react';

const { createContext, Children, useState } = React;
export interface Data {
  posts?: Components.Schemas.PostList;
}
const data: Data = {};
type SetData = (u: Data) => void;
export interface DataContext {
  data: Data;
  setData: SetData;
}
export const DataContext = createContext<DataContext>({
  data,
  setData: () => {},
});

export const DataConsumer = DataContext.Consumer;

export const DataProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [dataState, setData] = useState<Data>(data);
  const setGlobalData = (arg: Data) => {
    setData({ ...dataState, ...arg });
  };
  const value: DataContext = {
    setData: setGlobalData,
    data: dataState,
  };

  return (
    <DataContext.Provider value={value}>
      {Children.only(children)}
    </DataContext.Provider>
  );
};
