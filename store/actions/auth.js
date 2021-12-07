import AsyncStorage from "@react-native-async-storage/async-storage";

import { firebaseConfig } from "../../firebase/firebase";

import * as firebase from '../../firebase/firebase';
import * as userActions from '../actions/user'

export const AUTH = "AUTH";
export const WRITE_AUTH_TOKEN = "WRITE_AUTH_TOKEN";
export const LOGOUT = "LOGOUT";
// export const UPDATE_USER = "UPDATE_USER";
// export const SAVE_USER = "SAVE_USER";

const apikey = "AIzaSyAf6yOGx_V5wXyVUzot1sDgsICKPbDVgIs";

export const auth = (userID, token) => {
	return (dispatch) => {
		dispatch({ type: AUTH, token: token, userID: userID });
	};
};

export const savedUser = (userData) => {
	return (dispatch) => {
		dispatch({ type: SAVE_USER, userData: userData });
	};
};

export const signup = (email, password) => {
	return async (dispatch) => {

		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apikey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error("Error");
		}
		const resData = await response.json();
		dispatch(auth(resData.localId, resData.idToken));
	};
};

export const login = (email, password) => {
	return async (dispatch) => {

		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apikey}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData);
		}

		const resData = await response.json();
		const userID = resData.localId;
		const userData = await firebase.getDocumentFromCollection(userID, "users");
		dispatch(userActions.saveUser(userData));
		

		dispatch(auth(resData.localId, resData.idToken));
		await saveAuthDataToStorage(resData.idToken, resData.localId);
	};
};

export const logout = () => {
	return { type: LOGOUT };
};

export const saveUser = (user) => {
	return async (dispatch) => {

		let localSavedUserCreds = await AsyncStorage.getItem("userData");
		console.log(localSavedUserCreds);
		localSavedUserCreds = JSON.parse(localSavedUserCreds);

		// const databaseURLWithAuth =
		// 	firebaseConfig.databaseURL +
		// 	"users/" +
		// 	localSavedUserCreds.userID +
		// 	`.json?auth=${localSavedUserCreds.token}`;

		const databaseURLWithAuth =
			firebaseConfig.databaseURL +
			"users/" +
			localSavedUserCreds.userID +
			`.json?auth=${localSavedUserCreds.token}`;
		console.log(localSavedUserCreds);
		const userID = localSavedUserCreds.userID;
		console.log("USERID: " + userID);
		const userPackage = JSON.stringify({
			userID: {
				name: user.name,
				age: user.age + 30,
				weight: user.weight,
				height: user.weight,
				profileImageURI: user.profileImageURI,
			},
		});

		console.log(userPackage);

		console.log(databaseURLWithAuth);
		const response = await fetch(databaseURLWithAuth, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: user.name,
				age: user.age,
				weight: user.weight,
				height: user.weight,
				profileImageURI: user.profileImageURI,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log(errorData);
			throw new Error("Error");
		}
		const resData = await response.json();
		console.log(resData);
		// // dispatch(savedUser())
		return { type: SAVE_USER };
	};
};

const saveAuthDataToStorage = async (token, userID) => {
	try {
		await AsyncStorage.setItem(
			"userData",
			JSON.stringify({ token: token, userID: userID })
		);
	} catch (e) {
		console.log(e);
	}
};
