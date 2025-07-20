import { useEffect, useState } from "react";
import { blockUser, getAllUsers } from "../../api/users";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const toggleBlock = async (email, currentStatus) => {
    try {
      await blockUser(email, !currentStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון סטטוס המשתמש");
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
              <p className="mt-2">טוען את רשימת המשתמשים...</p>
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
            <div className="card-header bg-danger text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-people-fill me-2"></i>
                ניהול משתמשים
              </h2>
            </div>
            
            <div className="card-body">
              {users.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-people display-4 text-muted"></i>
                  <p className="text-muted mt-2">אין משתמשים במערכת</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <span className="badge bg-info me-2">
                      <i className="bi bi-info-circle me-1"></i>
                      סה"כ משתמשים: {users.length}
                    </span>
                    <span className="badge bg-success me-2">
                      <i className="bi bi-check-circle me-1"></i>
                      פעילים: {users.filter(u => !u.is_blocked).length}
                    </span>
                    <span className="badge bg-warning">
                      <i className="bi bi-x-circle me-1"></i>
                      חסומים: {users.filter(u => u.is_blocked).length}
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">
                            <i className="bi bi-person-fill me-1"></i>
                            שם
                          </th>
                          <th scope="col">
                            <i className="bi bi-envelope-fill me-1"></i>
                            אימייל
                          </th>
                          <th scope="col">
                            <i className="bi bi-award-fill me-1"></i>
                            תפקיד
                          </th>
                          <th scope="col">
                            <i className="bi bi-shield-fill me-1"></i>
                            סטטוס
                          </th>
                          <th scope="col">
                            <i className="bi bi-gear-fill me-1"></i>
                            פעולות
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2 text-primary"></i>
                                <strong>{u.name}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-envelope me-2 text-muted"></i>
                                {u.email}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {u.role === 'admin' ? (
                                  <><i className="bi bi-shield-fill me-1"></i>מנהל</>
                                ) : (
                                  <><i className="bi bi-person-fill me-1"></i>משתמש</>
                                )}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${u.is_blocked ? 'bg-warning' : 'bg-success'}`}>
                                {u.is_blocked ? (
                                  <><i className="bi bi-lock-fill me-1"></i>חסום</>
                                ) : (
                                  <><i className="bi bi-unlock-fill me-1"></i>פעיל</>
                                )}
                              </span>
                            </td>
                            <td>
                              {u.role !== 'admin' ? (
                                <button 
                                  className={`btn btn-sm ${u.is_blocked ? 'btn-success' : 'btn-warning'}`}
                                  onClick={() => toggleBlock(u.email, u.is_blocked)}
                                >
                                  {u.is_blocked ? (
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
                              ) : (
                                <span className="text-muted">
                                  <i className="bi bi-shield-exclamation me-1"></i>
                                  אין אפשרות לחסום מנהל
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;