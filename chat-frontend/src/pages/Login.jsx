// // import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import API from "../config/api";
// // import "./AuthPages.css";

// // const Login = ({ setUser }) => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   const submitHandler = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const { data } = await API.post("/users/login", {
// //         email,
// //         password,
// //       });

// //       // ✅ Save user + token
// //       localStorage.setItem("userInfo", JSON.stringify(data));

// //       // ✅ Set user in App state
// //       setUser(data);

// //       // ✅ Redirect to chat page
// //       navigate("/chat");

// //     } catch (err) {
// //       alert(err.response?.data?.message || "Login failed");
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <form className="auth-form" onSubmit={submitHandler}>
// //         <h2>Login</h2>

// //         <input
// //           type="email"
// //           placeholder="Enter Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />

// //         <input
// //           type="password"
// //           placeholder="Enter Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />

// //         <button type="submit">Login</button>

// //         <p>
// //           Don't have an account?{" "}
// //           <Link to="/register">Register</Link>
// //         </p>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Login;

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../config/api";
// import "./AuthPages.css";

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await API.post("/users/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("userInfo", JSON.stringify(data));
//       setUser(data);
//       navigate("/chat");

//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={submitHandler}>
//         <h2>Login</h2>

//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>

//         <p>
//           Don't have an account? <Link to="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


// Login.jsx - Professional & Clean Authentication
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../config/api";
import "./AuthPages.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue to Chatify</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
