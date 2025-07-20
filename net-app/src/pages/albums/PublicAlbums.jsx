import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchPublicAlbumsByName, getPublicAlbums, blockAlbum } from "../../api/albums";

function PublicAlbums({ role }) {
  const [albums, setAlbums] = useState([]);
  const [query, setQuery] = useState("");

  const fetchAlbums = async () => {
    const res = query
      ? await searchPublicAlbumsByName(query)
      : await getPublicAlbums();
    setAlbums(res.data);
  };

  const toggleBlock = async (id, isBlocked) => {
    await blockAlbum(id, !isBlocked);
    fetchAlbums();
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-center">
            <i className="bi bi-folder-fill me-2"></i>
            אלבומים פומביים
          </h2>
          
          <div className="row mb-4">
            <div className="col-md-8 mx-auto">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="חפש אלבום לפי שם..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchAlbums()}
                />
                <button className="btn btn-outline-secondary" onClick={fetchAlbums}>
                  <i className="bi bi-search me-1"></i>
                  חיפוש
                </button>
              </div>
            </div>
          </div>

          {albums.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                לא נמצאו אלבומים
              </div>
            </div>
          ) : (
            <div className="row">
              {albums.map((album) => (
                <div key={album.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link 
                          to={`/albums/${album.id}`} 
                          className="text-decoration-none"
                        >
                          <i className="bi bi-folder-fill me-2"></i>
                          {album.name}
                        </Link>
                      </h5>
                      
                      <p className="card-text text-muted">
                        <i className="bi bi-person-circle me-1"></i>
                        נוצר על ידי: {album.creator_name || 'לא ידוע'}
                      </p>
                      
                      {album.description && (
                        <p className="card-text">{album.description}</p>
                      )}
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <Link 
                          to={`/albums/${album.id}`} 
                          className="btn btn-primary btn-sm"
                        >
                          <i className="bi bi-eye-fill me-1"></i>
                          צפה באלבום
                        </Link>
                        
                        {role === "admin" && (
                          <button 
                            className={`btn btn-sm ${album.is_blocked ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => toggleBlock(album.id, album.is_blocked)}
                          >
                            {album.is_blocked ? (
                              <>
                                <i className="bi bi-unlock-fill me-1"></i>
                                שחרר
                              </>
                            ) : (
                              <>
                                <i className="bi bi-lock-fill me-1"></i>
                                חסום
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
        </div>
      </div>
    </div>
  );
}

export default PublicAlbums;