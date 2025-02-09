import { useContext } from "react";
import { AppContext } from "./Components/appContext";
import { testAuthApi } from "./testingAuthAPI";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({children} : {children: React.ReactNode }) => {
    const { isAuthenticated } = useContext(AppContext);
    console.log("isAuthenticated:", isAuthenticated, testAuthApi());

    if (!testAuthApi()) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
}