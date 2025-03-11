import { useContext, useEffect, useState } from "react";
import "./FormWindow.scss";
import { z } from "zod";
import { Loader } from "../Loader/Loader";
import { Controller, Resolver, useForm } from "react-hook-form";
import { createUser, getCurrentUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../appContext";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username  is required.")
    .max(150, "Username must be at most 150 characters.")
    .regex(
      /^[\w.@+-]+$/,
      "Username can contain only letters, digits, and @/./+/-/_."
    ),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must be at most 128 characters."),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username  is required.")
    .max(150, "Username must be at most 150 characters.")
    .regex(
      /^[\w.@+-]+$/,
      "Username can contain only letters, digits, and @/./+/-/_."
    ),

  email: z
    .string()
    .max(254, "Name must be at most 254 characters.")
    .email("Invalid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must be at most 128 characters."),
});

type FormDataRegister = z.infer<typeof registerSchema>;
type FormDataLogin = z.infer<typeof loginSchema>;

type Props = {
  isRegistered: boolean;
  onLogOpen: (value: boolean) => void;
};

export const FormWindow: React.FC<Props> = ({
  isRegistered,
  onLogOpen,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser } = useContext(AppContext);

  const getValidationSchema = (isRegistered: boolean) => {
    return isRegistered ? loginSchema : registerSchema;
  };


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataRegister | FormDataLogin>({
    resolver: zodResolver(getValidationSchema(isRegistered)) as Resolver<FormDataRegister | FormDataLogin>,
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    reset({ username: "", email: "", password: "" });
  }, [reset]);

  const onSubmitRegistration = async (data: FormDataRegister) => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setLoading(true);
    setError("");

    try {
      const response = await createUser(data);

      if (response && response.id) {
        localStorage.setItem("username", response.username);
        localStorage.setItem("email", response.email);
        localStorage.setItem("userId", response.id.toString());
      }
      window.alert("Please, now log in with your credentials");

      onLogOpen(true);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = err as { data: { username?: string[] } };

        if (errorData.data.username) {
          setError(errorData.data.username[0]);
          return;
        }
      }

      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitLogin = async (data: FormDataLogin) => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setLoading(true);
    setError("");

    try {
      const response = await getCurrentUser(data.username, data.password);
      setCurrentUser(response);

      if (response && response.success) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("password", data.password);

        setIsAuthenticated(true);
        
        navigate("/");
      }

    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "status" in err) {
        const error = err as { status: number; data?: { username?: string[] } };
  
        if (error.status === 401) {
          setError("Unauthorized: No user with such credentials.");
          return;
        }
      }
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: FormDataLogin | FormDataRegister) => {
    if (isRegistered) {
      onSubmitLogin(data as FormDataLogin);
    } else {
      onSubmitRegistration(data as FormDataRegister);
    }
  };

  const handleReset = () => {
    setError("");
    reset();
  };


  return (
    <div className="form">
      <button className="form__back" onClick={() => onLogOpen(false)}>
        Go back
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="form__window">
        <fieldset className="form__fieldset">
          <h3 className="title form__title">
            {isRegistered ? "Log In" : "Register"}
          </h3>

          <div>
            <label className="form__label" htmlFor="username">
              Username
            </label>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <input
                  {...field}
                  id="username"
                  type="text"
                  className="form__input"
                />
              )}
            />
            {errors.username && (
              <p className="form__error">{errors.username.message}</p>
            )}
          </div>

          {!isRegistered && (
            <div>
              <label className="form__label" htmlFor="email">
                Email
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className="form__input"
                  />
                )}
              />
              {("email" in errors) && errors.email && <p className="form__error">{errors.email.message}</p>}
            </div>
          )}

          <div>
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type="password"
                  className="form__input"
                />
              )}
            />
            {errors.password && (
              <p className="form__error">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="form__error">{error}</p>}

          <div className="form__button-wrapper">
            <button className="form__button" type="submit" disabled={loading}>
              {loading ? <Loader /> : isRegistered ? "Log In" : "Register"}
            </button>

            <button
              className="form__button form__button--reset"
              type="reset"
              disabled={loading}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
