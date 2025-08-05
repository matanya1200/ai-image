import { useEffect, useState } from "react";
import { getCloudinarySettings, saveCloudinarySettings, deleteCloudinarySettings } from "../../api/cloudinary";
import { getMyProfile, updateMyName, deleteMyUser} from "../../api/users";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cloudName, setCloudName] = useState("");
  const [cloudKey, setCloudKey] = useState("");
  const [cloudSecret, setCloudSecret] = useState("");
  const [cloudExists, setCloudExists] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchCloudinarySettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      if(res.data.is_blocked == 1){
        setBlock(true);
      }
      setUser(res.data);
      setNewName(res.data.name);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

    const fetchCloudinarySettings = async () => {
    try {
      const cloud = await getCloudinarySettings();
      setCloudExists(true);
      setCloudName(cloud.data.cloud_name);
      setCloudKey(cloud.data.api_key);
      setCloudSecret("הסוד קיים אך סודי ולכן לא ניתן לצפייה");
    } catch (error) {
      setCloudExists(false);
      setCloudName("");
      setCloudKey("");
      setCloudSecret("");
    }
  };

  const updateName = async () => {
    try {
      await updateMyName(newName);
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("שגיאה בעדכון השם");
    }
  };

  const deleteUser = async () => {
    if(window.confirm("האם אתה בטוח שברצונך למחוק את החשבון?")){
      try {
        await deleteMyUser();
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        navigate("/login");
      } catch (error) {
        console.error(error);
        alert("שגיאה במחיקת החשבון");
      }
    }
  }

  const handleSaveCloudinary = async () => {
    setCloudLoading(true);
    try {
      console.log("Saving Cloudinary settings:", cloudName, cloudKey, cloudSecret);
      await saveCloudinarySettings(cloudName, cloudKey, cloudSecret);
      alert("הפרטים נשמרו בהצלחה");
      fetchCloudinarySettings();
    } catch (error) {
      console.error(error);
      alert("שגיאה בשמירת פרטי Cloudinary");
    }
    setCloudLoading(false);
  };

  const handleDeleteCloudinary = async () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את פרטי Cloudinary?")) {
      setCloudLoading(true);
      try {
        await deleteCloudinarySettings();
        alert("הפרטים נמחקו בהצלחה");
        setCloudExists(false);
        setCloudName("");
        setCloudKey("");
        setCloudSecret("");
      } catch (error) {
        console.error(error);
        alert("שגיאה במחיקת פרטי Cloudinary");
      }
      setCloudLoading(false);
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
              <p className="mt-2">טוען פרופיל...</p>
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
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-person-circle me-2"></i>
                פרופיל משתמש
              </h2>
            </div>
            
            <div className="card-body">
              {user && (
                <>
                  {/* Status Alert */}
                  {block && (
                    <div className="alert alert-warning" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      החשבון שלך חסום
                    </div>
                  )}

                  {/* User Info */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-person-fill fs-1 text-primary me-3"></i>
                        <div>
                          <h4 className="mb-0">{user.name}</h4>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-envelope-fill text-muted me-2"></i>
                            <div>
                              <small className="text-muted">אימייל</small>
                              <div className="fw-bold">{user.email}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-sm-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <i className={`bi ${user.is_blocked ? 'bi-lock-fill text-warning' : 'bi-unlock-fill text-success'} me-2`}></i>
                            <div>
                              <small className="text-muted">סטטוס</small>
                              <div className="fw-bold">
                                {user.is_blocked ? "חשבון חסום" : "פעיל"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name Update Form */}
                  {!block && (
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">
                          <i className="bi bi-pencil-fill me-2"></i>
                          עדכון שם
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <label className="form-label">שם חדש</label>
                              <input 
                                type="text"
                                className="form-control"
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="הכנס שם חדש"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">&nbsp;</label>
                            <button 
                              className="btn btn-success w-100"
                              onClick={updateName}
                              disabled={!newName.trim() || newName === user.name}
                            >
                              <i className="bi bi-check-lg me-1"></i>
                              עדכן שם
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cloudinary Settings */}
                  {!block && (
                    <div className="card mb-4">
                      <div className="card-header bg-info text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-cloud-fill me-2"></i>
                          הגדרות Cloudinary
                        </h5>
                      </div>
                      <div className="card-body">
                        {/* Readonly Notice */}
                        {cloudExists && (
                          <div className="alert alert-warning" role="alert">
                            <i className="bi bi-shield-lock-fill me-2"></i>
                            ההגדרות הקיימות מוגנות מעריכה. למען האבטחה, יש למחוק את ההגדרות הקיימות ולהכניס פרטים חדשים.
                          </div>
                        )}

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Cloud Name</label>
                            <input 
                              type="text"
                              className={`form-control ${cloudExists ? 'bg-light text-muted' : ''}`}
                              value={cloudName}
                              onChange={(e) => setCloudName(e.target.value)}
                              placeholder="הכנס Cloud Name"
                              disabled={cloudExists}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">API Key</label>
                            <input 
                              type="text"
                              className={`form-control ${cloudExists ? 'bg-light text-muted' : ''}`}
                              value={cloudKey}
                              onChange={(e) => setCloudKey(e.target.value)}
                              placeholder="הכנס API Key"
                              disabled={cloudExists}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">API Secret</label>
                            <input 
                              type="password"
                              className={`form-control ${cloudExists ? 'bg-light text-muted' : ''}`}
                              value={cloudSecret}
                              onChange={(e) => setCloudSecret(e.target.value)}
                              placeholder="הכנס API Secret"
                              disabled={cloudExists}
                            />
                            {cloudSecret === "הסוד קיים אך סודי ולכן לא ניתן לצפייה" && (
                              <small className="text-muted">הסוד הקיים מוסתר מטעמי אבטחה</small>
                            )}
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2 mt-3">
                          {!cloudExists ? (
                            <button 
                              className="btn btn-success"
                              onClick={handleSaveCloudinary}
                              disabled={cloudLoading || !cloudName.trim() || !cloudKey.trim() || !cloudSecret.trim()}
                            >
                              {cloudLoading && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                              <i className="bi bi-check-lg me-1"></i>
                              הוסף פרטי Cloudinary
                            </button>
                          ) : (
                            <button 
                              className="btn btn-outline-danger"
                              onClick={handleDeleteCloudinary}
                              disabled={cloudLoading}
                            >
                              {cloudLoading && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                              <i className="bi bi-trash-fill me-1"></i>
                              מחק פרטי Cloudinary
                            </button>
                          )}
                        </div>
                        
                        {cloudExists && (
                          <div className="alert alert-success mt-3 mb-0" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            פרטי Cloudinary קיימים במערכת
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delete Account */}
                  {!block && (
                    <div className="card border-danger">
                      <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          אזור מסוכן
                        </h5>
                      </div>
                      <div className="card-body">
                        <p className="text-muted mb-3">
                          מחיקת החשבון הינה פעולה בלתי הפיכה. כל המידע שלך יימחק לצמיתות.
                        </p>
                        <button 
                          className="btn btn-danger"
                          onClick={deleteUser}
                        >
                          <i className="bi bi-trash-fill me-1"></i>
                          מחק משתמש
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

export default MyProfile;