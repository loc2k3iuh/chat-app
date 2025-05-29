import React, { use, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import {Loader} from "lucide-react"
import { useThemeStore } from "./store/useThemeStore";

export const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  console.log("Online User: ", onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("authUser in App.jsx: ", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <div data-theme = {theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/> } />
        <Route path="/login" element={!authUser ? <LogInPage />  : <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
};
export default App;
