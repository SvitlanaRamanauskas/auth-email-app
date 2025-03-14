import { useNavigate } from "react-router-dom";
import "./Home.scss";
import { AppContext } from "../appContext";
import { useContext, useEffect, useState } from "react";
import { getEmails } from "../../api";
import { Loader } from "../Loader";
import { Email } from "../Email";
import { EmailList } from "../EmailList";
import { EmailType } from "../../types/Email";
import { Pagination } from "../Pagination";

export const Home: React.FC = () => {
  const [letterOpen, setLetterOpen] = useState(false);

  const [emailsFromServer, setEmailsFromServer] = useState<EmailType[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [errorEmails, setErrorEmails] = useState<string | null>(null);

  const { currentUser, loadingCurrentUser, errorLoadingCurrentUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const toggleLetterOpen = () => {
    setLetterOpen((prev) => !prev);
  };

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
    if (next && currentUser) {
      setCurrentPage((prev) => {
        const newPage = prev + 1;
        fetchEmails(currentUser.id, newPage);
        return newPage;
      });
    }
  };

  const handlePreviousPage = () => {
    if (previous && currentUser) {
      setCurrentPage((prev) => {
        const newPage = prev - 1;
        fetchEmails(currentUser.id, newPage);
        return newPage;
      });
    }
  };

  return (
    <div className="home">
      <section className="home__section home__section--top">
        <div className="title home__name">
          <h2 className="home__title">{`User: ${currentUser?.username}`}</h2>
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
        <p className="home__message">Error loading current user</p>
      )}
      {!errorLoadingCurrentUser && loadingCurrentUser && <Loader />}

      <section className="home__section home__section--bottom">
        {letterOpen && <Email currentUser={currentUser} />}

        <article className="home__list">
          {!loadingEmails && !errorEmails && emailsFromServer.length > 0 && (
            <>
              <EmailList emails={emailsFromServer} />
              <Pagination
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                previous={previous}
                next={next}
                count={count}
                currentPage={currentPage}
              />
            </>
          )}

          {loadingEmails && !errorEmails && <Loader />}
          {errorEmails && !loadingEmails && <p className="home__message">Error getting emails</p>}

          {!loadingEmails && !errorEmails && emailsFromServer.length === 0 && (
            <p className="home__message">No emails yet</p>
          )}
        </article>
      </section>
    </div>
  );
};
