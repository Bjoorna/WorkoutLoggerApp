export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUTS = "GET_WORKOUTS";
export const GET_EXERCISES = "GET_EXERCISES";
export const SET_EXERCISES_FROM_WORKOUT = "SET_EXERCISES_FROM_WORKOUT";
import Workout from "../../models/workout";
import * as firebase from "../../firebase/firebase";
import Exercise from "../../models/Exercise";

// export const addWorkout = (workout) => {
// 	return async (dispatch) => {
// 		try {
// 			const newWorkoutObject = {
// 				date: workout.date,
// 				complete: workout.complete,
// 				note: workout.note,
// 				owner: workout.owner,
// 			};
// 			const saveNewWorkout = await firebase.writeDocumentToCollection(
// 				workout,
// 				"workouts",
// 				"",
// 				false
// 			);
// 			dispatch({ type: ADD_WORKOUT, workout: workout });
// 		} catch (e) {
// 			throw new Error(e);
// 		}
// 	};
// };

// export const getWorkoutFilteredByExerciseType = (userID, exerciseArray) => {
// 	return async (dispatch) => {
// 		try {
// 			const workoutIDArray = [];
// 			const filteredExercises =
// 				await firebase.getExercisesFilteredByExerciseType(
// 					userID,
// 					exerciseArray
// 				);
// 			// Not very elegant solution
// 			filteredExercises.forEach((doc) => {
// 				const id = doc.data().workoutID;
// 				if (workoutIDArray.includes(id)) {
// 					console.log("DUPLICATE ID");
// 				} else {
// 					workoutIDArray.push(id);
// 				}
// 			});
// 			const workoutDocs = await firebase.getWorkoutsBasedOnWorkoutIDs(
// 				workoutIDArray
// 			);

// 			console.log(workoutDocs);
// 			const transformedWorkouts = [];
// 			workoutDocs.forEach((query) => {
// 				const workoutData = query.data();
// 				console.log(workoutData);
// 				const newWorkout = new Workout(
// 					workoutData.exercises,
// 					workoutData.date,
// 					workoutData.complete,
// 					workoutData.note,
// 					workoutData.owner,
// 					query.id
// 				);
// 				transformedWorkouts.push(newWorkout);
// 			});
// 			dispatch({ type: GET_WORKOUTS, workouts: transformedWorkouts });
// 		} catch (error) {
// 			throw new Error(error);
// 		}
// 	};
// };

// export const getExerciseByType = (userID, exercise) => {
// 	return async (dispatch) => {
// 		try {
// 			const exercisesQuery =
// 				await firebase.getExercisesFilteredByExerciseType(userID, [
// 					exercise,
// 				]);
// 			const exerciseArray = [];
// 			exercisesQuery.forEach((ex) => {
// 				const exerciseData = ex.data();
// 				const newExercise = new Exercise(
// 					exerciseData.exercise,
// 					exerciseData.weight,
// 					exerciseData.reps,
// 					exerciseData.sets,
// 					exerciseData.rpe,
// 					exerciseData.date,
// 					exerciseData.owner,
// 					exerciseData.workoutID,
// 					ex.id
// 				);
// 				exerciseArray.push(newExercise);
// 			});
// 			dispatch({type: GET_EXERCISES, exercises: exerciseArray});
// 		} catch (error) {
// 			console.log(error);
// 			throw new Error(error);
// 		}
// 	};
// };

// // export const setExercises = (exercises) => {
// // 	dispatch({type: SET_EXERCISES_FROM_WORKOUT, exercises: exercises});
// // }

// export const getUserWorkouts = (userID) => {
// 	return async (dispatch) => {
// 		try {
// 			console.log("Getting Workouts...");
// 			const queryResult = await firebase.getUserWorkouts(userID);
// 			console.log("Workouts collected");
// 			const arrayOfWorkouts = [];
// 			queryResult.forEach((doc) => {
// 				const dataObject = doc.data();
// 				const newWorkout = new Workout(
// 					dataObject.exercises,
// 					dataObject.date,
// 					dataObject.complete,
// 					dataObject.note,
// 					dataObject.owner,
// 					doc.id
// 				);
// 				arrayOfWorkouts.push(newWorkout);
// 			});

// 			dispatch({ type: GET_WORKOUTS, workouts: arrayOfWorkouts });
// 		} catch (error) {
// 			throw new Error(error);
// 		}
// 	};
// };
