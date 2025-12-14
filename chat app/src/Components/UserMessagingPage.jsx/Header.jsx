import React from 'react'
import { useState } from 'react';
import './Header.css'
import img1 from './../../Img/cat-1.jpg'
import MessagingPage from '../ChatPage/MessagingPage';


function Header() {
    const [isOpen, setIsOpen] = useState(true)
    const [settingBar, setSettingBar] = useState(false)


    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const toggleSettingBar = () => {
        setSettingBar(!settingBar)
    }

    return (

        <div className='MainWrapper container sm-h-75'>
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
                            <div className='imageWrapper'>
                                <img src={img1} alt="img" />
                            </div>
                            <div>
                                <div>
                                    <h6>Name name</h6>
                                </div>
                                <div>
                                    <small>message</small>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='usersWrapper'>
                            <div className='imageWrapper'>
                                <img src={img1} alt="img" />
                            </div>
                            <div>
                                <div>
                                    <h6>Name name</h6>
                                </div>
                                <div>
                                    <small>message</small>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='usersWrapper'>
                            <div className='imageWrapper'>
                                <img src={img1} alt="img" />
                            </div>
                            <div>
                                <div>
                                    <h6>Name name</h6>
                                </div>
                                <div>
                                    <small>message</small>
                                </div>
                            </div>
                        </div>
                        <hr />


                    </div>

                </div> :
                <></>}
            <div className='ChattingPage vh-100'>
                <div className={`${isOpen ? "d-none" : "h-100"}`}>
                    <div >
                        <div className='HeaderWrapper'>
                            <div>
                                <button onClick={toggleIsOpen}>
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
