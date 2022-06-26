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
			state.useDarkMode = action.payload;
		},
		setHideTabBar: (state, action) => {
			state.hideTabBar = action.payload;
		}
	},
});

export const { setUseDarkMode, setHideTabBar } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
