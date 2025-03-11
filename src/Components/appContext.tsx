import React, { useMemo, useState } from "react";
import { CurrentUser } from "../types/CurrentUser";

export type ContextType = {
  currentUser: CurrentUser | null;
  setCurrentUser: (value: CurrentUser | null) => void;
  errorLoadingCurrentUser: boolean;
  setErrorLoadingCurrentUser: (value: boolean) => void;
  loadingCurrentUser: boolean;
  setLoadingCurrentUser: (value: boolean) => void;
};

type Props = {
  children: React.ReactNode;
};

export const AppContext = React.createContext<ContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  errorLoadingCurrentUser: false,
  setErrorLoadingCurrentUser:  () => {},
  loadingCurrentUser: false,
  setLoadingCurrentUser: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [errorLoadingCurrentUser, setErrorLoadingCurrentUser] = useState(false);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);

  const values = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      errorLoadingCurrentUser,
      setErrorLoadingCurrentUser,
      loadingCurrentUser,
      setLoadingCurrentUser
    }),
    [currentUser, setCurrentUser],
  );
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
