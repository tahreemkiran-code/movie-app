import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.logo}>🎬 MovieFlix</h1>

        <h2 style={styles.heading}>
          Unlimited Movies, TV Shows & Korean Dramas
        </h2>

        <p style={styles.text}>
          Watch your favorite movies anytime, anywhere.
        </p>

        <div style={styles.buttonBox}>
          <button
            style={styles.startBtn}
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

          <button
            style={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    background: "rgba(0,0,0,0.7)",
    padding: "50px",
    borderRadius: "15px",
    textAlign: "center",
    color: "white",
    width: "500px",
  },

  logo: {
    color: "red",
    fontSize: "55px",
    marginBottom: "20px",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "15px",
  },

  text: {
    fontSize: "18px",
    marginBottom: "30px",
  },

  buttonBox: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  startBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
  },

  signupBtn: {
    background: "white",
    color: "black",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default Landing;