import { async } from "@firebase/util";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
	firebaseDeleteWorkout,
	firebaseGetExercisesInWorkout,
	firebaseGetWorkoutByID,
	firebaseSaveWorkout,
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

/**
 * takes an object with fields userID: string, and exerciseIDs: string[]
 */
export const getExercisesInWorkout = createAsyncThunk(
	"workout/getExercisesInWorkout",
	async (requestPayload, thunkAPI) => {
		const { userID, exerciseIDs } = requestPayload;
		// thunkAPI.getState();

		const exerciseRequest = await firebaseGetExercisesInWorkout(
			exerciseIDs,
			userID
		);
		return exerciseRequest;
	}
);

/**
 * workoutPayload = {workout: workout, userID: string}
 */
export const saveWorkout = createAsyncThunk(
	"workout/saveWorkout",
	async (workoutPayload, thunkAPI) => {
		const { workout, userID } = workoutPayload;
		const newWorkoutID = await firebaseSaveWorkout(workout, userID);
		return newWorkoutID;
	}
);

export const deleteWorkout = createAsyncThunk(
	"workout/deleteWorkout",
	async (workoutToDelete, thunkAPI) => {
		await firebaseDeleteWorkout(workoutToDelete);
		return workoutToDelete.id;
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

		// TODO add getworkout that is saved
		builder.addCase(saveWorkout.fulfilled, (state, action) => {
			const newWorkoutID = action.payload;
			console.log("Save workout fullfiled");
			console.log(newWorkoutID);
			// const newlySavedWorkout = await firebaseGetWorkoutByID(newWorkoutID);
			// if(newlySavedWorkout){
			// 	state.workouts[newWorkoutID] = newlySavedWorkout;
			// }
			// console.log(action);
		});

		builder.addCase(deleteWorkout.fulfilled, (state, action) => {
			// console.log("State");
			// console.log(state);
			// console.log(action);
			const deletedWorkoutID = action.payload;
			const exerciseIDsToDelete =
				state.workouts[deletedWorkoutID].exercises;
			for (let exerciseID of exerciseIDsToDelete) {
				delete state.exercises[exerciseID];
			}
			console.log("before");

			// console.log(state.workouts);
			const testDelete = delete state.workouts[deletedWorkoutID];
			if (testDelete) {
				console.log("Deleted from store");
				console.log("after");
				// console.log(state.workouts);
			} else {
				console.log("Not from store");
			}
		});

		// Exercises
		builder.addCase(getExercisesInWorkout.fulfilled, (state, action) => {
			const eData = action.payload;
			eData.forEach((doc) => {
				const exercise = doc.data();
				const exerciseID = doc.id;
				exercise.date = exercise.date.seconds * 1000;
				exercise.id = doc.id;
				state.exercises[exerciseID] = exercise;
			});
		});
	},
});

export default workoutSlice.reducer;
