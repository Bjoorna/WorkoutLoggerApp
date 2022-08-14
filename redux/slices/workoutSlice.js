import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import {
	firebaseDeleteWorkout,
	firebaseGetExercisesInWorkout,
	firebaseSaveWorkout,
	firebaseGetUserWorkouts,
	firebaseGetExercisesByTypes,
	firebaseGetExerciseTypes,
	firebaseUpdateWorkout,
	firebaseGetWorkoutByID,
	firebaseGetWorkoutsBasedOnWorkoutIDs,
	firebaseFilterWorkoutOnDates,
} from "../../firebase/firebase";

const initialState = {
	workouts: {},
	exercises: {},
	filteredExercises: {}, // set exercises that the user has filtered by here
	filteredWorkouts: {},
	exerciseTypes: {},
	useFilter: false,
	currentFilterState: {},
};

export const getExerciseTypes = createAsyncThunk(
	"appSettings/getExerciseTypes",
	async (_, thunkAPI) => {
		try {
			const exerciseData = await firebaseGetExerciseTypes();
			return exerciseData;
		} catch (error) {
			console.log(error);
		}
	}
);

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
		try {
			const exercisesResponse = await firebaseGetExercisesByTypes(
				exerciseTypes,
				userID
			);
			if (exercisesResponse != null) {
				return exercisesResponse;
			} else {
				return null;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const getExercisesByTypeForList = createAsyncThunk(
	"workout/getExercisesByType",
	async ({ exerciseTypes, userID }, thunkAPI) => {
		try {
			const exercisesResponse = await firebaseGetExercisesByTypes(
				exerciseTypes,
				userID
			);
			if (exercisesResponse != null) {
				const workoutIDs = [];
				exercisesResponse.forEach((doc) => {
					const exercise = doc.data();
					workoutIDs.push(exercise.workoutID);
				});
				thunkAPI.dispatch(
					getWorkoutsFilteredByExerciseType(workoutIDs)
				);
				return exercisesResponse;
			} else {
				return null;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const getWorkoutsFilteredByExerciseType = createAsyncThunk(
	"workout/getWorkoutsFilteredByExerciseType",
	async (workoutIDs, thunkAPI) => {
		try {
			const workouts = await firebaseGetWorkoutsBasedOnWorkoutIDs(
				workoutIDs
			);
			return workouts;
		} catch (error) {
			console.log(error);
		}
	}
);

export const updateWorkoutField = createAsyncThunk(
	"workout/updateWorkoutField",
	async (payload, thunkAPI) => {
		try {
			console.log("UpdateWorkoutField");
			await firebaseUpdateWorkout(payload.workoutID, payload.field);
			thunkAPI.dispatch(getWorkoutByWorkoutID(payload.workoutID));
		} catch (error) {
			console.log(error);
		}
	}
);

export const getWorkoutByWorkoutID = createAsyncThunk(
	"workout/getWorkoutByWorkoutID",
	async (workoutID, thunkAPI) => {
		try {
			const workout = await firebaseGetWorkoutByID(workoutID);
			return workout;
		} catch (error) {}
	}
);

export const getWorkoutsBasedOnDateInterval = createAsyncThunk(
	"workout/getWorkoutsBasedOnDateInterval",
	async (datePayload, thunkAPI) => {
		try {
			const userID = thunkAPI.getState().auth.userID;
			const workouts = await firebaseFilterWorkoutOnDates(
				userID,
				datePayload.from,
				datePayload.to
			);
			return workouts;
		} catch (error) {
			console.log("Error workoutslice");
		}
	}
);

export const workoutSlice = createSlice({
	name: "workout",
	initialState,
	reducers: {
		resetFilteredExercises: (state) => (state.filteredExercises = {}),
		resetFilteredWorkouts: (state) => (state.filteredWorkouts = {}),

		resetWorkoutState: (state) => {
			state.exercises = {};
			state.filteredExercises = {};
			state.workouts = {};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getWorkoutByWorkoutID.fulfilled, (state, action) => {
			const workout = action.payload;
			const workoutID = workout.id;
			workout.date = workout.date.seconds * 1000;
			state.workouts[workoutID] = workout;
		});

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

		builder.addCase(getExerciseTypes.fulfilled, (state, action) => {
			if (action.payload) {
				state.exerciseTypes = action.payload;
			}
		});

		builder.addCase(
			getWorkoutsFilteredByExerciseType.fulfilled,
			(state, action) => {
				console.log("BUILDER");
				if (action.payload) {
					const workouts = action.payload;
					workouts.forEach((doc) => {
						console.log(doc.data());
						const workoutID = doc.id;
						const workoutData = doc.data();
						if (workoutData !== undefined) {
							const timeStampInMillis =
								workoutData.date.seconds * 1000;
							workoutData.date = timeStampInMillis;
							workoutData.id = workoutID;
							state.filteredWorkouts[workoutID] = workoutData;
						}
					});
				}
			}
		);

		builder.addCase(
			getWorkoutsBasedOnDateInterval.fulfilled,
			(state, action) => {
				if (action.payload) {
					const workouts = action.payload;
					workouts.forEach((doc) => {
						const workoutID = doc.id;
						const workoutData = doc.data();
						if (workoutData !== undefined) {
							const timeStampInMillis =
								workoutData.date.seconds * 1000;
							workoutData.date = timeStampInMillis;
							workoutData.id = workoutID;
							state.filteredWorkouts[workoutID] = workoutData;
						}
					});
				}
			}
		);
	},
});

export const { resetFilteredExercises, resetWorkoutState } =
	workoutSlice.actions;

export default workoutSlice.reducer;
