import {
	configureStore,
	combineReducers,
	getDefaultMiddleware,
} from "@reduxjs/toolkit";
import appSettingsSlice from "../slices/appSettingsSlice";
import authSlice from "../slices/authSlice";
import userSlice from "../slices/userSlice";
import workoutSlice from "../slices/workoutSlice";

const reducer = combineReducers({
	auth: authSlice.reducer,
	appSettings: appSettingsSlice.reducer,
	workout: workoutSlice.reducer,
	user: userSlice.reducer,
});

const store = configureStore({
	reducer: reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

export default store;