import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      const { role, user_id } = res.data;
      const token = res.data.access_token;
      onLogin(token, role, user_id);
      navigate("/");
    } catch (err) {
      alert("התחברות נכשלה");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                התחברות
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope-fill me-1"></i>
                    אימייל
                  </label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    placeholder="הזן את כתובת האימייל שלך"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock-fill me-1"></i>
                    סיסמה
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    placeholder="הזן את הסיסמה שלך"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  התחבר
                </button>
              </form>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  עדיין לא רשום? <a href="/register" className="text-decoration-none">הרשם כעת</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;