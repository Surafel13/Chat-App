import React from 'react'
import img1 from './../../Img/cat-1.jpg'
import './UsersBar.css'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../Users/Users'


function UsersBar() {
    const navigate = useNavigate()

    const [users, setUsers] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState('')

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const usersList = await getUsers();
                setUsers(usersList || []);
            } catch (err) {
                console.error('Failed to fetch users', err)
                setUsers([])
            } finally {
                setLoading(false)
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = React.useMemo(() => {
        const q = (search || '').trim().toLowerCase()
        if (!q) return users
        return users.filter((u) => {
            const name = (u.displayName || '').toLowerCase()
            const email = (u.email || '').toLowerCase()
            const local = email.split('@')[0]
            return name.includes(q) || email.includes(q) || local.includes(q)
        })
    }, [users, search])



    return (
        <>
            <div className='MainWrapper container sm-h-75'>

                <div className='UserBar'>
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
                        <h5>Find freinds</h5>
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
                                        <p>Last message...</p>
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
