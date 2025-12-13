import React, { useState } from 'react'
import './MessagingPage.css'

function MessagingPage() {
    return (
        <div className='ChatSection'>
            <div className='MessagingArea'>
                <div className='SenderMessage'>
                    <p>
                        Sender Messages
                    </p>
                </div>
                <div className='ReciverMessage'>
                    <p>
                        Reciver Message
                    </p>
                </div>
            </div>

            <div className='bottomWrapper'>
                <div>
                    <input type="text" placeholder='Write Something ... ' />
                </div>
                <div>
                    <button>
                        send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessagingPage
