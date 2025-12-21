import { collection, getDocs } from "firebase/firestore";
import { db } from "../../functions/Config/firebase";

export const getUsers = async () => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return userList;
}

export const getUser = async (uid) => {
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}
