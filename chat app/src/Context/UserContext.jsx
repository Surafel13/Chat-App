import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateStatus = async (uid, status) => {
        if (!uid) return;
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                isOnline: status,
                lastSeen: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    useEffect(() => {
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (authInstance) => {
            if (authInstance) {
                // Initialize user with ONLY auth fields we care about (EXCLUDE photoURL from provider)
                const sanitizedAuthUser = {
                    uid: authInstance.uid,
                    email: authInstance.email,
                    emailVerified: authInstance.emailVerified,
                    displayName: authInstance.displayName // Fallback name
                };

                setUser(sanitizedAuthUser);
                setLoading(false);

                // Update online status
                updateStatus(authInstance.uid, true);

                // Listen to the Firestore document for real-time profile updates
                if (unsubscribeDoc) unsubscribeDoc();

                unsubscribeDoc = onSnapshot(doc(db, "users", authInstance.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        // Merge sanitized auth info with Firestore data
                        setUser(prev => ({
                            ...prev,
                            ...userData,
                            // Priority to Auth for core fields, but allow Firestore to override/augment
                            uid: authInstance.uid,
                            email: authInstance.email,
                            // Use status from Auth OR Firestore (in case Firestore is updated first)
                            emailVerified: authInstance.emailVerified || userData.isVerified
                        }));
                    }
                });
            } else {
                if (unsubscribeDoc) unsubscribeDoc();
                setUser(null);
                setLoading(false);
            }
        });

        const handleVisibilityChange = () => {
            if (auth.currentUser) {
                updateStatus(auth.currentUser.uid, document.visibilityState === 'visible');
            }
        };

        const handleUnload = () => {
            if (auth.currentUser) {
                updateStatus(auth.currentUser.uid, false);
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
