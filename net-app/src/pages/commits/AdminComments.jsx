import { useEffect, useState } from "react";
import { getAllComments, deleteComment } from "../../api/comments";

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    const res = await getAllComments(page);
    setComments(res.data.commits || []);
    setPagination(res.data.pagination || {});
  };

  const handleDelete = async (id) => {
    if (window.confirm("למחוק את התגובה?")) {
      await deleteComment(id);
      fetchComments();
    }
  };

  const goNext = () => {
    if (pagination.has_next) setPage((p) => p + 1);
  };

  const goPrev = () => {
    if (pagination.has_previous) setPage((p) => p - 1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      ></i>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h2 className="card-title mb-0">
                <i className="bi bi-shield-fill me-2"></i>
                ניהול תגובות
              </h2>
            </div>
            
            <div className="card-body">
              {comments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-chat-dots display-4 text-muted"></i>
                  <p className="text-muted mt-2">אין תגובות במערכת</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">
                            <i className="bi bi-image-fill me-1"></i>
                            תמונה
                          </th>
                          <th scope="col">
                            <i className="bi bi-person-fill me-1"></i>
                            משתמש
                          </th>
                          <th scope="col">
                            <i className="bi bi-chat-text-fill me-1"></i>
                            תגובה
                          </th>
                          <th scope="col">
                            <i className="bi bi-star-fill me-1"></i>
                            דירוג
                          </th>
                          <th scope="col">
                            <i className="bi bi-calendar-fill me-1"></i>
                            תאריך עדכון
                          </th>
                          <th scope="col">
                            <i className="bi bi-gear-fill me-1"></i>
                            פעולות
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <span className="badge bg-primary">
                                #{c.image_id}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2"></i>
                                {c.user_name}
                              </div>
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                {c.comment}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {renderStars(c.rating)}
                                <span className="ms-2 text-muted">({c.rating})</span>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatDate(c.updated_at)}
                              </small>
                            </td>
                            <td>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(c.id)}
                              >
                                <i className="bi bi-trash-fill me-1"></i>
                                מחק
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {pagination.total_pages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <nav aria-label="Page navigation">
                        <ul className="pagination">
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
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComments;