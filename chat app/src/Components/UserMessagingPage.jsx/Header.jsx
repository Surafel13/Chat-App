import React from 'react'
import { useState } from 'react';
import './Header.css'


function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
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
            <div >
                <button onClick={toggleIsOpen} className={`${isOpen ? "d-none" : ""}`}>
                    ☰ Open Menu
                </button>
            </div>

        </>
    );

}

export default Header
