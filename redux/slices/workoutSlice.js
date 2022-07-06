import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
	firebaseDeleteWorkout,
	firebaseGetExercisesInWorkout,
	firebaseSaveWorkout,
	firebaseGetUserWorkouts,
	firebaseGetExercisesByTypes,
} from "../../firebase/firebase";

const initialState = {
	workouts: {},
	exercises: {},
	filteredExercises: {}, // set exercises that the user has filtered by here
};

export const getWorkoutByUserID = createAsyncThunk(
	"workout/getUserWorkouts",
	async (userID, thunkAPI) => {
		const workoutResponse = await firebaseGetUserWorkouts(userID);
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

export const getExercisesByType = createAsyncThunk(
	"workout/getExercisesByType",
	async ({ exerciseTypes, userID }, thunkAPI) => {
		console.log(exerciseTypes);
		const exercisesResponse = await firebaseGetExercisesByTypes(
			exerciseTypes,
			userID
		);
		if (exercisesResponse != null) {
			return exercisesResponse;
		} else {
			return null;
		}
	}
);

export const getWorkoutsFilteredByExerciseType = createAsyncThunk(
	"workout/getWorkoutsFilteredByExerciseType",
	async (payload, thunkAPI) => {}
);

export const workoutSlice = createSlice({
	name: "workout",
	initialState,
	reducers: {
		resetFilteredExercises: (state) => (state.filteredExercises = {}),
		resetWorkoutState: (state) => {
			state.exercises = {};
			state.filteredExercises = {};
			state.workouts = {};
		},
	},
	extraReducers: (builder) => {
		// Workouts
		builder.addCase(getWorkoutByUserID.fulfilled, (state, action) => {
			const snapshot = action.payload;
			snapshot.forEach((doc) => {
				const workoutID = doc.id;
				const workoutData = doc.data();
				const timeStampInMillis = workoutData.date.seconds * 1000;
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
		});

		builder.addCase(deleteWorkout.fulfilled, (state, action) => {
			const deletedWorkoutID = action.payload;
			const exerciseIDsToDelete =
				state.workouts[deletedWorkoutID].exercises;
			for (let exerciseID of exerciseIDsToDelete) {
				delete state.exercises[exerciseID];
			}

			delete state.workouts[deletedWorkoutID];
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

		builder.addCase(getExercisesByType.pending, (state) => {
			state.filteredExercises = {};
		});

		builder.addCase(getExercisesByType.fulfilled, (state, action) => {
			const snapshot = action.payload;
			if (snapshot === null) {
				state.filteredExercises = {};
			} else {
				snapshot.forEach((doc) => {
					const exercise = doc.data();
					console.log("exercise");
					exercise.date = exercise.date.seconds * 1000;
					exercise.id = doc.id;
					console.log(exercise);
					state.filteredExercises[exercise.id] = exercise;
				});
			}
		});
	},
});

export const { resetFilteredExercises, resetWorkoutState } = workoutSlice.actions;

export default workoutSlice.reducer;
