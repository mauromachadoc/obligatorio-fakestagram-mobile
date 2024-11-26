import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface DataContextType {
  data: {
    title: string;
  }
  setData: Dispatch<SetStateAction<any>>;
}

const ModalContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<{
    title: string;
  }>({
    title: ''
  });

  return (
    <ModalContext.Provider value={{ data, setData }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
