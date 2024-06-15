"use client";

import { createContext, useContext, useState } from "react";

export type ConnectionsProviderProps = {
  googleNode: {}[];
  setGoogleNode: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialValues: ConnectionsProviderProps = {
  googleNode: [],
  setGoogleNode: () => undefined,
  isLoading: false,
  setIsLoading: () => undefined,
};

const ConnectionsContext =
  createContext<ConnectionsProviderProps>(initialValues);
const { Provider } = ConnectionsContext;

export const ConnectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [googleNode, setGoogleNode] = useState(initialValues.googleNode);
  const [isLoading, setIsLoading] = useState(initialValues.isLoading);

  const values = {
    googleNode,
    setGoogleNode,
    isLoading,
    setIsLoading,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useNodeConnections = () => {
  const nodeConnections = useContext(ConnectionsContext);
  return { nodeConnections };
};
