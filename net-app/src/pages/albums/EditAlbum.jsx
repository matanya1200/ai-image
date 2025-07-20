import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyAlbums, updateAlbum} from "../../api/albums";

function EditAlbum() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [albumFound, setAlbumFound] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbum();
  }, []);

  const fetchAlbum = async () => {
    try {
      const res = await getMyAlbums();
      const album = res.data.find((a) => a.id === parseInt(id));
      if (album) {
        setName(album.name);
        setIsPublic(album.is_public);
        setAlbumFound(true);
      } else {
        setAlbumFound(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setAlbumFound(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await updateAlbum(id, name, isPublic);
      navigate("/my-albums");
    } catch (error) {
      console.error(error);
      alert("שגיאה בעדכון האלבום");
      setSaving(false);
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
              <p className="mt-2">טוען אלבום...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!albumFound) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <i className="bi bi-exclamation-triangle-fill text-warning display-4"></i>
                <h3 className="mt-3 text-warning">אלבום לא נמצא</h3>
                <p className="text-muted">האלבום שחיפשת לא קיים או שאין לך הרשאה לערוך אותו</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/my-albums")}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  חזור לאלבומים
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h2 className="card-title mb-0">
                <i className="bi bi-pencil-fill me-2"></i>
                עריכת אלבום
              </h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">שם האלבום</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="הכנס שם לאלבום"
                    required
                  />
                </div>

                <div className="mb-4">
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
                  <div className="form-text">
                    {isPublic ? (
                      <span className="text-success">
                        <i className="bi bi-info-circle me-1"></i>
                        האלבום יהיה גלוי לכולם
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        האלבום יהיה פרטי ורק אתה תוכל לראות אותו
                      </span>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={!name.trim() || saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        שומר...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        שמור שינויים
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/my-albums")}
                    disabled={saving}
                  >
                    <i className="bi bi-x-lg me-1"></i>
                    ביטול
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

export default EditAlbum;