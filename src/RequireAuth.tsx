import { useContext, useEffect } from "react";
import { AppContext } from "./Components/appContext";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./api";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated, setCurrentUser, currentUser } = useContext(AppContext);
  console.log("isAuth", isAuthenticated);

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
      // .catch(() => setErrorLoadingCurrentUser(true))
      // .finally(() => setLoadingCurrentUser(false));
    }
  
      console.log("auth-currentUser", currentUser, "auth-authed", isAuthenticated)
  }, [localUsername, localPassword, setCurrentUser, setIsAuthenticated]);

  useEffect(() => {
    console.log("auth-currentUser:", currentUser, "auth-authed:", isAuthenticated);
  }, [currentUser, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
