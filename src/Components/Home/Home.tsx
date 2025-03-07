import { useNavigate } from "react-router-dom";
import "./Home.scss";
import { AppContext } from "../appContext";
import { useContext, useEffect, useState } from "react";
import { getCurrentUser, getEmails } from "../../api";
import { Loader } from "../Loader";
import { Email } from "../Email";
import { EmailList } from "../EmailList";
import { EmailType } from "../../types/Email";

const PAGE_SIZE = 4;

export const Home: React.FC = () => {
  const [errorLoadingCurrentUser, setErrorLoadingCurrentUser] = useState(false);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const [emailsFromServer, setEmailsFromServer] = useState<EmailType[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [errorEmails, setErrorEmails] = useState<string | null>(null);

  const { setIsAuthenticated, currentUser, setCurrentUser } =
    useContext(AppContext);
  const navigate = useNavigate();
  const localUsername = localStorage.getItem("username");
  const localPassword = localStorage.getItem("password");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleLetterOpen = () => {
    setLetterOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!localUsername || !localPassword) {
      setErrorLoadingCurrentUser(true);
      return;
    }

    setLoadingCurrentUser(true);
    setErrorLoadingCurrentUser(false);

    getCurrentUser(localUsername, localPassword)
      .then((data) => setCurrentUser(data))
      .catch(() => setErrorLoadingCurrentUser(true))
      .finally(() => setLoadingCurrentUser(false));
  }, []);

  const fetchEmails = async (userId: number, page: number) => {
    if (!userId) return;
    setLoadingEmails(true);
    setErrorEmails(null);

    getEmails(userId, page)
      .then((data) => {
        setEmailsFromServer(data.results);
        setCount(data.count);
        setNext(data.next);
        setPrevious(data.previous);
      })
      .catch(() => setErrorEmails("Error fetching emails"))
      .finally(() => setLoadingEmails(false));
  };

  useEffect(() => {
    if (currentUser) {
      fetchEmails(currentUser?.id, currentPage);
    }
  }, [currentPage, currentUser]);

  const handleNextPage = () => {
    if (next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="home">
      <section className="home__section home__section--top">
        <div className="home__name">
          <h1 className="home__title">{`User: ${currentUser?.username}`}</h1>
          <p className="home__mail">{`Email address: ${currentUser?.email}`}</p>
        </div>
        <div className="home__button-container">
          <button
            onClick={handleLogout}
            className="home__button home__button--logout"
          >
            Log out
          </button>
          <button
            onClick={toggleLetterOpen}
            className="home__button home__button--logout"
          >
            {!letterOpen ? "Send letter" : "Close Letter"}
          </button>
        </div>
      </section>

      {errorLoadingCurrentUser && !loadingCurrentUser && (
        <p>Error loading current user</p>
      )}
      {!errorLoadingCurrentUser && loadingCurrentUser && <Loader />}

      
        <section className="home__section home__section--bottom">
          
        {letterOpen && (
          <Email currentUser={currentUser} />
        )}
          {!loadingEmails 
          && !errorEmails 
          && emailsFromServer.length > 0 
          && <EmailList emails={emailsFromServer} />}
          
          {loadingEmails && !errorEmails && <Loader />}

          {errorEmails && !loadingEmails && <p>Error getting emails</p>}

          {!loadingEmails && !errorEmails && emailsFromServer.length === 0 && (
            <p>No emails yet</p>
          )}

          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={!previous}>
              Prev
            </button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={!next}>
              Next
            </button>
          </div>
        </section>
    </div>
  );
};
