import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import BackButton from "./components/BackButton";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account Created Successfully!");

    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

{/* <BackButton /> */}

<h1 style={styles.title}>
Create Account
</h1>

        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label style={styles.label}>
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          Show Password
        </label>

        <button style={styles.button} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={styles.text}>
          Already have an account?
        </p>

        <button
          style={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#111",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    background: "#1a1a1a",
    width: "400px",
    padding: "35px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(255,0,0,.3)",
    border: "1px solid #2a2a2a",
  },

  title: {
    color: "#ffffff",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #333",
    fontSize: "16px",
    boxSizing: "border-box",
    background: "#252525",
    color: "#ffffff",
  },

  label: {
    color: "#bbb",
    display: "block",
    textAlign: "left",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
  },

  text: {
    color: "#bbb",
    marginTop: "20px",
  },

  loginButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#2a2a2a",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Signup;