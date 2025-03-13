import React, { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // Import signOut
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./LoginPage.css"; // Import a CSS file for custom styles
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage("Incorrect login. Please check your email/password.");
      setShowAlert(true);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email address before signing in.");
      }

      const userId = userCredential.user.uid;
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        setUsername(userData.username);
      } else {
        throw new Error("User data not found.");
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate("/Dashboard");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle between showing and hiding password
  };

  return (
    <div className="login-page-container">
      <img src="/IconResized.png" alt="Hive Logo" className="login-logo" /> {/* Updated logo placement */}
      <h2 className="login-title">Sign in to Hive</h2> {/* Updated title placement */}
      
      <div className="login-card">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {showAlert && <div className="alert error-alert">{errorMessage}</div>}
        {showSuccessAlert && <div className="alert success-alert">Login successful! Redirecting...</div>}

        <div className="button-group">
          <button className="sign-in-button" onClick={handleSignIn}>
            Sign In
          </button>
        </div>

        <div className="signup-link">
          <span>Don't have an account? </span>
          <button onClick={() => navigate("/signup")} className="signup-link-button">
            Sign up
          </button>
        </div>

        <div className="forgot-password">
          <button onClick={() => navigate("/forgot-password")} className="forgot-password-button">
            Forgot Password?
          </button>
        </div>

        <div className="button-group">
        
      </div>
      </div>
    </div>
  );
}
