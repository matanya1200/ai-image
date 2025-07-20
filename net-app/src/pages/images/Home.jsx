import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicImages, searchImagesByName, blockImage as blockImageApi} from "../../api/images";

function Home({ role, isLoggedIn }) {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    try {
      const res = await getPublicImages(page);
      setImages(res.data.images);
      setPagination(res.data.pagination);
    } catch (err) {
      alert("שגיאה בטעינת תמונות");
    }
  };

  const handleSearch = async () => {
    if (!query) {
      fetchImages();
      return;
    }

    const res = await searchImagesByName(query);
    setImages(res.data.images || []);
    setPagination({});
  };

  const blockImage = async (id, isBlocked) => {
    await blockImageApi(id, !isBlocked);
    fetchImages();
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
          <h1 className="mb-4 text-center">
            <i className="bi bi-images me-2"></i>
            תמונות פומביות
          </h1>

          <div className="row mb-4">
            <div className="col-md-8 mx-auto">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="חפש תמונה לפי שם..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-secondary" onClick={handleSearch}>
                  <i className="bi bi-search me-1"></i>
                  חפש
                </button>
              </div>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                לא נמצאו תמונות
              </div>
            </div>
          ) : (
            <div className="row">
              {images.map((img) => (
                <div key={img.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      {isLoggedIn ? (
                        <Link to={`/images/${img.id}`}>
                          <img 
                            src={img.url} 
                            alt={img.name} 
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </Link>
                      ) : (
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      
                      {img.is_blocked && (
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-danger">
                            <i className="bi bi-lock-fill me-1"></i>
                            חסום
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title">{img.name}</h5>
                      <p className="card-text text-muted">
                        <i className="bi bi-person-circle me-1"></i>
                        נוצר על ידי: {img.user_name}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        {isLoggedIn && (
                          <Link 
                            to={`/images/${img.id}`} 
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-eye-fill me-1"></i>
                            צפה
                          </Link>
                        )}
                        
                        {role === "admin" && (
                          <button 
                            className={`btn btn-sm ${img.is_blocked ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => blockImage(img.id, img.is_blocked)}
                          >
                            {img.is_blocked ? (
                              <>
                                <i className="bi bi-unlock-fill me-1"></i>
                                שחרור
                              </>
                            ) : (
                              <>
                                <i className="bi bi-lock-fill me-1"></i>
                                חסימה
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}

export default Home;