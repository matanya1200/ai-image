import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate("/login");
    } catch (err) {
      alert("רישום נכשל");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-person-plus-fill me-2"></i>
                הרשמה
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <i className="bi bi-person-fill me-1"></i>
                    שם מלא
                  </label>
                  <input 
                    type="text"
                    className="form-control" 
                    id="name"
                    name="name"
                    placeholder="הזן את שמך המלא"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope-fill me-1"></i>
                    אימייל
                  </label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    name="email"
                    placeholder="הזן את כתובת האימייל שלך"
                    value={form.email}
                    onChange={handleChange}
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
                    name="password"
                    placeholder="בחר סיסמה חזקה"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-person-plus-fill me-1"></i>
                  הרשם
                </button>
              </form>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  כבר יש לך חשבון? <a href="/login" className="text-decoration-none">התחבר כאן</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;