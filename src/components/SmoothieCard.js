import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const SmoothieCard = ({ smoothie, onDelete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("smoothies")
      .delete()
      .eq("id", smoothie.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      onDelete(smoothie.id);
    }
  };

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
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>
      {isAuthenticated && (
        <div className="buttons">
          <Link to={`/${smoothie.id}`}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>
            delete
          </i>
        </div>
      )}
    </div>
  );
};

export default SmoothieCard;
