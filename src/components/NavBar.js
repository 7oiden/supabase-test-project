import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

export default function NavBar() {
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
  );
}
