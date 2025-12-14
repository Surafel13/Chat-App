import { useState } from 'react'
import './bootstrap.css'

import Header from './Components/UserMessagingPage.jsx/Header'
import MessagingPage from './Components/ChatPage/MessagingPage'
import SplashScreen from './Components/SplashScreen/SplashScreen'
import Auth from './Components/Auth/Auth'
import Verification from './Components/Verification/Verification'
import { Routes, Route } from "react-router-dom";


function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {/* {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Header />
      )} */}
   <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/verification" element={<VerifyEmail />} />
    </Routes>


    </>
  )
}

export default App
