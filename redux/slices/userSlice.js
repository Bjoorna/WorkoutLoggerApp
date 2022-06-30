import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseGetUser } from "../../firebase/firebase";

export const getUserData = createAsyncThunk(
	"user/getUserData",
	async (userID, thunkApi) => {
		const userData = await firebaseGetUser(userID);
		if (userData) {
			console.log(userData);
			return userData;
		}
	}
);

const initialState = {
	user: {},
};
export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action)  {
			state.user = action.payload;
		}
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
	},
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;