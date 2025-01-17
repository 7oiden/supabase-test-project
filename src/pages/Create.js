import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const Create = () => {
  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      } else if (data.session?.user) {
        setUserId(data.session.user.id);
      } else {
        console.error("User is not logged in.");
        setFormError("Please login to create a smoothie.");
      }
    };

    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !method || !rating) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    if (!userId) {
      setFormError("User not authenticated. Please log in.");
      return;
    }

    const { data, error } = await supabase
      .from("smoothies")
      .insert([{ title, method, rating, user_id: userId }])
      .select();

    if (error) {
      console.error(error);
      setFormError("Error creating the smoothie. Please try again.");
    } else if (data) {
      console.log(data);
      setFormError(null);
      navigate("/");
    }
  };

  return (
    <div className="page create">
      {userId ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="method">Method:</label>
          <textarea
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />

          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <button>Create Smoothie Recipe</button>

          {formError && <p className="error">{formError}</p>}
        </form>
      ) : (
        <div className="create-wrapper">
          <p>Please log in to create a smoothie.</p>
        </div>
      )}
    </div>
  );
};

export default Create;
