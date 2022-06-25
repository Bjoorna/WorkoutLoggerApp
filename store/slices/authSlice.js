import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginWithEmailAndPassword } from "../../firebase/firebase";
import { getUserData } from "./userSlice";

const initialState = {
	token: null,
	userID: null,
	hasTriedAutoLogin: false,
	newUserCreation: false,
};

// thunks 
export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (authCredentials, thunkAPI) => {
		console.log(authCredentials.email);
		console.log(authCredentials.password);

		const response = await loginWithEmailAndPassword(authCredentials.email, authCredentials.password);
		const userID = response.uid;

		// we have logged in successfully, fetch userdata
		thunkAPI.dispatch(getUserData(userID));
		return response;
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// setLocalAuthState: (state, action) => {
		// 	console.log("authSlice: ");
		// 	console.log(action);
		// 	(state.token = action.token),
		// 		(state.userID = action.userID),
		// 		(state.hasTriedAutoLogin = true);
		// },
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

	},
});

export const { setLocalAuthState } = authSlice.actions;

export default authSlice.reducer;
