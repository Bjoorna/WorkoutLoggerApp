import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
	collection,
	doc,
	setDoc,
	getFirestore,
	getDoc,
	addDoc,
} from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useSelector } from "react-redux";

import * as firebaseConfig from "./config";

// APPSETUO
const app = initializeApp(firebaseConfig.firebaseConfig);

// FIRESTORE
const database = getFirestore(app);

export const writeDocumentToCollection = async (
	document,
	dbCollection,
	optionalID = "",
	shouldMerge = true
) => {
	console.log("doc: " + document);
	if (optionalID !== "") {
		try {
			const docRef = doc(database, dbCollection, optionalID);
			return await setDoc(docRef, document, { merge: shouldMerge });
		} catch (e) {
			console.log("From WriteDocumentToCOllection");
			console.log(e);
		}
	} else {
		try {
			return await addDoc(collection(database, dbCollection), document);
		} catch (e) {
			console.log("From WriteDocumentToCOllection, with no specified ID");
			console.log(e);
		}
	}
};

export const getDocumentFromCollection = async (docID, collectionName) => {
	console.log(docID, collectionName);
	const docRef = doc(database, collectionName, docID);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		// console.log("Document Data: ");
		// console.log( docSnap.data());
		return docSnap.data();
	} else {
		console.log("No such document");
	}
};

// AUTHENTICATION
const auth = getAuth();

export const signUpNewUserWithEmailAndPassword = async (email, password) => {
	try {
		const userCredentials = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredentials.user;
	} catch (error) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(error.message);
		// TODO, return better errorsmessages
		throw new Error(error);
	}
};

export const loginWithEmailAndPassword = async (email, password) => {
	try {
		const userCredentials = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredentials.user;
	} catch (e) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(error.message);
		// TODO, return better errorsmessages
		throw new Error(error);
	}
};
