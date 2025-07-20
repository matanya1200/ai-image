import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewAlbum } from "../../api/albums";
import { getMyImages, assignImageToAlbum } from "../../api/images";
import { getMyProfile } from "../../api/users";

function CreateAlbum() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [albumId, setAlbumId] = useState(null);
  const [page, setPage] = useState(1);
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assigningImages, setAssigningImages] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBlock();
    fetchImages();
  }, [page]);

  const fetchUserBlock = async () => {
    try {
      const res = await getMyProfile();
      if(res.data.is_blocked == 1){
        setBlock(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const fetchImages = async () => {
    try {
      const res = await getMyImages(page);
      setImages(res.data.images || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      const res = await createNewAlbum(name, isPublic);
      setAlbumId(res.data.album_id);
      fetchImages();
    } catch (error) {
      console.error(error);
      alert("שגיאה ביצירת האלבום");
    }
  };

  const assignToAlbum = async (imageId) => {
    if (!albumId) return;
    
    setAssigningImages(prev => new Set(prev).add(imageId));
    try {
      await assignImageToAlbum(imageId, albumId);
      fetchImages();
    } catch (error) {
      console.error(error);
      alert("שגיאה בהוספת התמונה");
    } finally {
      setAssigningImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const goNext = () => {
    if (pagination.has_next) setPage((p) => p + 1);
  };

  const goPrev = () => {
    if (pagination.has_previous) setPage((p) => p - 1);
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
              <p className="mt-2">טוען...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {block ? (
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <i className="bi bi-exclamation-triangle-fill text-warning display-4"></i>
                <h3 className="mt-3 text-warning">חשבון חסום</h3>
                <p className="text-muted">משתמש חסום לא יכול ליצור אלבום</p>
              </div>
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h2 className="card-title mb-0">
                  <i className="bi bi-folder-plus me-2"></i>
                  יצירת אלבום חדש
                </h2>
              </div>
              
              <div className="card-body">
                {!albumId ? (
                  /* Create Album Form */
                  <form onSubmit={createAlbum}>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label className="form-label">שם האלבום</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="הכנס שם לאלבום"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">&nbsp;</label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="publicCheck"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="publicCheck">
                            <i className="bi bi-globe me-1"></i>
                            אלבום פומבי
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success" disabled={!name.trim()}>
                        <i className="bi bi-plus-circle me-1"></i>
                        צור אלבום
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/my-albums")}
                      >
                        <i className="bi bi-arrow-left me-1"></i>
                        חזור
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Assign Images */
                  <>
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle me-2"></i>
                      האלבום "{name}" נוצר בהצלחה! כעת תוכל לבחור תמונות להוסיף אליו.
                    </div>

                    <h4 className="mb-3">
                      <i className="bi bi-images me-2"></i>
                      בחר תמונות שיוקצו לאלבום
                    </h4>

                    {images.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-image display-4 text-muted"></i>
                        <h5 className="mt-3 text-muted">אין תמונות זמינות</h5>
                        <p className="text-muted">העלה תמונות כדי להוסיף אותן לאלבום</p>
                      </div>
                    ) : (
                      <>
                        <div className="row g-3">
                          {images.map((img) => (
                            <div key={img.id} className="col-md-6 col-lg-4 col-xl-3">
                              <div className="card h-100">
                                <img 
                                  src={img.url} 
                                  alt={img.name} 
                                  className="card-img-top"
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-2">
                                  <h6 className="card-title small mb-2">{img.name}</h6>
                                  <button 
                                    className="btn btn-success btn-sm w-100"
                                    onClick={() => assignToAlbum(img.id)}
                                    disabled={assigningImages.has(img.id)}
                                  >
                                    {assigningImages.has(img.id) ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        מוסיף...
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-plus-circle me-1"></i>
                                        הוסף לאלבום
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                          <div className="d-flex justify-content-center mt-4">
                            <nav>
                              <ul className="pagination">
                                <li className={`page-item ${!pagination.has_previous ? 'disabled' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={goPrev}
                                    disabled={!pagination.has_previous}
                                  >
                                    <i className="bi bi-chevron-right"></i>
                                  </button>
                                </li>
                                <li className="page-item active">
                                  <span className="page-link">
                                    {pagination.current_page} מתוך {pagination.total_pages}
                                  </span>
                                </li>
                                <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={goNext}
                                    disabled={!pagination.has_next}
                                  >
                                    <i className="bi bi-chevron-left"></i>
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-4 text-center">
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate("/my-albums")}
                      >
                        <i className="bi bi-check-lg me-1"></i>
                        סיים ועבור לאלבומים
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateAlbum;