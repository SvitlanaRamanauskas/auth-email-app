import { CurrentUser } from "../../types/CurrentUser";
import { z } from "zod";
import "./Email.scss";
import { Loader } from "../Loader";
import { EditorState, convertToRaw } from "draft-js";
import { sendEmail } from "../../api";
import { MessageEditor } from "../MessageEditor";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  recipient: z
    .string()
    .max(254, "Email address must be at most 254 characters.")
    .email("Invalid email address."),

  subject: z
    .string()
    .min(1, "Subject is required.")
    .max(255, "Subject must be at most 255 characters."),
  message: z
    .string()
    .min(1, "Message is required.")
    .max(5000, "Message must be at most 5000 characters."),
});

type FormDataEmail = z.infer<typeof emailSchema>;

type Props = {
  currentUser: CurrentUser | null;
};

export const Email: React.FC<Props> = ({ currentUser }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormDataEmail>({
    resolver: zodResolver(emailSchema),
    defaultValues: { recipient: "", subject: "", message: "" },
  });

  const [sendingEmail, setSendingEmail] = useState(false);
  const [errorSendingEmail, setErrorSendingEmail] = useState<string | null>(
    null,
  );
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  const handleSendEmail = async (data: FormDataEmail) => {
    if (!currentUser) return;

    setSendingEmail(true);
    setErrorSendingEmail(null);

    // const content = JSON.stringify(
    //   convertToRaw(editorState.getCurrentContent())
    // );

    const emailData = {
      sender: currentUser.id,
      recipient: data.recipient,
      subject: data.subject,
      message: data.message,
    };

    try {
      await sendEmail(emailData);
      reset();
      setEditorState(EditorState.createEmpty());
    } catch {
      setErrorSendingEmail("Error sending email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    const plainText = rawContent.blocks.map((block) => block.text).join("\n");

    setValue("message", plainText); // Оновлюємо поле у react-hook-form
  };

  return (
    <article className="email">
      {sendingEmail && <Loader />}
      {errorSendingEmail && <p>{errorSendingEmail}</p>}

      <form onSubmit={handleSubmit(handleSendEmail)} className="email__form">
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
        <Controller
          name="recipient"
          control={control}
          render={({ field }) => (
            <input className="email__input" type="email" {...field} />
          )}
        />
        {errors.recipient && (
          <p className="error">{errors.recipient.message}</p>
        )}

        <label htmlFor="subject" className="email__label">
          Letter subject:
        </label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <input className="email__input" type="text" {...field} />
          )}
        />
        {errors.subject && <p className="error">{errors.subject.message}</p>}

        <MessageEditor
          setEditorState={handleEditorChange}
          editorState={editorState}
        />
        {errors.message && <p className="error">{errors.message.message}</p>}

        <button className="home__button email__button" type="submit">
          Send
        </button>

        <div className="email__button-wrapper">
          <button
            className="home__button email__button email__button--reset"
            type="button"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </form>
    </article>
  );
};
