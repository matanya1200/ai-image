import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentByID, updateComment } from "../../api/comments";

function EditComment() {
  const { id } = useParams(); // comment_id
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComment();
  }, []);

  const fetchComment = async () => {
    try {
      const res = await getCommentByID(id);
      setComment(res.data.commit.comment);
      setRating(res.data.commit.rating);
      setLoading(false);
    } catch (err) {
      if (err.status === 403) {
        setBlock(true);
      }
      setLoading(false);
      console.error(err.response?.data || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await getCommentByID(id);
      await updateComment(id, comment, parseInt(rating));
      navigate(`/images/${res.data.commit.image_id}`);
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון התגובה");
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

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
              <p className="mt-2">טוען את התגובה...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center" role="alert">
              <i className="bi bi-shield-exclamation display-4 mb-3"></i>
              <h4 className="alert-heading">גישה חסומה!</h4>
              <p className="mb-0">המשתמש חסום ואינו יכול לערוך תגובות</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                עריכת תגובה
              </h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    <i className="bi bi-chat-text-fill me-1"></i>
                    תגובה
                  </label>
                  <textarea
                    className="form-control"
                    id="comment"
                    rows="4"
                    placeholder="ערוך את התגובה שלך..."
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
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    ביטול
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    שמור שינויים
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

export default EditComment;