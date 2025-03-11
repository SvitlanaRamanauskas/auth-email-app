import { useContext, useEffect } from "react";
import { AppContext } from "./Components/appContext";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./api";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { setCurrentUser, setErrorLoadingCurrentUser, setLoadingCurrentUser } = useContext(AppContext);

  const localUsername = localStorage.getItem("username");
  const localPassword = localStorage.getItem('password');

  useEffect(()=> {
    if (localUsername && localPassword) {
      getCurrentUser(localUsername, localPassword)
      .then((data) => {
        setCurrentUser(data)
      })
      .catch(() => setErrorLoadingCurrentUser(true))
      .finally(() => setLoadingCurrentUser(false));
    }
  
  }, [localUsername, localPassword, setCurrentUser]);


  if (!localUsername) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
