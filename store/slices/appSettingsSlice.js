import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	hideTabBar: false,
	useDarkMode: true,
	isScrolling: false,
};

export const appSettingsSlice = createSlice({
	name: "appSettings",
	initialState,
	reducers: {
		setUseDarkMode: (state, action) => {
			console.log(state);
			console.log(action);
			state.useDarkMode = action.payload;
		},
	},
});

export const { setUseDarkMode } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
