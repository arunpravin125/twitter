import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/auth/home/HomePage";
import LoginPage from "./pages/auth/Login/LoginPage";
import SignupPage from "./pages/auth/Signup/SignupPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";


function App() {
  return (
    <>
      <div className="bg-black flex max-w-6xl mx-auto">
        {/* common */}
        <Sidebar/> 
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/notifications" element={<NotificationPage />}></Route>
          <Route path="/profile/:username" element={<ProfilePage/>}></Route>
        </Routes>
        <RightPanel/>
      </div>
    </>
  );
}

export default App;
