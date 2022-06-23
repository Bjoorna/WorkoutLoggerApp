import { async } from "@firebase/util";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
	firebaseGetExercisesInWorkout,
	getUserWorkouts,
	millisFromTimestamp,
} from "../../firebase/firebase";

const initialState = {
	workouts: {},
	exercises: {},
};

export const getWorkoutByUserID = createAsyncThunk(
	"workout/getUserWorkouts",
	async (userID, thunkAPI) => {
		const workoutResponse = await getUserWorkouts(userID);
		// if (workoutResponse.size > 0) {
		//     console.log("more than one");
		//     workoutResponse.forEach(doc => {
		//         const data = doc.data();
		//         console.log(data);
		//     })
		// } else {
		// 	console.log("less than one");
		// }
		return workoutResponse;
	}
);

export const getExercisesInWorkout = createAsyncThunk(
	"workout/getExercisesInWorkout",
	async (requestPayload, thunkAPI) => {
		const { userID, exercises } = requestPayload;
		const exerciseRequest = await firebaseGetExercisesInWorkout(
			exercises,
			userID
		);
		return exerciseRequest;
	}
);

export const workoutSlice = createSlice({
	name: "workout",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Workouts
		builder.addCase(getWorkoutByUserID.fulfilled, (state, action) => {
			const snapshot = action.payload;
			snapshot.forEach((doc) => {
				const workoutID = doc.id;
				const workoutData = doc.data();
				const timeStampInMillis = workoutData.date.seconds * 1000;
				console.log(timeStampInMillis);
				workoutData.date = timeStampInMillis;
                workoutData.id = workoutID;
				state.workouts[workoutID] = workoutData;
			});
		});

		// Exercises
		builder.addCase(getExercisesInWorkout.fulfilled, (state, action) => {
			const eData = action.payload;
			eData.forEach((queryData) => {
				const exercise = queryData.data();
				console.log(exercise);
			});
		});
	},
});

export default workoutSlice.reducer;
