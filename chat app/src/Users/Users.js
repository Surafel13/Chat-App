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
