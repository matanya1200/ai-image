import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/images/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NavbarGuest from "./components/NavbarGuest";
import NavbarUser from "./components/NavbarUser";
import MyProfile from "./pages/users/MyProfile";
import MyImages from "./pages/images/MyImages";
import AddImage from "./pages/images/AddImage";
import ImageDetails from "./pages/images/ImageDetails";
import AddComment from "./pages/commits/AddComment";
import EditComment from "./pages/commits/EditComment";
import AdminUsers from "./pages/users/AdminUsers";
import AdminComments from "./pages/commits/AdminComments";
import PublicAlbums from "./pages/albums/PublicAlbums";
import AlbumDetails from "./pages/albums/AlbumDetails";
import MyAlbums from "./pages/albums/MyAlbums";
import EditAlbum from "./pages/albums/EditAlbum";
import CreateAlbum from "./pages/albums/CreateAlbum";
import BlockedImagesAdmin from "./pages/images/BlockedImagesAdmin";
import Notifications from "./pages/users/Notifications"
import ChatAI from "./pages/ai/ChatAI";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");
    setIsLoggedIn(!!storedToken);
    setRole(storedRole);
    setUserId(storedUserId);
  }, []);

  const handleLogin = (token, role, user_id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", user_id);
    setIsLoggedIn(true);
    setRole(role);
    setUserId(user_id);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <NavbarUser role={role} onLogout={handleLogout} />
      ) : (
        <NavbarGuest />
      )}
      <Routes>
        <Route path="/" element={<Home role={role} isLoggedIn={isLoggedIn}/>} />
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/albums" element={<PublicAlbums role={role}/>} />
        <Route path="/albums/:id" element={<AlbumDetails userId={userId}/>} />
        {isLoggedIn && (
          <>
            {role === "admin" && (
              <>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/blocked-images" element={<BlockedImagesAdmin />} />
              </>
            )}
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/my-images" element={<MyImages />} />
            <Route path="/add-image" element={<AddImage />} />
            <Route path="/images/:id" element={<ImageDetails userId={userId}/>} />
            <Route path="/add-comment/:id" element={<AddComment />} />
            <Route path="/edit-comment/:id" element={<EditComment />} />
            <Route path="/albums/:id/private" element={<AlbumDetails />} />
            <Route path="/my-albums" element={<MyAlbums />} />
            <Route path="/albums/edit/:id" element={<EditAlbum />} />
            <Route path="/albums/new" element={<CreateAlbum />} />
            <Route path="/chat-ai" element={<ChatAI />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
