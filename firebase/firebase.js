import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
	collection,
	doc,
	setDoc,
	getFirestore,
	getDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

import * as firebaseConfig from "./config";

// export const firebaseConfig = {
//     apiKey: "AIzaSyAf6yOGx_V5wXyVUzot1sDgsICKPbDVgIs",
//     authDomain: "workoutlogger-48f71.firebaseapp.com",
//     databaseURL: "https://workoutlogger-48f71-default-rtdb.europe-west1.firebasedatabase.app/",
//     storageBucket: "gs://workoutlogger-48f71.appspot.com"
// };
const app = initializeApp(firebaseConfig.firebaseConfig);

const database = getFirestore(app);

export const writeDocumentToCollection = async (document, collection, optionalID) => {
    
    console.log("doc: " + document);
	// const id = "qvx7oSGJIXgzlyKIZhX11VstvEq2";
	// const userData = {
	// 	name: "Dennis",
	// 	weight: 100,
	// 	height: 190,
	// 	profileImageURL:
	// 		"https://images.unsplash.com/photo-1506207803951-1ee93d7256ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
	// };

	// try {
	// 	return await setDoc(doc(database, "users", id), userData);
	// } catch (e) {
	// 	console.log(e);
	// }
};

export const getDocumentFromCollection = async (docID, collectionName) => {
    console.log(docID, collectionName);
    const docRef = doc(database, collectionName, docID);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
        // console.log("Document Data: ");
        // console.log( docSnap.data());
		return docSnap.data();
    }else{
        console.log("No such document");
    }
}
