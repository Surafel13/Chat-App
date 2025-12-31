import React from 'react'

import './UsersBar.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../Context/UserContext'
import { db } from '../../firebase'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import { getColorFromInitials, getInitials } from '../../Utils/avatarUtils'

function UsersBar() {
    const navigate = useNavigate()
    const { receiverId } = useParams()
    const { user: currentUser } = useUser()

    const [users, setUsers] = React.useState([])
    const [conversations, setConversations] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState('')

    // 1. Listen to all users in real-time
    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const q = query(collection(db, "users"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!isMounted) return;

            // snapshot.docs only contains documents that currently exist in the database
            const usersList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                // Ensure we only keep users that have basic required data
                .filter(u => u.email || u.displayName);

            setUsers(usersList);
            setLoading(false);
        }, (err) => {
            console.error('Failed to fetch users', err);
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // 2. Listen to real-time conversation updates for last messages
    React.useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convMap = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const otherId = data.participants.find(id => id !== currentUser.uid);
                if (otherId) {
                    convMap[otherId] = data;
                }
            });
            setConversations(convMap);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const { activeChats, findFriends } = React.useMemo(() => {
        const q = (search || '').trim().toLowerCase()

        let allList = (users || [])
            .filter(u => u && u.id !== currentUser?.uid && u.isVerified !== false)
            .map(user => {
                const conv = conversations[user.id];
                let ts = 0;
                if (conv?.timestamp) {
                    ts = conv.timestamp?.toMillis ? conv.timestamp.toMillis() : (Number(conv.timestamp) || 0);
                }
                return {
                    ...user,
                    lastMsg: conv?.lastMessage,
                    timestamp: ts,
                    hasHistory: !!conv
                };
            });

        // Filter by search query if present
        if (q) {
            allList = allList.filter(u =>
                (u.displayName || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q)
            );
        }

        const active = allList
            .filter(u => u.hasHistory)
            .sort((a, b) => b.timestamp - a.timestamp);

        const friends = allList
            .filter(u => !u.hasHistory);

        return { activeChats: active, findFriends: friends };
    }, [users, search, conversations, currentUser])

    const renderAvatar = (user, isLarge = false) => {
        if (user?.photoURL) {
            return <img src={user.photoURL} alt="avatar" />;
        }
        return (
            <div className="fallback-avatar-small" style={{ backgroundColor: getColorFromInitials(user?.displayName || user?.email) }}>
                {getInitials(user?.displayName || user?.email)}
            </div>
        );
    };

    return (
        <div className='UsersContainer'>
            <div className='CurrentUserHeader' onClick={() => navigate('/Profile')}>
                <div className='imageWrapper'>
                    {renderAvatar(currentUser)}
                </div>
                <div className='UserInfo'>
                    <h6>My Profile</h6>
                    <p>{currentUser?.displayName || "Set your name"}</p>
                </div>
                <div className="settings-icon">⚙️</div>
            </div>

            <div className='barHeader'>
                <h4>Chats</h4>
            </div>
            <div className='InputWrapper'>
                <input
                    type="text"
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className='UsersList'>
                {loading ? (
                    <div className="spinnerWrap">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* 1. Conversations Section */}
                        {activeChats.length > 0 && (
                            <div className='SectionWrapper'>
                                <p className='SectionTitle'>Recent Conversations</p>
                                {activeChats.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`UserItem ${receiverId === user.id ? 'active' : ''}`}
                                        onClick={() => navigate(`/Messaging/${user.id}`)}
                                    >
                                        <div className='imageWrapper'>
                                            {renderAvatar(user)}
                                        </div>
                                        <div className='UserInfo'>
                                            <h6>{user.displayName || (user.email ? user.email.split('@')[0] : 'User')}</h6>
                                            <p>{user.lastMsg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. Find Friends Section */}
                        {findFriends.length > 0 && (
                            <div className='SectionWrapper'>
                                <p className='SectionTitle'>Find Friend</p>
                                {findFriends.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`UserItem ${receiverId === user.id ? 'active' : ''}`}
                                        onClick={() => navigate(`/Messaging/${user.id}`)}
                                    >
                                        <div className='imageWrapper'>
                                            {renderAvatar(user)}
                                        </div>
                                        <div className='UserInfo'>
                                            <h6>{user.displayName || (user.email ? user.email.split('@')[0] : 'User')}</h6>
                                            <p>Start a new chat</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeChats.length === 0 && findFriends.length === 0 && (
                            <div className="emptyState">No users found</div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
export default UsersBar
