import React, { useState, useEffect } from 'react'
import MessagingPage from '../ChatPage/MessagingPage';
import './Messaging.css'
import { useNavigate, useParams } from 'react-router-dom';
import img1 from './../../Img/cat-1.jpg'
import { useUser } from '../../Context/UserContext';
import { getUser } from '../../Users/Users';

function Messaging() {
  const { receiverId } = useParams();
  const navigate = useNavigate()
  const { user: currentUser } = useUser();
  const [receiver, setReceiver] = useState(null);
  const [settingBar, setSettingBar] = useState(false)

  useEffect(() => {
    if (receiverId) {
      getUser(receiverId).then(data => {
        setReceiver(data);
      });
    }
  }, [receiverId]);

  const toggleSettingBar = () => {
    setSettingBar(!settingBar)
  }

  if (!currentUser) return <div className='MainWrapper'>Loading authentication...</div>;

  return (
    <div className='MainWrapper container sm-h-75'>
      <div className='ChattingPage vh-100'>
        <div className='ChatLayout'>
          <div >
            <div className='HeaderWrapper'>
              <div className="d-flex align-items-center gap-2">
                <button onClick={() => navigate("/UsersBar")}>
                  ☰
                </button>
              </div>
              <div className='informationSection'>
                <div className='imageWrapper'>
                  <img src={img1} alt="img" />
                </div>
                <div className='NameContainer'>
                  <h6>{receiver?.displayName || (receiver?.email && receiver.email.split('@')[0]) || "Chat"}</h6>
                  <p>{receiver ? "Online" : "..."}</p>
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
                    <button onClick={() => navigate("/Profile")}>Look Profile</button>
                    <button>Clear History</button>
                    <button>Block User</button>
                    <button>Delete Chat</button>
                  </div>
                  : <></>
              }

            </div>
          </div>
          <hr />
          <div className='ChatBody'>
            {receiverId && <MessagingPage receiverId={receiverId} currentUser={currentUser} />}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Messaging
