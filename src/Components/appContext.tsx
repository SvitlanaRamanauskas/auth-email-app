import React, { useMemo, useState } from "react";

export type ContextType = {
  isAuthenticated: boolean,
  setIsAuthenticated: (value: boolean) => void,
  userName: string,
  setUserName: (value: string) => void,
}

type Props = {
  children: React.ReactNode;
}

export const AppContext = React.createContext<ContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userName: "",
  setUserName: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated ] = useState(false);
  const [userName, setUserName] = useState("");

  const values = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    userName,
    setUserName,
  }), [
    isAuthenticated, setIsAuthenticated, userName, setUserName
  ])
  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
  );
};
