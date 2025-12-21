import React, { useState, useEffect, useRef } from 'react'
import './MessagingPage.css'
import { db } from '../../firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore'

function MessagingPage({ receiverId, currentUser }) {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)

    // Generate a unique chatId for the two users
    const chatId = [currentUser.uid, receiverId].sort().join('_');

    useEffect(() => {
        if (!chatId) return;

        // Query messages for this specific chat, ordered by timestamp
        const q = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        }, (error) => {
            console.error("Error listening to messages:", error);
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (message.trim() === "" || !currentUser) return;

        const messageData = {
            chatId: chatId,
            senderId: currentUser.uid,
            receiverId: receiverId,
            text: message,
            timestamp: serverTimestamp(),
            senderName: currentUser.displayName || currentUser.email.split('@')[0]
        };

        try {
            const currentMsg = message;
            setMessage("");

            // 1. Add the actual message
            await addDoc(collection(db, "messages"), messageData);

            // 2. Update/Create the conversation summary for the sidebar
            const { doc, setDoc } = await import("firebase/firestore");
            await setDoc(doc(db, "conversations", chatId), {
                chatId,
                lastMessage: currentMsg,
                lastSenderId: currentUser.uid,
                participants: [currentUser.uid, receiverId],
                timestamp: serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    return (
        <div className='ChatSection'>
            <div className='MessagingArea'>
                {messages.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                        <p>No messages yet. Say hi! 👋</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={msg.senderId === currentUser.uid ? 'ReciverMessage' : 'SenderMessage'}
                        >
                            <p>{msg.text}</p>
                            <small>
                                {msg.timestamp?.toDate ?
                                    msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'Sending...'}
                            </small>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className='bottomWrapper'>
                <div>
                    <input
                        type="text"
                        placeholder='Write Something... '
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                </div>
                <div>
                    <button
                        className={`${message === "" ? '' : 'sendData'}`}
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessagingPage
