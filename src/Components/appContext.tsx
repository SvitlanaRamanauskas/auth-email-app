import React, { useMemo, useState } from "react";
import { CurrentUser } from "../types/CurrentUser";

export type ContextType = {
  isAuthenticated: boolean,
  setIsAuthenticated: (value: boolean) => void,
  currentUser: CurrentUser | null,
  setCurrentUser: (value: CurrentUser | null) => void,
}

type Props = {
  children: React.ReactNode;
}

export const AppContext = React.createContext<ContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentUser: null,
  setCurrentUser: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated ] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const values = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser
  }), [
    isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser
  ])
  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
  );
};
