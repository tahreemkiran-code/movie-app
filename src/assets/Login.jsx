import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import BackButton from "./components/BackButton";

function Login() {
  const navigate = useNavigate();

  const email = "admin@gmail.com";
  const password = "1234";

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleLogin = () => {
    if (userEmail === email && userPassword === password) {
      navigate("/home");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={styles.container}>
     <div style={styles.box}>

{/* <BackButton /> */}

<h1 style={styles.title}>
🎬 Movie Flix Login
</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={styles.text}>
          Demo Login <br />
          Email: admin@gmail.com <br />
          Password: 1234
        </p>

        <p style={styles.signup}>
          Don't have an account?
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            {" "}Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#111",
  },

  box: {
    width: "370px",
    background: "#222",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 0 20px rgba(255,0,0,0.4)",
  },

  title: {
    marginBottom: "20px",
    color: "red",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  text: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#ccc",
  },

  signup: {
    marginTop: "20px",
    color: "#fff",
  },

  link: {
    color: "red",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;