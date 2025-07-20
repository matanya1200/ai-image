import { useEffect, useState } from "react";
import { getMyProfile, updateMyName, deleteMyUser} from "../../api/users";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
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