import { useContext, useEffect } from "react";
import { AppContext } from "./Components/appContext";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./api";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated, setCurrentUser, currentUser, setErrorLoadingCurrentUser, setLoadingCurrentUser } = useContext(AppContext);
  console.log("isAuth 1", isAuthenticated);

  const localUsername = localStorage.getItem("username");
  const localPassword = localStorage.getItem('password');

  useEffect(()=> {
    if (localUsername && localPassword) {
      getCurrentUser(localUsername, localPassword)
      .then((data) => {
        console.log("data", data)
        setCurrentUser(data)
        setIsAuthenticated(true);
      })
      .catch(() => setErrorLoadingCurrentUser(true))
      .finally(() => setLoadingCurrentUser(false));
    }
  
      console.log("auth-currentUser 2", currentUser, "auth-authed 2", isAuthenticated)
  }, [localUsername, localPassword, setCurrentUser, setIsAuthenticated]);

  useEffect(() => {
    console.log("auth-currentUser 3:", currentUser, "auth-authed 3:", isAuthenticated);
  }, [currentUser, isAuthenticated]);

  if (!localUsername) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
