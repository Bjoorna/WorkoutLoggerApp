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
				false,
			);

			console.log(saveNewWorkout.id);
			dispatch({ type: ADD_WORKOUT, workout: workout });
		} catch (e) {
			throw new Error(e);
		}
	};
};

// export const getUserWorkouts = (userID, dataBaseRef) => {
// 	return async (dispatch) => {
// 		try{
// 			console.log("Getting Workouts...");
// 			const serverWorkouts = await firebase.getUserWorkouts(userID);
// 			console.log("Workouts collected");

// 			const transformWorkouts = serverWorkouts.map(
// 				(serverWO) =>
// 					new Workout(
// 						serverWO.exercises,
// 						serverWO.date,
// 						serverWO.complete,
// 						serverWO.note,
// 						serverWO.owner
// 					)
// 			);
// 			dispatch({type: GET_WORKOUTS, workouts: transformWorkouts});
// 		}catch(e){

// 		}
// 	}

// }

export const getUserWorkouts = (userID, dataBaseRef) => {
	return async (dispatch) => {
		try{
			console.log("Getting Workouts...");
			const queryResult = await firebase.getUserWorkouts(userID);
			console.log("Workouts collected");
			const arrayOfWorkouts = [];
			queryResult.forEach(doc => {
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

			dispatch({type: GET_WORKOUTS, workouts: arrayOfWorkouts});
		}catch(e){

		}
	}

}