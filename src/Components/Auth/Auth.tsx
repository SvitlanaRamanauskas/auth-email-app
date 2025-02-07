import { useContext, useEffect, useState } from "react";
import cn from "classnames";
import { AppContext } from "../appContext";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";
import { Loader } from "../Loader";
import { loginUser, registerUser } from "../../testingAuthAPI";
// import { AuthResponse } from "../../Types/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(40, "Username must be at most 40 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers, and underscores."
    ),

  name: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(40, "Username must be at most 40 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers, and underscores."
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be at most 50 characters.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(40, "Name must be at most 40 characters.")
    .regex(/^[a-zA-Z]+$/, "Name must contain only letters."),

  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(40, "Username must be at most 40 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers, and underscores."
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be at most 50 characters.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
});

type FormDataLogin = z.infer<typeof loginSchema>;
type FormDataRegister = z.infer<typeof registerSchema>;

export const Auth: React.FC = () => {
  const { setIsAuthenticated } = useContext(AppContext);

  const [isRegistered, setIsRegistered] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataLogin | FormDataRegister>({
    resolver: zodResolver(isRegistered ? loginSchema : registerSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    reset({ name: "", username: "", password: "" });
  }, [reset]);

  const onSubmit = async (data: FormDataLogin | FormDataRegister) => {
    setLoading(true);
    setError("");

    try {
      let response;
      if (isRegistered) {
        // Handle login logic
        response = await loginUser(data);
        console.log("Login successful, token:", response.token);
      } else {
        // Handle registration logic
        response = await registerUser(data);
        // console.log("Registration successful, token:", response.token);
      }
      localStorage.setItem("authToken", response.token); // Mock token for testing
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <div className="auth__top">
        <h1>Welcome to the login page</h1>
        <div className="auth__button-wrapper">
          <button
            className="auth__button auth__button--choise"
            onClick={() => {
              setIsRegistered(true);
              setLogOpen(true);
            }}
          >
            "Already have an account? Log In"
          </button>
          <button
            className="auth__button auth__button--choise"
            onClick={() => {
              setIsRegistered(false);
              setLogOpen(true);
            }}
          >
            "Dont't have an account? Register"
          </button>
        </div>
      </div>

      <div
        className={cn("auth", {
          "auth--visible": logOpen,
          "auth--hidden": !logOpen,
        })}
      >
        <div className="auth__content">
          <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
            <fieldset className="auth__fieldset">
              <h3 className="auth__title">
                {isRegistered ? "Log In" : "Register"}
              </h3>

              <div className="auth__input-container">
                <label htmlFor="name">Name</label>

                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <input
                      {...field}
                      id="name"
                      type="text"
                      className="auth__input auth__input--name"
                      placeholder="name"
                    />
                  )}
                />
                {errors.name && (
                  <p style={{ color: "red" }}>{errors.name.message}</p>
                )}
              </div>

              <div className="auth__input-container">
                <label htmlFor="password">Password</label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <input
                      {...field}
                      id="password"
                      type="password"
                      className="auth__input auth__input--email"
                      placeholder="password"
                    />
                  )}
                />
                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password.message}</p>
                )}
              </div>

              <div className="auth__input-container">
                <label htmlFor="confirmPassword">Username</label>
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <input
                      {...field}
                      id="username"
                      type="username"
                      className="auth__input auth__input--email"
                      placeholder="username"
                    />
                  )}
                />
                {errors.username && (
                  <p style={{ color: "red" }}>{errors.username.message}</p>
                )}
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button
                className="auth__button auth__button--submit"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader /> : isRegistered ? "Submit" : "Register"}
              </button>

              <button
                className=""
                type="reset"
                disabled={loading}
                onClick={handleReset}
              >
                Reset
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
