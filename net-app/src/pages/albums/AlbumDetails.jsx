import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyAlbums, getPublicImagesInAlbum, getAllImagesInAlbum } from "../../api/albums";

function AlbumDetails({ userId }) {
  const { id } = useParams(); //album_id
  const [images, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [albumInfo, setAlbumInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    checkOwnershipAndLoad();
  }, []);

  const checkOwnershipAndLoad = async () => {
    if (!userId) {
      // לא מחובר
      await loadPublic();
      return;
    }

    try {
      const res = await getMyAlbums();
      const myAlbums = res.data;
      const match = myAlbums.find((a) => a.id === parseInt(id));
      if (match) {
        setIsOwner(true);
        setAlbumInfo(match);
        await loadPrivate();
      } else {
        await loadPublic();
      }
    } catch (error) {
      console.error(error);
      await loadPublic();
    }
  };

  const loadPrivate = async () => {
    try {
      const res = await getAllImagesInAlbum(id);
      setImages(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const loadPublic = async () => {
    try {
      const res = await getPublicImagesInAlbum(id);
      setImages(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
              <p className="mt-2">טוען תמונות...</p>
            </div>
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
            <div className="card-header bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title mb-0">
                  <i className="bi bi-images me-2"></i>
                  תמונות באלבום
                  {albumInfo && (
                    <span className="ms-2 badge bg-light text-dark">
                      {albumInfo.name}
                    </span>
                  )}
                </h2>
                <div>
                  {isOwner && (
                    <span className="badge bg-success">
                      <i className="bi bi-person-check me-1"></i>
                      האלבום שלי
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {/* Owner notice */}
              {isOwner && (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  מציג גם תמונות פרטיות באלבום שלך
                </div>
              )}

              {/* Images count */}
              <div className="mb-3">
                <span className="badge bg-secondary">
                  <i className="bi bi-image me-1"></i>
                  {images.length} תמונות
                </span>
              </div>

              {/* Images gallery */}
              {images.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-image display-4 text-muted"></i>
                  <h4 className="mt-3 text-muted">אין תמונות באלבום</h4>
                  <p className="text-muted">
                    {isOwner ? "הוסף תמונות לאלבום שלך" : "האלבום עדיין ריק"}
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {images.map((img) => (
                    <div key={img.id} className="col-md-6 col-lg-4 col-xl-3">
                      <div className="card h-100 shadow-sm">
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="card-img-top"
                          style={{ 
                            height: '250px', 
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedImage(img)}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title small mb-1">{img.name}</h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className={`badge ${img.is_public ? 'bg-success' : 'bg-warning'}`}>
                              {img.is_public ? (
                                <><i className="bi bi-globe me-1"></i>פומבי</>
                              ) : (
                                <><i className="bi bi-lock-fill me-1"></i>פרטי</>
                              )}
                            </span>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setSelectedImage(img)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-image me-2"></i>
                  {selectedImage.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedImage(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.name} 
                  className="img-fluid rounded"
                  style={{ maxHeight: '70vh' }}
                />
              </div>
              <div className="modal-footer">
                <span className={`badge ${selectedImage.is_public ? 'bg-success' : 'bg-warning'}`}>
                  {selectedImage.is_public ? (
                    <><i className="bi bi-globe me-1"></i>תמונה פומבית</>
                  ) : (
                    <><i className="bi bi-lock-fill me-1"></i>תמונה פרטית</>
                  )}
                </span>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedImage(null)}
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedImage(null)}></div>
        </div>
      )}
    </div>
  );
}

export default AlbumDetails;