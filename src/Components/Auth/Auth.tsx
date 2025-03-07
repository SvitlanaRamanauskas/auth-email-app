import { useState } from "react";
import './Auth.scss';
import { FormWindow } from "../FormWindow";



export const Auth: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <>
      {!logOpen ? (
        <div className="auth">
          <h1 className="auth__title">Welcome to our website!</h1>

          <div className="auth__buttons">
            <button
              className="auth__button"
              onClick={() => {
                setIsRegistered(true);
                setLogOpen(true);
              }}
            >
              Already have an account? Log In
            </button>
            <button
              className="auth__button"
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
        <div className="auth__form">
         <FormWindow
          isRegistered={isRegistered}
          onLogOpen={setLogOpen}
         />
        </div>
      )}
    </>
  );
};