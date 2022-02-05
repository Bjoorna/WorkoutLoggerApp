import AsyncStorage from "@react-native-async-storage/async-storage";

import { firebaseConfig } from "../../firebase/firebase";

import * as firebase from "../../firebase/firebase";
import * as userActions from "../actions/user";

export const AUTH = "AUTH";
export const WRITE_AUTH_TOKEN = "WRITE_AUTH_TOKEN";
export const LOGOUT = "LOGOUT";
export const SIGNUP_USER = "SIGNUP_USER";
export const INIT_SAVE_USER = "INIT_SAVE_USER";
// export const UPDATE_USER = "UPDATE_USER";
// export const SAVE_USER = "SAVE_USER";

export const auth = (userID, token) => {
	return (dispatch) => {
		dispatch({ type: AUTH, token: token, userID: userID });
	};
};

export const initSaveUser = (userID, user) => {
	return async(dispatch) => {
		try {
			// save user
			await firebase.saveUserToCollection(user, userID);
			console.log("User Saved");
			// get user
			const savedUser = await firebase.getDocumentFromCollection(userID, "users");
			console.log(savedUser)
			dispatch(userActions.saveUser(savedUser));
			dispatch({type: INIT_SAVE_USER})

		} catch (error) {
			throw new Error(error);
		}
	}
}

export const createUser = (email, password) => {
	return async(dispatch) => {
		try{
			const createdUser = await firebase.signUpNewUserWithEmailAndPassword(email, password);
			const userID = createdUser.uid;
			const userToken = createdUser.stsTokenManager.accessToken
			dispatch({type: SIGNUP_USER, token: userToken, userID: userID});
			await saveAuthDataToStorage(userToken, userID);
		}catch(error){
			console.log(error);
			throw new Error(error)
		}
	}
}

export const login = (email, password) => {
	return async (dispatch) => {
		try {
			console.log("Logging in user...");
			const user = await firebase.loginWithEmailAndPassword(
				email,
				password
			);
			console.log("User logged in");
			const userID = user.uid;
			const userToken = user.stsTokenManager.accessToken;
			console.log("Getting userData from server");
			const userDataFromServer = await firebase.getDocumentFromCollection(userID, "users");
			console.log("User retrieved");
			dispatch(userActions.saveUser(userDataFromServer));

			dispatch(auth(userID, userToken));
			await saveAuthDataToStorage(userToken, userID);
		} catch (e) {
			throw new Error(e);
		}
	};
};


export const logout = () => {
	return { type: LOGOUT };
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
