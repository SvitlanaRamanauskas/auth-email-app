import { useState } from "react";
import { CurrentUser } from "../../types/CurrentUser";
import "./Email.scss";
import { Loader } from "../Loader";
import { sendEmail } from "../../api";

type Props = {
  currentUser: CurrentUser | null;
};

export const Email: React.FC<Props> = ({ currentUser }) => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [errorSendingEmail, setErrorSendingEmail] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!currentUser) return;

    setSendingEmail(true);
    setErrorSendingEmail(null);

    const emailData = {
      sender: currentUser.id,
      recipient,
      subject,
      message,
    };

    try {
      await sendEmail(emailData);
      setRecipient("");
      setSubject("");
      setMessage("");
    } catch {
      setErrorSendingEmail("Error sending email");
    } finally {
      setSendingEmail(false);
    }
  };
  return (
    <article className="email">
      {sendingEmail && <Loader />}
      {errorSendingEmail && <p>Error loading emails</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendEmail();
        }}
        className="email__form"
      >
        <label htmlFor="sender" className="email__label">
          Sender:
        </label>
        <input
          className="email__input"
          type="text"
          id="sender"
          name="sender"
          value={currentUser?.email}
          disabled
        />

        <label htmlFor="recipient" className="email__label">
          Send to:
        </label>
        <input
          className="email__input"
          type="email"
          id="recipient"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        <label htmlFor="subject" className="email__label">
          Letter subject:
        </label>
        <input
          className="email__input"
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <label htmlFor="message" className="email__label">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        <button className="home__button email__button" type="submit">
          Send
        </button>
      </form>
    </article>
  );
};
