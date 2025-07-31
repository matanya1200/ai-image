import { useEffect, useState } from "react";
import { getAllNotifications, getUnreadNotifications, markAsRead } from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const res = showUnreadOnly
        ? await getUnreadNotifications()
        : await getAllNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("שגיאה בקבלת הודעות", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [showUnreadOnly]);

  const handleMarkAsRead = async (id, isRead) => {
    // רק אם ההודעה לא נקראה - נסמן אותה כנקראה
    if (!isRead) {
      try {
        await markAsRead(id);
        loadNotifications();
      } catch (err) {
        console.error("שגיאה בסימון הודעה כנקראה", err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">טוען הודעות...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title mb-0">
                  <i className="bi bi-envelope me-2"></i>
                  ההודעות שלי
                </h2>
                {unreadCount > 0 && (
                  <span className="badge bg-warning text-dark">
                    {unreadCount} לא נקראו
                  </span>
                )}
              </div>
            </div>
            
            <div className="card-body">
              {/* Filter Controls */}
              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="unreadFilter"
                    checked={showUnreadOnly}
                    onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  />
                  <label className="form-check-label" htmlFor="unreadFilter">
                    <i className="bi bi-filter me-2"></i>
                    הצג רק הודעות שלא נקראו
                  </label>
                </div>
              </div>

              {/* Notifications List */}
              {notifications.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-envelope-check fs-1"></i>
                  <h4 className="mt-3">אין הודעות להצגה</h4>
                  <p className="mb-0">
                    {showUnreadOnly 
                      ? "כל ההודעות שלך נקראו! 🎉" 
                      : "לא קיבלת הודעות עדיין."
                    }
                  </p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item mb-3 p-3 border rounded-3 position-relative cursor-pointer transition-all ${
                        !n.is_read 
                          ? 'border-primary bg-primary bg-opacity-10 shadow-sm' 
                          : 'border-light bg-light'
                      }`}
                      style={{ 
                        cursor: !n.is_read ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        transform: !n.is_read ? 'translateX(-2px)' : 'none'
                      }}
                      onClick={() => handleMarkAsRead(n.id, n.is_read)}
                      onMouseEnter={(e) => {
                        if (!n.is_read) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!n.is_read) {
                          e.currentTarget.style.transform = 'translateX(-2px)';
                          e.currentTarget.style.boxShadow = '';
                        }
                      }}
                    >
                      {/* Unread Indicator */}
                      {!n.is_read && (
                        <div 
                          className="position-absolute top-0 start-0 bg-primary"
                          style={{
                            width: '4px',
                            height: '100%',
                            borderRadius: '0 3px 3px 0'
                          }}
                        ></div>
                      )}

                      {/* Status Icon */}
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          {!n.is_read ? (
                            <i className="bi bi-envelope-fill text-primary fs-5"></i>
                          ) : (
                            <i className="bi bi-envelope-open text-muted fs-5"></i>
                          )}
                        </div>
                        
                        <div className="flex-grow-1">
                          {/* Message Content */}
                          <div className={`mb-2 ${!n.is_read ? 'fw-bold text-dark' : 'text-muted'}`}>
                            {n.message}
                          </div>
                          
                          {/* Timestamp */}
                          <div className="d-flex justify-content-between align-items-center">
                            <small className={!n.is_read ? 'text-primary' : 'text-muted'}>
                              <i className="bi bi-clock me-1"></i>
                              {new Date(n.created_at).toLocaleString('he-IL')}
                            </small>
                            
                            {/* Read Status Badge */}
                            <span className={`badge ${!n.is_read ? 'bg-primary' : 'bg-secondary'}`}>
                              {!n.is_read ? 'חדש' : 'נקרא'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Click to read hint for unread messages */}
                      {!n.is_read && (
                        <div className="position-absolute bottom-0 end-0 m-2">
                          <small className="text-primary opacity-75">
                            <i className="bi bi-hand-index"></i>
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-right me-2"></i>
                  חזור
                </button>
                
                <div className="text-muted small">
                  {notifications.length > 0 && (
                    <>
                      סה"כ: {notifications.length} הודעות
                      {unreadCount > 0 && (
                        <span className="text-primary ms-2">
                          • {unreadCount} לא נקראו
                        </span>
                      )}
                    </>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={async () => {
                      try {
                        const unreadNotifications = notifications.filter(n => !n.is_read);
                        
                        for (const notification of unreadNotifications) {
                          await markAsRead(notification.id);
                        }
                        loadNotifications();
                      } catch (err) {
                        console.error("שגיאה בסימון כל ההודעות כנקראות", err);
                      }
                    }}
                  >
                    <i className="bi bi-check-all me-1"></i>
                    סמן הכל כנקרא
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}