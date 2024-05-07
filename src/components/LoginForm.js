import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { dataRef } from "../firebase-config";
import { Home } from "@mui/icons-material";
import "./Login.css";

const LoginForm = ({ setUserRole }) => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const registrationsRef = dataRef.ref("registrations").child(applicationNumber);

    try {
      const snapshot = await registrationsRef.once("value");
      const userData = snapshot.val();

      if (userData) {
        if (userData.password === password) {
          setUserRole(userData.role);
          navigate(`/assignments/${userData.department}`);
        } else {
          setError("Incorrect password. Please try again.");
        }
      } else {
        setError("Application number not found.");
      }
    } catch (err) {
      setError("An error occurred while trying to log in. Please try again later.");
    }
  };

  return (
    <div className="loginContainer">
      <div className="leftPanel">
        <h1 className="Header1">
          <span>WORK</span> <span>TRACKING</span> <span>MADE</span> <span>EASY</span><span className="light">No more dues</span>
        </h1>
      </div>
      <div className="rightPanel">
        <div className="ripcone">
        <div className="homeButtonContainer">
          <Link to="/" className="homeButton">
            <Home />
          </Link>
        </div>
        <h1 >Login</h1>
        {error && <div className="errorMessage">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Application Number"
            type="text"
            value={applicationNumber}
            className="inputContainer"
            onChange={(e) => setApplicationNumber(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            className="inputContainer"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="loginButton">
            Login
          </button>
          <p className="notUser">
          Not a user? <Link to="/registration">Sign up</Link>
        </p>
        </form>
      </div>
      </div>
    </div>
  );
};

export default LoginForm;
