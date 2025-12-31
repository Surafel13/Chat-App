import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "../../Context/UserContext";
import "./Auth.css";
import { auth } from "../../firebase";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Auth() {
    const navigate = useNavigate();

    const [logIn, setLogIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { user, setUser } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };


    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save user to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastSeen: new Date(),
                isVerified: true
            }, { merge: true });

            setUser(user);
            navigate("/Messaging");
        } catch (error) {
            alert(error.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!logIn) {
            // SIGN UP
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save user to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: email.split('@')[0], // Default display name
                    createdAt: new Date(),
                    isVerified: false
                });

                await sendEmailVerification(user);

                setUser(user);
                navigate("/verification");
            } catch (err) {
                alert(err.message);
            }
        } else {
            // LOGIN
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setUser(userCredential.user);
                navigate("/Messaging");
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <>
            <div className="MainWrapper">
                {logIn ? (
                    <div className="LoginContainer mx-auto">
                        <div>
                            <div className="HeaderText">
                                <h3>Log In</h3>
                            </div>

                            <button className="google-btn" onClick={handleGoogle}>
                                <FcGoogle size={24} style={{ marginRight: "8px" }} />
                                Continue with Google
                            </button>

                            <button className="facebook-btn">
                                <FaFacebook size={24} style={{ marginRight: "8px" }} />
                                Continue with Facebook
                            </button>

                            <form onSubmit={handleSubmit}>
                                <div className="inputWrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="E-mail Address"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="inputWrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eyeBtn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                <button
                                    className={email && password ? "LoginButtonFocus" : "LoginButton"}
                                    type="submit"
                                >
                                    Log In
                                </button>
                            </form>

                            <small>
                                <a href="">Forget Password?</a>
                            </small>
                        </div>

                        <small>
                            Don't Have an Account?
                            <button onClick={() => setLogIn(false)} className="LinkButton">
                                Sign Up
                            </button>
                        </small>
                    </div>
                ) : (
                    // -------------------------
                    // SIGNUP FORM
                    // -------------------------
                    <div className="LoginContainer mx-auto">
                        <div>
                            <div className="HeaderText">
                                <h3>Sign Up</h3>
                            </div>

                            <button className="google-btn" onClick={handleGoogle}>
                                <FcGoogle size={24} style={{ marginRight: "8px" }} />
                                Continue with Google
                            </button>

                            <button className="facebook-btn">
                                <FaFacebook size={24} style={{ marginRight: "8px" }} />
                                Continue with Facebook
                            </button>

                            <form onSubmit={handleSubmit}>
                                <div className="inputWrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="E-mail Address"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="inputWrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eyeBtn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                <div className="inputWrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eyeBtn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                <button
                                    className={
                                        email && password && confirmPassword
                                            ? "LoginButtonFocus"
                                            : "LoginButton"
                                    }
                                    type="submit"
                                >
                                    Sign Up
                                </button>
                            </form>
                        </div>

                        <small>
                            Already Have an Account?
                            <button onClick={() => setLogIn(true)} className="LinkButton">
                                Log In
                            </button>
                        </small>
                    </div>
                )}
            </div>
        </>
    );
}

export default Auth;
