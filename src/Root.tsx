import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { RequireAuth } from "./RequireAuth";
import { AppProvider } from "./Components/appContext";
import { Home } from "./Components/Home";
import { Auth } from "./Components/Auth";

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
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Auth />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};
