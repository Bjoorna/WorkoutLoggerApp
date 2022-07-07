import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import {
	firebaseCreateUserWithEmailAndPassword,
	firebaseInitSaveUserData,
	firebaseLoginWithEmailAndPassword,
	firebaseSignOutUser,
} from "../../firebase/firebase";
import { getUserData, resetUser } from "./userSlice";
import { resetWorkoutState } from "./workoutSlice";


const initialState = {
	fireBaseUser: null,
	token: null,
	userID: null,
	hasTriedAutoLogin: false,
	newUserCreation: false,
	error: null,
};

// thunks
export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (authCredentials, thunkAPI) => {
		try {
			const user = await firebaseLoginWithEmailAndPassword(
				authCredentials.email,
				authCredentials.password
			);

			const userID = user.uid;
			const token = await user.getIdToken();
			thunkAPI.dispatch(getUserData(userID));
			return { userID, token };
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const autoLogin = createAsyncThunk(
	"auth/autoLogin",
	async (user, thunkAPI) => {
		try {
			console.log("AutoLogin is called");
			thunkAPI.dispatch(getUserData(user.userID));
			return user;
		} catch (error) {}
	}
);

export const createUserWithEmailAndPassword = createAsyncThunk(
	"auth/createUserWithEmailAndPassword",
	async (authCredentials, thunkAPI) => {
		try {
			const createdUser = await firebaseCreateUserWithEmailAndPassword(
				authCredentials.email,
				authCredentials.password
			);
			const userID = createdUser.uid;
			const token = await createdUser.getIdToken();
			return { userID, token };
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const initalUserInfoSave = createAsyncThunk(
	"auth/initialUserInfoSave",
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

export const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (_, thunkAPI) => {
		try {
			await firebaseSignOutUser();
			thunkAPI.dispatch(resetWorkoutState());
			thunkAPI.dispatch(resetUser());
			return;
		} catch (error) {
			console.log("error on logout: SHOULD NOT HAPPEN");
		}
	}
);

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
			if (action.payload) {
				const user = action.payload;
				state.userID = user.userID;
				state.token = user.token;
			}
		});
		builder.addCase(loginUser.rejected, (state, action) => {
			if (action.payload) {
				state.error = action.payload;
			}
		});
		builder.addCase(logoutUser.fulfilled, (state, action) => {
			state.token = null;
			state.userID = null;
		});

		builder.addCase(
			createUserWithEmailAndPassword.fulfilled,
			(state, action) => {
				const user = action.payload;
				if (user) {
					state.userID = user.userID;
					state.newUserCreation = true;
					state.token = user.token;
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

		builder.addCase(autoLogin.fulfilled, (state, action) => {
			if (action.payload) {
				const user = action.payload;
				if (user) {
					state.userID = user.userID;
					state.token = user.token;
				}
			}
		});
	},
});

export const { clearErrorState } = authSlice.actions;

export default authSlice.reducer;
