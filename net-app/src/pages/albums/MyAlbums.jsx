import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAlbums, deleteAlbum} from "../../api/albums";
import { getMyProfile } from "../../api/users";

function MyAlbums() {
  const [albums, setAlbums] = useState([]);
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBlock()
    fetchAlbums();
  }, []);

  const fetchUserBlock = async () => {
    try {
      const res = await getMyProfile();
      if(res.data.is_blocked == 1){
        setBlock(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchAlbums = async () => {
    try {
      const res = await getMyAlbums();
      setAlbums(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("למחוק את האלבום?")) {
      try {
        await deleteAlbum(id);
        fetchAlbums();
      } catch (error) {
        console.error(error);
        alert("שגיאה במחיקת האלבום");
      }
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
              <p className="mt-2">טוען אלבומים...</p>
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
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0">
                <i className="bi bi-folder-fill me-2"></i>
                האלבומים שלי
              </h2>
              {!block && (
                <Link to="/albums/new" className="btn btn-light btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>
                  צור אלבום חדש
                </Link>
              )}
            </div>
            
            <div className="card-body">
              {/* Status Alert */}
              {block && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  החשבון שלך חסום - לא ניתן ליצור או לערוך אלבומים
                </div>
              )}

              {/* Albums Count */}
              <div className="mb-3">
                <span className="badge bg-info">
                  <i className="bi bi-folder me-1"></i>
                  סה"כ אלבומים: {albums.length}
                </span>
              </div>

              {/* Albums List */}
              {albums.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x display-4 text-muted"></i>
                  <h4 className="mt-3 text-muted">אין אלבומים עדיין</h4>
                  <p className="text-muted">צור את האלבום הראשון שלך</p>
                  {!block && (
                    <Link to="/albums/new" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-1"></i>
                      צור אלבום חדש
                    </Link>
                  )}
                </div>
              ) : (
                <div className="row g-3">
                  {albums.map((album) => (
                    <div key={album.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start mb-3">
                            <i className={`bi ${album.is_public ? 'bi-globe text-success' : 'bi-lock-fill text-warning'} me-2 fs-4`}></i>
                            <div className="flex-grow-1">
                              <h5 className="card-title mb-1">{album.name}</h5>
                              <span className={`badge ${album.is_public ? 'bg-success' : 'bg-warning'}`}>
                                {album.is_public ? 'פומבי' : 'פרטי'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Album Actions */}
                          <div className="d-flex gap-2 align-items-center">
                            <Link 
                              to={`/albums/${album.id}`} 
                              className="btn btn-primary btn-sm flex-grow-1"
                            >
                              <i className="bi bi-eye me-1"></i>
                              צפה
                            </Link>
                            
                            {!block && (
                              <>
                                <Link 
                                  to={`/albums/edit/${album.id}`} 
                                  className="btn btn-outline-secondary btn-sm"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(album.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            )}
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
    </div>
  );
}

export default MyAlbums;