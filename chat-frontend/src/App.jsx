import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/LandingPage"; // Add LandingPage
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={user ? <Navigate to="/chat" /> : <LandingPage />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={user ? <Navigate to="/chat" /> : <Login setUser={setUser} />}
        />

        {/* Register page */}
        <Route
          path="/register"
          element={user ? <Navigate to="/chat" /> : <Register />}
        />

        {/* Protected Chat page */}
        <Route
          path="/chat"
          element={
            user ? <ChatPage user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
