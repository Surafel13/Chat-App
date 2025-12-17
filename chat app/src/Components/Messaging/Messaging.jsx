import React, { useState } from 'react'
import MessagingPage from '../ChatPage/MessagingPage';
import './Messaging.css'
import { useNavigate } from 'react-router-dom';
import img1 from './../../Img/cat-1.jpg'

function Messaging() {

  const navigate = useNavigate()

  const [settingBar, setSettingBar] = useState(false)

  const toggleSettingBar = () => {
        setSettingBar(!settingBar)
    }

  return (
    <div className='MainWrapper container sm-h-75'>
      <div className='ChattingPage vh-100'>
        <div >
          <div >
            <div className='HeaderWrapper'>
              <div>
                <button onClick={() => navigate("/UsersBar")}>
                  ☰
                </button>
              </div>
              <div className='informationSection'>
                <div className='imageWrapper'>
                  <img src={img1} alt="img" />
                </div>
                <div className='NameContainer'>
                  <h6>Name</h6>
                  <p>Status</p>
                </div>
              </div>

              <div className='SettingButton'>
                <button onClick={toggleSettingBar}>
                  ⋮
                </button>
              </div>
            </div>
            <div className='SettingWrapper'>

              {
                settingBar ?
                  <div className='settingBar'>
                    <button onClick={navigate("/Profile")}>Look Profile</button>
                    <button>Clear History</button>
                    <button>Block User</button>
                    <button>Delete Chat</button>
                  </div>
                  : <></>
              }

            </div>
          </div>
          <hr />
          <div>
            <MessagingPage />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Messaging
