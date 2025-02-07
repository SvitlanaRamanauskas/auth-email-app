import { useNavigate } from "react-router-dom";
import { AppContext } from "../appContext";
import { useContext } from "react";
import "./Home.scss";

export const Home:React.FC = () => {
  const { setIsAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate("/login");
  };
  return (
    <>
    <h1>Welcome to out page</h1>
    <button 
      onClick={handleLogout}
      className="home__button"
    >
      Log out
    </button>
    </>
  );
}