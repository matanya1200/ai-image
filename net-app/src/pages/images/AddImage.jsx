import { useState, useEffect } from "react";
import {generateImageWithAI, uploadImageFile, addImageByUrl} from "../../api/images";
import { getMyProfile } from "../../api/users";

function AddImage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [block, setBlock] = useState(false);

  useEffect(() => {
    fetchUserBlock()
  },[]);

  const fetchUserBlock = async () => {
    const res = await getMyProfile();
    if(res.data.is_blocked == 1){
      setBlock(true);
    }
  }

  const uploadFromFile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    const res = await uploadImageFile(formData);
    alert("תמונה הועלתה: " + res.data.name);
    setName("");
    setFile(null)
  };

  const uploadFromUrl = async () => {
    const res = await addImageByUrl(name, url);
    alert("תמונה נוספה");
    setName("");
    setUrl("");
  };

  const generateFromAI = async () => {
    try {
      setIsGenerating(true);
      const res = await generateImageWithAI(prompt, name)
      setGeneratedUrl(res.data.url);
    } catch (err) {
      alert("אירעה שגיאה ביצירת התמונה");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearGenerated = () => {
    setGeneratedUrl("");
    setPrompt("");
    setName("");
  };

  return (
    <div className="container mt-4">
      {!block && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="card-title mb-0">
                  <i className="bi bi-palette me-2"></i>
                  הוספת תמונה
                </h2>
              </div>
              <div className="card-body">
                {/* Name Input */}
                <div className="mb-4">
                  <label htmlFor="imageName" className="form-label fw-bold">
                    שם התמונה
                  </label>
                  <input
                    id="imageName"
                    type="text"
                    className="form-control"
                    placeholder="שם התמונה"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* File Upload Section */}
                <div className="mb-4">
                  <h4 className="h5 text-primary mb-3">
                    <i className="bi bi-folder me-2"></i>
                    העלאה מקובץ
                  </h4>
                  <div className="row">
                    <div className="col-md-8">
                      <input 
                        type="file" 
                        className="form-control"
                        onChange={(e) => setFile(e.target.files[0])} 
                      />
                    </div>
                    <div className="col-md-4">
                      <button 
                        className="btn btn-outline-primary w-100"
                        onClick={uploadFromFile}
                        disabled={!name || !file}
                      >
                        <i className="bi bi-upload me-2"></i>
                        העלה קובץ
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* URL Upload Section */}
                <div className="mb-4">
                  <h4 className="h5 text-primary mb-3">
                    <i className="bi bi-link me-2"></i>
                    הוספה מקישור
                  </h4>
                  <div className="row">
                    <div className="col-md-8">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="קישור לתמונה"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <button 
                        className="btn btn-outline-primary w-100"
                        onClick={uploadFromUrl}
                        disabled={!name || !url}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        הוסף מקישור
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* AI Generation Section */}
                <div className="mb-4">
                  <h4 className="h5 text-primary mb-3">
                    <i className="bi bi-robot me-2"></i>
                    יצירת תמונה בעזרת AI
                  </h4>
                  <div className="row">
                    <div className="col-md-8">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="תיאור מפורט לתמונה (prompt)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button 
                        className="btn btn-success w-100"
                        onClick={generateFromAI} 
                        disabled={isGenerating || !prompt || !name}
                      >
                        {isGenerating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            יוצר את התמונה...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-magic me-2"></i>
                            צור תמונה בעזרת AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generated Image Preview */}
                {generatedUrl && (
                  <div className="mt-4">
                    <div className="alert alert-success">
                      <h5 className="alert-heading">
                        <i className="bi bi-check-circle me-2"></i>
                        תצוגה מקדימה של התמונה:
                      </h5>
                      <div className="text-center">
                        <img 
                          src={generatedUrl} 
                          alt={name} 
                          className="img-fluid rounded shadow"
                          style={{ maxWidth: "400px" }}
                        />
                      </div>
                      <div className="mt-3">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={clearGenerated}
                        >
                          <i className="bi bi-trash me-2"></i>
                          נקה
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {block && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>משתמש חסום לא יכול להוסיף תמונה</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddImage;