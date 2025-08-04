import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getImageById, getImageRating } from "../../api/images";
import { getCommentsByImage, deleteComment } from "../../api/comments";
import { getMyProfile } from "../../api/users";
import { getCloudinarySettings, uploadToCloudinary } from "../../api/cloudinary";

function ImageDetails({userId}) {
  const { id } = useParams(); //image_id
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [rating, setRating] = useState(null);
  const [page, setPage] = useState(1);
  const [block, setBlock] = useState(false);
  const [hasCloudinarySettings, setHasCloudinarySettings] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBlock();
    fetchImage();
    fetchRating();
    checkCloudinarySettings();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const checkCloudinarySettings = async () => {
    try {
      const res = await getCloudinarySettings();
      if (res.data.cloud_name && res.data.api_key) {
        setHasCloudinarySettings(true);
      }
    } catch (e) {
      console.log("אין הגדרות Cloudinary", e);
    }
  };

  const fetchUserBlock = async () => {
    const res = await getMyProfile();
    if(res.data.is_blocked == 1){
      setBlock(true);
    }
  }

  const fetchImage = async () => {
    const res = await getImageById(id);
    setImage(res.data[0]);
    console.log(res.data[0]);
  };

  const fetchComments = async () => {
    const res = await getCommentsByImage(id, page);
    setComments(res.data.commits || []);
    setPagination(res.data.pagination || {});
  };

  const fetchRating = async () => {
    const res = await getImageRating(id);
    setRating(res.data);
  };

  const handleDelete = async (commentId) => {
    try{
      if (window.confirm("האם אתה בטוח שברצונך למחוק את התגובה?")) {
        await deleteComment(commentId);
        fetchComments();
        fetchRating();
      }
    }catch(err){
      alert("משתמש חסום לא יכול למחוק תגובה")
      console.error(err.response?.data || err.message);
    }
  };

  const goNext = () => {
    if (pagination.has_next) setPage((p) => p + 1);
  };

  const goPrev = () => {
    if (pagination.has_previous) setPage((p) => p - 1);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-6">
          {/* Image Card */}
          {image && (
            <div className="card shadow mb-4">
              <div className="card-header bg-primary text-white">
                <h2 className="card-title mb-0">{image.name}</h2>
              </div>
              <div className="card-body text-center">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="img-fluid rounded shadow mb-3"
                  style={{ maxWidth: "100%" }}
                />
                <div className="row text-center">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <i className="bi bi-person-circle me-2"></i>
                      <strong>נוצר על ידי:</strong> {image.user_name}
                    </p>
                  </div>
                  <div className="col-md-6">
                    {rating && (
                      <p className="mb-2">
                        <i className="bi bi-star-fill text-warning me-2"></i>
                        <strong>דירוג ממוצע:</strong> {rating.average_rating || "לא דורג עדיין"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <a 
                    href={image.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success me-2"
                  >
                    <i className="bi bi-download me-2"></i>
                    פתח תמונה בכרטיסיה חדשה
                  </a>
                  {hasCloudinarySettings && (
                    <button
                      className="btn btn-success me-2"
                      onClick={async () => {
                        try {
                          const fixedUrl = image.url.replace("localhost", "10.0.0.18");
                          await uploadToCloudinary(fixedUrl, image.name);
                          alert("התמונה הועלתה ל־Cloudinary בהצלחה!");
                        } catch (err) {
                          console.error(err);
                          alert("שגיאה בהעלאת התמונה ל־Cloudinary.");
                        }
                      }}
                    >
                      ☁️ העלה ל־Cloudinary
                    </button>
                  )}
                  {!hasCloudinarySettings && (
                    <p className="text-muted mt-2">כדי להעלות ל־Cloudinary יש להוסיף הגדרות בפרופיל המשתמש.</p>
                  )}
                  {!block && (
                    <Link 
                      to={`/add-comment/${id}`}
                      className="btn btn-success"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      הוסף תגובה
                    </Link>
                  )}
                  {block && (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      משתמש חסום לא יכול להוסיף תגובה
                    </div>
                  )}
                  {image.is_blocked == true &&(
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      התמונה הזו חסומה
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="col-lg-6">
          {/* Comments Section */}
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-chat-left-text me-2"></i>
                תגובות
              </h3>
            </div>
            <div className="card-body">
              {comments.length === 0 && (
                <div className="text-center text-muted">
                  <i className="bi bi-chat-left-dots fs-1"></i>
                  <p className="mt-2">אין תגובות עדיין.</p>
                </div>
              )}

              {comments.map((c) => (
                <div
                  key={c.id}
                  className="card mb-3"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="card-subtitle mb-2 text-primary">
                          <i className="bi bi-person-circle me-2"></i>
                          {c.user_name}
                        </h6>
                        <p className="card-text">{c.comment}</p>
                        <div className="row small text-muted">
                          <div className="col-sm-6">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            דירוג: {c.rating}
                          </div>
                          <div className="col-sm-6">
                            <i className="bi bi-clock me-1"></i>
                            {c.updated_at}
                          </div>
                        </div>
                      </div>
                      
                      {parseInt(userId) === c.user_id && (
                        <div className="dropdown">
                          <button 
                            className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => navigate(`/edit-comment/${c.id}`)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                ערוך
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(c.id)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                מחק
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <nav aria-label="Comments pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${!pagination.has_previous ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={goPrev} 
                        disabled={!pagination.has_previous}
                      >
                        <i className="bi bi-chevron-right me-1"></i>
                        הקודם
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">
                        עמוד {pagination.current_page} מתוך {pagination.total_pages}
                      </span>
                    </li>
                    <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={goNext} 
                        disabled={!pagination.has_next}
                      >
                        הבא
                        <i className="bi bi-chevron-left ms-1"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetails;