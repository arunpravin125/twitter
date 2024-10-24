import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/auth/home/HomePage";
import LoginPage from "./pages/auth/Login/LoginPage";
import SignupPage from "./pages/auth/Signup/SignupPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {

  const {data:authUser,isLoading}=useQuery({
    queryKey:['authUser'],
    queryFn:async()=>{
      try {
        const res = await fetch("api/auth/me")
        const data = await res.json()
        if(data.error){
          return null
        }
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        console.log("authUser",data)
        return data
      } catch (error) {
        console.log("erorr in authUser")
        throw new Error(error)
        
      }
    },
    retry:false
  })

  if(isLoading){
    return(
      <div className="h-screen flex justify-center items-center" >
     <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <div className="bg-black flex max-w-6xl mx-auto">
        {/* common */}
      {authUser &&  <Sidebar/> }
        <Routes>
          <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />}></Route>
          <Route path="/login" element={authUser?<Navigate to="/" />:<LoginPage />}></Route>
          <Route path="/signup" element={authUser?<Navigate to="/" />:<SignupPage />}></Route>
          <Route path="/notifications" element={authUser?<NotificationPage />:<Navigate to="/login" />}></Route>
          <Route path="/profile/:username" element={authUser?<ProfilePage/>:<Navigate to="/login" />}></Route>
        </Routes>
      {authUser &&  <RightPanel/>}
      </div>
    </>
  );
}

export default App;
