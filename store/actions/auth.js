import AsyncStorage from "@react-native-async-storage/async-storage";

import { firebaseConfig } from "../../firebase/firebase";

import * as firebase from "../../firebase/firebase";
import * as userActions from "../actions/user";

export const AUTH = "AUTH";
export const WRITE_AUTH_TOKEN = "WRITE_AUTH_TOKEN";
export const LOGOUT = "LOGOUT";
// export const UPDATE_USER = "UPDATE_USER";
// export const SAVE_USER = "SAVE_USER";

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
		const tempTestData = {
			name: "Marcus",
			weight: 100,
			height: 190,
			profileImageURL:
				"https://images.unsplash.com/photo-1506207803951-1ee93d7256ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
		};

		try {
			const newUser = await firebase.signUpNewUserWithEmailAndPassword(
				email,
				password
			);
			console.log(newUser.stsTokenManager);
			const userID = newUser.uid;
			const userToken = newUser.stsTokenManager.accessToken;
			await firebase.writeDocumentToCollection(tempTestData, "users", userID);
			dispatch(auth(userID, userToken));
			await saveAuthDataToStorage(userToken, userID);

		} catch (e) {
			throw new Error(e);
		}

	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		try {
			const user = await firebase.loginWithEmailAndPassword(
				email,
				password
			);
			console.log(user.stsTokenManager);
			const userID = user.uid;
			const userToken = user.stsTokenManager.accessToken;

			const userDataFromServer = await firebase.getDocumentFromCollection(userID, "users");

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

export const saveUser = (user) => {
	return async (dispatch) => {
		let localSavedUserCreds = await AsyncStorage.getItem("userData");
		console.log(localSavedUserCreds);
		localSavedUserCreds = JSON.parse(localSavedUserCreds);


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
