import { useEffect, useState } from "react";
import { getMyImages, renameImage, updateImagePublicStatus, deleteImage, assignImageToAlbum } from "../../api/images";
import { getMyAlbums } from "../../api/albums";
import { getMyProfile } from "../../api/users";
import { Link } from "react-router-dom";

function MyImages() {
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [block, setBlock] = useState(false);

  useEffect(() => {
    fetchUserBlock();
    fetchImages();
    fetchAlbums();
  }, [page]);

  const fetchUserBlock = async () => {
    const res = await getMyProfile();
    if(res.data.is_blocked == 1){
      setBlock(true);
    }
  }

  const fetchImages = async () => {
    try {
      const res = await getMyImages(page);
      console.log("✔️ Success:", res);
      setImages(res.data.images || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("❌ Error fetching images:", err.response?.data || err.message);
    }
  };

  const fetchAlbums = async () => {
    const res = await getMyAlbums();
    setAlbums(res.data || []);
  };

  const handleAssign = async (imageId, albumId) => {
    await assignImageToAlbum(imageId, albumId === "none" ? null : parseInt(albumId));
    fetchImages();
  };

  const handleRename = async (id) => {
    console.log(id);
    const newName = prompt("הזן שם חדש לתמונה:");
    if (newName) {
      await renameImage(id, newName);
      fetchImages();
    }
  };

  const handleTogglePublic = async (id, currentStatus) => {
    await updateImagePublicStatus(id, !currentStatus);
    fetchImages();
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את התמונה?")) {
      await deleteImage(id);
      fetchImages();
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
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-images me-2"></i>
                התמונות שלי
              </h2>
            </div>
            <div className="card-body">
              {images.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-image fs-1"></i>
                  <p className="mt-3">אין תמונות עדיין</p>
                </div>
              ) : (
                <div className="row">
                  {images.map((img) => (
                    <div key={img.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="position-relative">
                          <Link to={`/images/${img.id}`} className="text-decoration-none">
                            <img 
                              src={img.url} 
                              alt={img.name} 
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className={`badge ${img.is_public ? 'bg-success' : 'bg-secondary'}`}>
                              <i className={`bi ${img.is_public ? 'bi-globe' : 'bi-lock'} me-1`}></i>
                              {img.is_public ? 'פומבי' : 'פרטי'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <h5 className="card-title text-truncate" title={img.name}>
                            {img.name}
                          </h5>
                          
                          {!block && (
                            <div className="d-flex flex-column gap-2">
                              {/* Action Buttons */}
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleRename(img.id)}
                                  title="שנה שם"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className={`btn btn-sm ${img.is_public ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                  onClick={() => handleTogglePublic(img.id, img.is_public)}
                                  title={img.is_public ? 'הפוך לפרטי' : 'הפוך לפומבי'}
                                >
                                  <i className={`bi ${img.is_public ? 'bi-lock' : 'bi-globe'}`}></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(img.id)}
                                  title="מחק"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>

                              {/* Album Assignment */}
                              <div>
                                <label className="form-label small text-muted">
                                  שיוך לאלבום:
                                </label>
                                <select
                                  className="form-select form-select-sm"
                                  value={img.album_id || "none"}
                                  onChange={(e) => handleAssign(img.id, e.target.value)}
                                >
                                  <option value="none">
                                    <i className="bi bi-folder"></i>
                                    כללי (ללא אלבום)
                                  </option>
                                  {albums.map((a) => (
                                    <option key={a.id} value={a.id}>
                                      {a.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                          
                          {block && (
                            <div className="alert alert-warning small">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              משתמש חסום לא יכול לערוך פרטי תמונה
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <nav aria-label="Images pagination" className="mt-4">
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

export default MyImages;