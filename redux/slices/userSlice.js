import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseGetUser, firebaseUpdateUserField } from "../../firebase/firebase";
import { setUseDarkMode } from "./appSettingsSlice";

export const getUserData = createAsyncThunk(
	"user/getUserData",
	async (_, thunkApi) => {
		let userID;
		if(_) {
			userID = _
		}else{
			userID = thunkApi.getState().auth.userID;
		}
		// const userID = thunkApi.getState().auth.userID;
		const userData = await firebaseGetUser(userID);
		if (userData) {
			console.log(userData);
			thunkApi.dispatch(setUseDarkMode(userData.useDarkMode));
			return userData;
		}
	}
);

export const updateUserField = createAsyncThunk(
	"user/updateUserField",
	async (updateData, thunkApi) => {
		try {
			const userID = thunkApi.getState().auth.userID;
			await firebaseUpdateUserField(userID, updateData);
			thunkApi.dispatch(getUserData());
		} catch (error) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

const initialState = {
	user: {},
	error: null
};
export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getUserData.fulfilled, (state, action) => {
			console.log("UserSlice getuserdata fulfilled");
			console.log(action.payload);
			state.user = action.payload;
		});

		builder.addCase(getUserData.rejected, (state, action) => {
			console.log("Get USer Rejected");
			console.log(state);
			console.log(action);
		});

		builder.addCase(updateUserField.fulfilled, (state,action) => {
			console.log("user updated successfully");
		});
		builder.addCase(updateUserField.rejected, (state, action) => {
			if(action.payload){
				console.log(action.payload);
				state.error = action.payload;
			}
		})
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
