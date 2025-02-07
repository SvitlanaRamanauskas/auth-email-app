import React, { useMemo, useState } from "react";

export type ContextType = {
  isAuthenticated: boolean,
  setIsAuthenticated: (value: boolean) => void,
}

type Props = {
  children: React.ReactNode;
}

export const AppContext = React.createContext<ContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated ] = useState(false);

  const values = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
  }), [
    isAuthenticated, setIsAuthenticated,
  ])
  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
  );
};
