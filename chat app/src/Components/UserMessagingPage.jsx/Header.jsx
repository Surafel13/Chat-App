import React from 'react'
import { useState } from 'react';
import './Header.css'
import img1 from './../../Img/cat-1.jpg'
import MessagingPage from '../ChatPage/MessagingPage';


function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [settingBar, setSettingBar] = useState(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const toggleSettingBar = () => {
        setSettingBar(!settingBar)
    }

    return (
        <div className='MainWrapper'>
            {isOpen ?
                <div className='UserBar'>
                    <div className='barHeader'>
                        <h4>Messages</h4>
                        <button onClick={toggleIsOpen}>
                            ×
                        </button>
                    </div>
                    <div className='InputWrapper'>
                        <input type="text" placeholder='Search conversations...' />
                    </div>
                    <div><hr /></div>
                    <div>
                        <div className='usersWrapper'>
                            <li><a href="#">User1</a></li>
                            <li><a href="#">User2</a></li>
                            <li><a href="#">User3</a></li>
                            <li><a href="#">User4</a></li>
                        </div>
                    </div>

                </div> :
                <></>}
            <div className='ChattingPage'>
                <div className={`${isOpen ? "d-none" : ""}`}>
                    <div >
                        <div className='HeaderWrapper'>
                            <div>
                                <button onClick={toggleIsOpen}>
                                    ☰ Messages
                                </button>
                            </div>
                            <div className='informationSection'>
                                <div className='imageWrapper'>
                                    <img src={img1} alt="img" />
                                </div>
                                <div className='NameContainer'>
                                    <h6>ksanjndsaojdsalsad,msna,ds</h6>
                                </div>
                            </div>

                            <div className='SettingButton'>
                                <button onClick={toggleSettingBar}>
                                    :
                                </button>
                            </div>
                        </div>
                        <div className='SettingWrapper'>

                            {
                                settingBar ?
                                    <div className='settingBar'>
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
    );

}

export default Header
