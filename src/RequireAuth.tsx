import { useContext, useEffect } from "react";
import { AppContext } from "./Components/appContext";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const localUsername = localStorage.getItem("username");
    const localPassword = localStorage.getItem("password");

    if (localUsername && localPassword) {
      setIsAuthenticated(true);
    } else {
      <Navigate to="/login" replace />;
    }
  }, []);

  if (!isAuthenticated) return null;

  console.log("isAuthenticated:", isAuthenticated);

  return <>{children}</>;
};
