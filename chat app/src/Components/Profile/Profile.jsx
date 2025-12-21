import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import img1 from './../../Img/cat-1.jpg'
import './Profile.css'
import { useUser } from '../../Context/UserContext';
import { getUsers } from '../../Users/Users';

function Profile() {

    const navigate = useNavigate()
    const { user } = useUser();
    console.log(user);
    const [userName, setUserName] = React.useState('');

    React.useEffect(() => {
        if (user.displayName != null) {
            setUserName(user.displayName);
        }
        else if (user.email != null) {
            const nameFromEmail = user.email.split('@')[0];
            setUserName(nameFromEmail);
        }
    }, [user]);

    console.log(getUsers());

    return (
        <>
            <div className='UserInfoWrapper'>
                <div>
                    <button onClick={() => navigate('/UsersBar')}>
                        <FaArrowLeft size={15}/>
                    </button>
                </div>
                <div>
                    <img src={img1} alt="profile" />
                </div>
                <div className='userInfo'>
                    <h1>Name</h1>
                    <small>
                        status
                    </small>
                </div>
            </div>
            <div className='AccountInfoWrapper'>
                <div>
                    <h5>Account Information</h5>
                </div>
                <div className='Infos'>
                    <p>{user.email}</p>
                    <small>E-Mail</small>
                </div>
                <div className='Infos'>
                    <p>Abebebesobela</p>
                    <small>Username</small>
                </div>
                <div className='Infos bio'>
                    <p>I am abebnksadnjsadnjasnd nklaehflu fajndfsjeifun dsnmdnfkjsanue.</p>
                    <small>Bio</small>
                </div>
            </div>
        </>
    )
}

export default Profile
