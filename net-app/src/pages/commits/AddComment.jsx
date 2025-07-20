import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addComment } from "../../api/comments";

function AddComment() {
  const { id } = useParams(); // image_id
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(parseInt(id), comment, parseInt(rating));
      navigate(`/images/${id}`);
    } catch (err) {
      console.log(err);
      alert("ייתכן שכבר הגבת או שהבקשה לא תקינה");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      ></i>
    ));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-chat-dots-fill me-2"></i>
                הוספת תגובה
              </h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    <i className="bi bi-chat-text-fill me-1"></i>
                    תגובה
                  </label>
                  <textarea
                    className="form-control"
                    id="comment"
                    rows="4"
                    placeholder="כתוב את התגובה שלך כאן..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="rating" className="form-label">
                    <i className="bi bi-star-fill me-1"></i>
                    דירוג
                  </label>
                  <select 
                    className="form-select"
                    id="rating"
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} כוכבים
                      </option>
                    ))}
                  </select>
                  
                  <div className="mt-2">
                    <small className="text-muted">תצוגה מקדימה: </small>
                    {renderStars(parseInt(rating))}
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/images/${id}`)}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    ביטול
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-send-fill me-1"></i>
                    שלח תגובה
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddComment;