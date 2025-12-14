import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Auth.css'



function Auth() {


    const [logIn, setLogIn] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    //     const CheckPassword = () => {
    //   if (!confirmPassword) return null;

    //   return password === confirmPassword ? null : (
    //     <div className="warning">
    //       <small>Check your password again!</small>
    //     </div>
    //   );
    // };



    const handleLogin = () => {
        setLogIn(!logIn)
    }

    return (
        <>
            <div className='MainWrapper'>
                {
                    logIn ?
                        <div className='LoginContainer mx-auto'>
                            <div>
                                <div className='HeaderText'>
                                    <h3>Log In</h3>
                                </div>
                                <div>
                                    <button className='google-btn'>
                                        <FcGoogle size={24} style={{ marginRight: "8px" }} />
                                        Continue with Google
                                    </button>
                                </div>
                                <div>
                                    <button className=' facebook-btn'>
                                        <FaFacebook size={24} style={{ marginRight: "8px", color: "white", backgroundColor: "blue" }} />
                                        Continue with Face Book
                                    </button>
                                </div>
                                <div>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className='inputWrapper'>
                                            <input
                                                type="text"
                                                name="email"
                                                placeholder="E-mail Address"
                                                value={email}
                                                onChange={handleChange}
                                            />


                                        </div>
                                        <div className='inputWrapper'>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="eyeBtn"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <div>
                                            <button className='LoginButton'>
                                                Log In
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <small>
                                        <a href="">Forget Password?</a>
                                    </small>
                                </div>
                            </div>
                            <div>
                                <small>
                                    Don't Have an Account?
                                    <button onClick={handleLogin} className='LinkButton'>
                                        Sign Up
                                    </button>
                                </small>

                            </div>
                        </div>
                        :
                        <div className='LoginContainer mx-auto'>
                            <div>
                                <div className='HeaderText'>
                                    <h3>Sign Up</h3>
                                </div>
                                <div>
                                    <button className='google-btn'>
                                        <FcGoogle size={24} style={{ marginRight: "8px" }} />
                                        Continue with Google
                                    </button>
                                </div>
                                <div>
                                    <button className=' facebook-btn'>
                                        <FaFacebook size={24} style={{ marginRight: "8px", color: "white", backgroundColor: "blue" }} />
                                        Continue with Face Book
                                    </button>
                                </div>
                                <div>
                                    <form action="">
                                        <div className='inputWrapper'>
                                            <input
                                                type="text"
                                                name="email"
                                                placeholder="E-mail Address"
                                                value={email}
                                                onChange={handleChange}
                                            />

                                        </div>
                                        <div className='inputWrapper'>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="eyeBtn"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <div className='inputWrapper'>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="eyeBtn"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ?  <FaEye /> : <FaEyeSlash />}
                                            </button>
                                        </div>
                                        <div>
                                            <button className='LoginButton'>
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                            <div>

                            </div>

                            <div>
                                <small>
                                    Already Have an Account?
                                    <button onClick={handleLogin} className='LinkButton'>
                                        Log In
                                    </button>
                                </small>

                            </div>
                        </div>
                }
            </div>





        </>
    )
}

export default Auth
