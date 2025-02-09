import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "./Loader";
import { AppContext } from "./appContext";
import { loginUser, registerUser } from "../testingAuthAPI";

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
  const [isRegistered, setIsRegistered] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AppContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataLogin | FormDataRegister>({
    resolver: zodResolver(isRegistered ? loginSchema : registerSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  useEffect(() => {
    reset({ name: "", username: "", password: "" });
  }, [reset]);

  const onSubmit = async (data: FormDataLogin | FormDataRegister) => {
    setLoading(true);
    setError("");

    try {
      let response;
      if (isRegistered) {
        response = await loginUser(data);
        console.log("Login successful, token:", response.accessToken);
      } else {
        response = await registerUser(data);
      }

      localStorage.setItem("authToken", response.accessToken);
      console.log("Response from login or register:", response);
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
    setError("");
    reset();
  };

  return (
    <>
      {!logOpen ? (
        <div className="h-screen bg-white-400 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">Welcome to our website!</h1>
          <div className="flex gap-4 mt-5">
            <button
              className="px-6 py-3 bg-transparent text-black border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer"
              onClick={() => {
                setIsRegistered(true);
                setLogOpen(true);
              }}
            >
              Already have an account? Log In
            </button>
            <button
              className="px-6 py-3 bg-transparent text-black border border-black rounded-md hover:bg-black hover:text-white transition cursor-pointer"
              onClick={() => {
                setIsRegistered(false);
                setLogOpen(true);
              }}
            >
              Dont't have an account? Register
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="relative">
            <button 
              className="absolute -top-15 text-gray-500 cursor-pointer border border-gray-500 rounded-lg p-1 hover:bg-gray-100 transition"
              onClick={() => setLogOpen(false)}
            >
              go back
            </button>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full md:w-[50vw] lg:w-[30vw] m-6 md:m-0 shadow-lg rounded-lg p-3"
            >
              <fieldset className="">
                <h3 className="text-xl font-semibold text-center">
                  {isRegistered ? "Log In" : "Register"}
                </h3>

                <div>
                  <label className="block font-medium" htmlFor="name">
                    Name
                  </label>

                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <input
                        {...field}
                        id="name"
                        type="text"
                        className="w-full p-2 border-b border-gray-400 focus:outline-none"
                        placeholder="Name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium" htmlFor="password">
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
                        className="w-full p-2 border-b border-gray-400 focus:outline-none"
                        placeholder="Password"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 font-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium" htmlFor="username">
                    Username
                  </label>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field }) => (
                      <input
                        {...field}
                        id="username"
                        type="username"
                        className="w-full p-2 border-b border-gray-400 focus:outline-none"
                        placeholder="Username"
                      />
                    )}
                  />
                  {errors.username && (
                    <p className="text-red-500 font-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {error && <p className="text-red-500 font-sm">{error}</p>}

                <div className="flex flex-row mt-4 space-x-6">
                  <button
                    className="flex-grow h-10 bg-black text-white p-2 hover:text-black hover:bg-yellow-500 transition cursor-pointer flex justify-center items-center"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader />
                    ) : isRegistered ? (
                      "Submit"
                    ) : (
                      "Register"
                    )}
                  </button>

                  <button
                    className="flex-grow h-10 p-2 border border-gray-500 rounded-md hover:bg-gray-100 transition cursor-pointer"
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
        </div>
      )}
    </>
  );
};