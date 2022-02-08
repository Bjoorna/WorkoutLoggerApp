export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUTS = "GET_WORKOUTS";

import Workout from "../../models/workout";
import * as firebase from "../../firebase/firebase";

export const addWorkout = (workout) => {
	return async (dispatch) => {
		try {
			const newWorkoutObject = {
				date: workout.date,
				complete: workout.complete,
				note: workout.note,
				owner: workout.owner,
			};
			const saveNewWorkout = await firebase.writeDocumentToCollection(
				workout,
				"workouts",
				"",
				false
			);
			dispatch({ type: ADD_WORKOUT, workout: workout });
		} catch (e) {
			throw new Error(e);
		}
	};
};

export const getWorkoutFilteredByExerciseType = (userID, exerciseArray) => {
	return async (dispatch) => {
		try {
			const workoutIDArray = [];
			const filteredExercises =
				await firebase.getExercisesFilteredByExerciseType(
					userID,
					exerciseArray
				);
			console.log("Exercises!?: ");
			// Not very elegant solution
			filteredExercises.forEach((doc) => {
				const id = doc.data().workoutID;
				if (workoutIDArray.includes(id)) {
					console.log("DUPLICATE ID");
				} else {
					workoutIDArray.push(id);
				}
			});
			const workoutDocs = await firebase.getWorkoutsBasedOnWorkoutIDs(
				workoutIDArray
			);
			const transformedWorkouts = [];
			workoutDocs.forEach((query) => {
				const workoutData = query.data();
				const newWorkout = new Workout(
					workoutData.exercises,
					workoutData.date,
					workoutData.complete,
					workoutData.note,
					workoutData.owner,
					query.id
				);
				transformedWorkouts.push(newWorkout);
			});
			dispatch({ type: GET_WORKOUTS, workouts: transformedWorkouts });
		} catch (error) {
			throw new Error(error);
		}
	};
};

export const getUserWorkouts = (userID) => {
	return async (dispatch) => {
		try {
			console.log("Getting Workouts...");
			const queryResult = await firebase.getUserWorkouts(userID);
			console.log("Workouts collected");
			const arrayOfWorkouts = [];
			queryResult.forEach((doc) => {
				const dataObject = doc.data();
				const newWorkout = new Workout(
					dataObject.exercises,
					dataObject.date,
					dataObject.complete,
					dataObject.note,
					dataObject.owner,
					doc.id
				);
				arrayOfWorkouts.push(newWorkout);
			});

			dispatch({ type: GET_WORKOUTS, workouts: arrayOfWorkouts });
		} catch (error) {
			throw new Error(error);
		}
	};
};
