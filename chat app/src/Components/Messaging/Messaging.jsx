import React, { useState, useEffect } from 'react'
import MessagingPage from '../ChatPage/MessagingPage';
import UsersBar from '../UsersBar/UsersBar';
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
    } else {
      setReceiver(null);
    }
  }, [receiverId]);

  const toggleSettingBar = () => {
    setSettingBar(!settingBar)
  }

  if (!currentUser) return <div className='MainWrapper'>Loading authentication...</div>;

  return (
    <div className='MainWrapper'>
      <div className='ChatDashboard'>
        {/* Sidebar with User List - Visible on desktop, or on mobile when no chat is selected */}
        <div className={`SidebarSection ${!receiverId ? 'show-mobile' : ''}`}>
          <UsersBar />
        </div>

        {/* Main Chat Section - Visible when a chat is selected, or as empty state on desktop */}
        <div className={`ChattingPage ${!receiverId ? 'hide-mobile' : ''}`}>
          {receiverId ? (
            <div className='ChatLayout'>
              <div className='HeaderWrapper'>
                <div className='informationSection'>
                  {/* Back button for mobile */}
                  <button className='backButton mobileOnly' onClick={() => navigate("/Messaging")}>
                    ←
                  </button>
                  <div className='imageWrapper'>
                    <img src={receiver?.photoURL || img1} alt="img" />
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
                {settingBar && (
                  <div className='settingBar'>
                    <button onClick={() => navigate(`/Profile/${receiverId}`)}>Look Profile</button>
                    <button>Clear History</button>
                    <button>Block User</button>
                    <button>Delete Chat</button>
                  </div>
                )}
              </div>

              <div className='ChatBody'>
                <MessagingPage receiverId={receiverId} currentUser={currentUser} />
              </div>
            </div>
          ) : (
            <div className="EmptyChatState">
              <div className="emptyContent">
                <span className="chatIcon">💬</span>
                <h3>Welcome to Messenger</h3>
                <p>Select a student from the list to start a private conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default Messaging

