import { useNavigate } from "react-router-dom";
import { AppContext } from "./appContext";
import { useContext, useEffect } from "react";

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
    <div className="h-screen flex flex-col flex justify-center items-center space-y-4">
      <h1 className="text-2xl">{`Hello, ${userName}`}</h1>
      <button onClick={handleLogout} className="font-sans px-6 py-3 bg-transparent text-black border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer">
        Log out
      </button>
    </div>
  );
};
