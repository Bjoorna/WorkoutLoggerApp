import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { async } from "validate.js";
import {
	firebaseCreateUserWithEmailAndPassword,
	firebaseInitSaveUserData,
	firebaseLoginWithEmailAndPassword,
} from "../../firebase/firebase";
import { getUserData } from "./userSlice";

const initialState = {
	token: null,
	userID: null,
	hasTriedAutoLogin: false,
	newUserCreation: false,
	error: null,
};

// thunks
export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (authCredentials, thunkAPI) => {
		console.log(authCredentials.email);
		console.log(authCredentials.password);

		const response = await firebaseLoginWithEmailAndPassword(
			authCredentials.email,
			authCredentials.password
		);
		const userID = response.uid;

		// we have logged in successfully, fetch userdata
		thunkAPI.dispatch(getUserData(userID));
		return response;
	}
);

export const createUserWithEmailAndPassword = createAsyncThunk(
	"user/createUserWithEmailAndPassword",
	async (authCredentials, thunkAPI) => {
		try {
			const createdUser = await firebaseCreateUserWithEmailAndPassword(
				authCredentials.email,
				authCredentials.password
			);
			const toJson = createdUser.toJSON();
			console.log("ToJSon: ", toJson);
			return createdUser;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const initalUserInfoSave = createAsyncThunk(
	"user/initialUserInfoSave",
	async ({userInfo}, thunkAPI) => {
		const userObject = {
			name: userInfo.name,
			birthday: userInfo.birthday,
			height: userInfo.height > 0 ? userInfo.height : null,
			weight: userInfo.weight > 0 ? userInfo.weight : null,
			useDarkMode: userInfo.useDarkMode,
			useMetric: userInfo.useMetric
		}
		try {
			const userID = thunkAPI.getState().auth.userID;
			console.log(userID);
			const userSave = await firebaseInitSaveUserData(userObject, userID);
			thunkAPI.dispatch(getUserData(userID));
			return userSave
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}

		// const savedUserData 
	}
);

export const DEVLoginAndCreateUser = createAsyncThunk(
	"user/devLoginAndCreateUser",
	async (authCredentials, thunkAPI) => {
		try {
			const user = await firebaseLoginWithEmailAndPassword(
				authCredentials.email,
				authCredentials.password
			);
			return user;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const logoutUser = createAction("auth/logoutUser");

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearErrorState(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loginUser.fulfilled, (state, action) => {
			console.log("Login Succeded");
			const user = action.payload;
			const userID = user.uid;
			const userToken = user.stsTokenManager.accessToken;
			// console.log(userToken);
			state.token = userToken;
			state.userID = userID;
			// setLocalAuthState({token: userToken, userID: userID})
		});
		builder.addCase(loginUser.rejected, (test) => {
			console.log("LoginUser REJECTED");
			console.log(test);
		});
		builder.addCase(logoutUser, (state, action) => {
			console.log(action);
			console.log(state);
			state.token = null;
			state.userID = null;
		});

		builder.addCase(
			createUserWithEmailAndPassword.fulfilled,
			(state, action) => {
				const user = action.payload;
				if (user) {
					state.userID = user.uid;
					const userToken = user.stsTokenManager.accessToken;
					state.newUserCreation = true;
					state.token = userToken;
				}
			}
		);
		builder.addCase(
			createUserWithEmailAndPassword.rejected,
			(state, action) => {
				console.log("Create new user Rejected");
				// console.log(action);
				if (action.payload) {
					console.log(action.payload);
					state.error = action.payload;
				}
			}
		);

		builder.addCase(initalUserInfoSave.fulfilled, (state,action) => {
			state.newUserCreation = false
		})

		builder.addCase(initalUserInfoSave.rejected, (state, action) => {
			if(action.payload){
				console.log(action.payload);
				state.error = action.payload;
			}
		})

		builder.addCase(DEVLoginAndCreateUser.fulfilled, (state, action) => {
			const user = action.payload;
			if (user) {
				state.userID = user.uid;
				const userToken = user.stsTokenManager.accessToken;
				state.token = userToken;
				state.newUserCreation = true;
			}
		});


	},
});

export const { clearErrorState } = authSlice.actions;

export default authSlice.reducer;
