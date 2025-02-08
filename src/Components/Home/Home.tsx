import { useNavigate } from "react-router-dom";
import { AppContext } from "../appContext";
import { useContext, useEffect } from "react";
import "./Home.scss";

export const Home: React.FC = () => {
  const { setIsAuthenticated, userName, setUserName} = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          const response = await fetch("http://localhost:5000/api/v1/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
         const data = await response.json();
         console.log(data)
          const userName = data.username;
          setUserName(userName);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user info", error);
        setIsAuthenticated(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <h1>{`Hello, ${userName}`}</h1>
      <button onClick={handleLogout} className="home__button">
        Log out
      </button>
    </>
  );
};
