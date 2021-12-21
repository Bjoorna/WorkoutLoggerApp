export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUTS = "GET_WORKOUTS";


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
