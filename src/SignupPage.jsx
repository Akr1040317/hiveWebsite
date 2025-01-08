import React, { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css"; // Reusing the same CSS as LoginPage

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [showRegistrationSuccessAlert, setShowRegistrationSuccessAlert] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const navigate = useNavigate();

  const checkUsernameAvailability = async (username) => {
    try {
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      setIsUsernameAvailable(!usernameDoc.exists());
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      const userDoc = {
        id: userCredential.user.uid,
        fullname,
        email,
        role: "userTier0",
        username,
        pointsWeekly: 0,
        pointsTotal: 0,
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userDoc);
      await setDoc(doc(db, "usernames", username), {
        createdAt: new Date(),
        username,
      });

      setShowRegistrationSuccessAlert(true);
      setRegistrationCompleted(true);
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-page-container">
      <img src="IconResized.png" alt="Hive Logo" className="login-logo" />
      <h2 className="login-title">Sign up to Hive</h2>

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

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
          />
          {!isUsernameAvailable && <span className="error-message">Username is taken</span>}
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group password-group">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {password && confirmPassword && (
            <span className={`password-match-indicator ${password === confirmPassword ? "match" : "no-match"}`}>
              {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
            </span>
          )}
        </div>

        {showRegistrationSuccessAlert && (
          <div className="alert success-alert">
            Registration Successful. Please verify your email before signing in.
          </div>
        )}

        <div className="button-group">
          <button
            className="sign-in-button"
            onClick={handleSignup}
            disabled={
              !email.includes("@") ||
              password.length <= 5 ||
              password !== confirmPassword ||
              !fullname ||
              !username ||
              !isUsernameAvailable
            }
          >
            Sign Up
          </button>
        </div>

        <div className="signup-link">
          <span>Already have an account? </span>
          <button onClick={() => navigate("/login")} className="signup-link-button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
