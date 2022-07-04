import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
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
		try {
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
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
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
	async ({ userInfo }, thunkAPI) => {
		const userObject = {
			name: userInfo.name,
			birthday: userInfo.birthday,
			height: userInfo.height > 0 ? userInfo.height : null,
			weight: userInfo.weight > 0 ? userInfo.weight : null,
			useDarkMode: userInfo.useDarkMode,
			useMetric: userInfo.useMetric,
		};
		try {
			const userID = thunkAPI.getState().auth.userID;
			console.log(userID);
			const userSave = await firebaseInitSaveUserData(userObject, userID);
			thunkAPI.dispatch(getUserData());
			return userSave;
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
			state.token = userToken;
			state.userID = userID;
		});
		builder.addCase(loginUser.rejected, (state, action) => {
			if (action.payload) {
				state.error = action.payload;
			}
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
				if (action.payload) {
					console.log(action.payload);
					state.error = action.payload;
				}
			}
		);

		builder.addCase(initalUserInfoSave.fulfilled, (state, action) => {
			state.newUserCreation = false;
		});

		builder.addCase(initalUserInfoSave.rejected, (state, action) => {
			if (action.payload) {
				console.log(action.payload);
				state.error = action.payload;
			}
		});
	},
});

export const { clearErrorState } = authSlice.actions;

export default authSlice.reducer;
