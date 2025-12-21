import React from 'react'
import img1 from './../../Img/cat-1.jpg'
import './UsersBar.css'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../Users/Users'
import { useUser } from '../../Context/UserContext'
import { db } from '../../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

function UsersBar() {
    const navigate = useNavigate()
    const { user: currentUser } = useUser()

    const [users, setUsers] = React.useState([])
    const [conversations, setConversations] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState('')

    // Safety check for auth
    if (!currentUser && !loading) {
        navigate('/');
        return null;
    }

    // 1. Listen to all users in real-time
    React.useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "users"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
            setLoading(false);
        }, (err) => {
            console.error('Failed to fetch users', err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    console.log(getUsers());

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
                // Find the other participant's ID
                const otherId = data.participants.find(id => id !== currentUser.uid);
                if (otherId) {
                    convMap[otherId] = data;
                }
            });
            setConversations(convMap);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const filteredUsers = React.useMemo(() => {
        const q = (search || '').trim().toLowerCase()

        let list = (users || [])
            .filter(u => u && u.id !== currentUser?.uid) // Don't show yourself
            .map(user => {
                const conv = conversations[user.id];
                let ts = 0;
                if (conv?.timestamp) {
                    if (typeof conv.timestamp.toMillis === 'function') {
                        ts = conv.timestamp.toMillis();
                    } else if (conv.timestamp instanceof Date) {
                        ts = conv.timestamp.getTime();
                    } else {
                        ts = Number(conv.timestamp) || 0;
                    }
                }
                return {
                    ...user,
                    lastMsg: conv?.lastMessage || "Start a new conversation",
                    timestamp: ts
                };
            });

        // Sort: users with recent history come first
        list.sort((a, b) => b.timestamp - a.timestamp);

        if (!q) return list;

        return list.filter((u) => {
            const name = (u.displayName || '').toLowerCase()
            const email = (u.email || '').toLowerCase()
            const local = (u.email || '').split('@')[0]
            return name.includes(q) || email.includes(q) || local.includes(q)
        });
    }, [users, search, conversations])



    return (
        <>
            <div className='MainWrapper container sm-h-75'>

                <div className='UsersContainer'>
                    <div className='barHeader'>
                        <h4>Messages</h4>
                    </div>
                    <div className='InputWrapper'>
                        <input
                            type="text"
                            placeholder='Search conversations...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search conversations"
                        />
                    </div>
                    <div><hr /></div>
                    <div className='text-center my-2 border-bottom border-top pt-2 pb-2'>
                        <h5>Find Friends</h5>
                    </div>
                    <div className='UsersList'>
                        {loading ? (
                            <div className="spinnerWrap">
                                <div className="spinner" aria-hidden="true"></div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="emptyState">No users found</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className='UserItem' onClick={() => navigate(`/Messaging/${user.id}`)}>
                                    <div className='imageWrapper'>
                                        <img src={img1} alt="img" />
                                    </div>
                                    <div className='UserInfo'>
                                        <h6>{user.displayName || (user.email && user.email.split('@')[0])}</h6>
                                        <p>{user.lastMsg}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default UsersBar
