import { useEffect, useState } from "react";
import {
  getBlockedPublicImages,
  blockImage,
} from "../../api/images";

function BlockedImagesAdmin() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlockedImages();
  }, []);

  const fetchBlockedImages = async () => {
    try {
      setIsLoading(true);
      const res = await getBlockedPublicImages();
      setImages(res.data.images);
    } catch (err) {
      alert("שגיאה בטעינת תמונות חסומות");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async (imageId) => {
    try {
      if (window.confirm("האם אתה בטוח שברצונך לשחרר את התמונה?")) {
        await blockImage(imageId, false);
        fetchBlockedImages(); // רענון
        
        // הצגת הודעת הצלחה
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
          <i class="bi bi-check-circle me-2"></i>
          התמונה שוחררה בהצלחה!
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // הסרת ההודעה לאחר 3 שניות
        setTimeout(() => {
          if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
          }
        }, 3000);
      }
    } catch (err) {
      alert("שגיאה בשחרור התמונה");
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">טוען תמונות חסומות...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-shield-x me-2"></i>
                תמונות פומביות חסומות
              </h2>
              <small className="opacity-75">
                ניהול תמונות שנחסמו על ידי המנהלים
              </small>
            </div>
            <div className="card-body">
              {images.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-check-circle-fill text-success fs-1"></i>
                  <h4 className="mt-3 text-success">כל הכבוד!</h4>
                  <p className="lead">אין תמונות חסומות כרגע.</p>
                  <small className="text-muted">כל התמונות הפומביות עומדות בתקנים.</small>
                </div>
              ) : (
                <>
                  {/* Statistics Bar */}
                  <div className="alert alert-warning d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                    <div>
                      <strong>סה"כ תמונות חסומות: {images.length}</strong>
                      <br />
                      <small>תמונות אלו אינן מוצגות בגלריה הפומבית</small>
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="row">
                    {images.map((img) => (
                      <div key={img.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                        <div className="card h-100 border-danger">
                          <div className="position-relative">
                            <img 
                              src={img.url} 
                              alt={img.name}
                              className="card-img-top"
                              style={{ 
                                height: "200px", 
                                objectFit: "cover",
                                filter: "grayscale(20%)"
                              }}
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className="badge bg-danger">
                                <i className="bi bi-shield-x me-1"></i>
                                חסום
                              </span>
                            </div>
                          </div>
                          
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title text-truncate" title={img.name}>
                              <i className="bi bi-image me-2 text-muted"></i>
                              {img.name}
                            </h5>
                            
                            <div className="card-text mb-3">
                              <small className="text-muted">
                                <i className="bi bi-person-circle me-1"></i>
                                מאת: <strong>{img.user_name}</strong>
                              </small>
                            </div>
                            
                            <div className="mt-auto">
                              <button 
                                className="btn btn-success w-100"
                                onClick={() => handleUnblock(img.id)}
                              >
                                <i className="bi bi-unlock me-2"></i>
                                שחרר תמונה
                              </button>
                            </div>
                          </div>
                          
                          <div className="card-footer bg-light">
                            <small className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              לחץ לשחרור התמונה לגלריה הפומבית
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bulk Actions */}
                  {images.length > 1 && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="mb-3">
                        <i className="bi bi-gear me-2"></i>
                        פעולות קבוצתיות
                      </h6>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-success btn-sm"
                          onClick={() => {
                            if (window.confirm(`האם אתה בטוח שברצונך לשחרר את כל ${images.length} התמונות?`)) {
                              images.forEach(img => handleUnblock(img.id));
                            }
                          }}
                        >
                          <i className="bi bi-unlock me-2"></i>
                          שחרר הכל ({images.length})
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={fetchBlockedImages}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          רענן רשימה
                        </button>
                      </div>
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

export default BlockedImagesAdmin;