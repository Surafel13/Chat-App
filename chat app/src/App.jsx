import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './bootstrap.css'

import UsersBar from './Components/UsersBar/UsersBar'
import Messaging from './Components/Messaging/Messaging'
import SplashScreen from './Components/SplashScreen/SplashScreen'
import Auth from './Components/Auth/Auth'
import Verification from './Components/Verification/Verification'
import Profile from './Components/Profile/Profile';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/verification" element={<Verification />} />

        {/* Protected Routes - require email verification */}
        <Route element={<ProtectedRoute requiresVerification={true} />}>
          <Route path="/Messaging" element={<Messaging />} />
          <Route path="/Messaging/:receiverId" element={<Messaging />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Profile/:userId" element={<Profile />} />
          <Route path="/UsersBar" element={<UsersBar />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
