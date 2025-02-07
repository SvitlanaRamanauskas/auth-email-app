import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import { HomePage } from "./Pages/HomePage";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "./Pages/LoginPage";


export const Root = () => {
  return (
    <Router>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}