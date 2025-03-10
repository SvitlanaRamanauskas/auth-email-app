import { EmailType } from "../../types/Email";
import "./EmailList.scss";

type Props = {
  emails: EmailType[];
};
export const EmailList: React.FC<Props> = ({ emails }) => {
  return (
    <article className="list">
      <table className="list__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Recipient</th>
            <th>Subject</th>
          </tr>
        </thead>

        <tbody>
          {emails.map((email) => (
            <tr key={email.id}>
              <td>{email.id}</td>
              <td>{email.recipient}</td>
              <td>{email.subject}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};
