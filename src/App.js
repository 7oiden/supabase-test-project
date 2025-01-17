import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import supabase from "./config/supabaseClient";
import { useNavigate } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Login from "./pages/Login";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      // console.log(data);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session?.user);
        setUsername(session?.user?.email);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log("Error signing out:", error);
    }
    navigate("/");
    // setUsername(null);
  };

  return (
    <BrowserRouter>
      <nav>
        <h1>Supa Smoothies</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/create">Create New Smoothie</Link>
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {isAuthenticated && (
            <p className="username">Logged in as: {username}</p>
          )}
          {isAuthenticated && (
            <button onClick={signOut} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
