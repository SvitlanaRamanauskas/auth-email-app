import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { HomePage } from "./Pages/HomePage";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "./Pages/LoginPage";
import { AppProvider } from "./Components/appContext";

export const Root = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<App />}>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              }
            />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};
