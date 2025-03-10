import { useContext, useEffect } from "react";
import { AppContext } from "./Components/appContext";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  console.log("isAuth", isAuthenticated);

  useEffect(() => {
    const localUsername = localStorage.getItem('username');
    const localPassword = localStorage.getItem('password');

    if (localUsername && localPassword) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
