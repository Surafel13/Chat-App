import React from 'react'
import img1 from './../../Img/cat-1.jpg'
import './../Messaging/Messaging.css'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../Users/Users'


function UsersBar() {
    const navigate = useNavigate()

    const [users, setUsers] = React.useState([])
    React.useEffect(() => {
        const fetchUsers = async () => {
            const usersList = await getUsers();
            setUsers(usersList);
        };
        fetchUsers();
    }, []);



    return (
        <>
            <div className='MainWrapper container sm-h-75'>

                <div className='UserBar'>
                    <div className='barHeader'>
                        <h4>Messages</h4>
                    </div>
                    <div className='InputWrapper'>
                        <input type="text" placeholder='Search conversations...' />
                    </div>
                    <div><hr /></div>
                    <div className='text-center my-2 border-bottom border-top pt-2 pb-2'>
                        <h5>Find freinds</h5>
                    </div>
                    <div className='UsersList'>
                        {users.map((user) => (
                            <div key={user.id} className='UserItem' onClick={() => navigate('/Messaging')}>
                                <div className='imageWrapper'>
                                    <img src={img1} alt="img" />
                                </div>
                                <div className='UserInfo'>
                                    <h6>{user.displayName || user.email.split('@')[0]}</h6>
                                    <p>Last message...</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}

export default UsersBar
