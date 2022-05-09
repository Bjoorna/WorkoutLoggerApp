import { contains } from "@firebase/util";
import {
	ADD_WORKOUT,
	GET_WORKOUTS,
	GET_EXERCISES,
	SET_EXERCISES_FROM_WORKOUT,
} from "../actions/workout";

const initalState = {
	workouts: [],
	exercisesFilterArray: [],
	exercisesObject: {}
};

export default (state = initalState, action) => {
	switch (action.type) {
		case ADD_WORKOUT:
			console.log(action.workout);
			return { workouts: [] };
		case GET_WORKOUTS:
			return { ...state, workouts: action.workouts };
		case GET_EXERCISES:
			return { ...state, exercisesFilterArray: action.exercises };
		case SET_EXERCISES_FROM_WORKOUT:
			const newExercisesObject = { ...state.exercisesObject };
			const exerciseKeys = Object.keys(newExercisesObject);
			for (let exercise of action.exercises) {
				// console.log(exercise.id);
				if (!exerciseKeys.includes(exercise.id)) {
					newExercisesObject[exercise.id] = exercise;
				} else {
					console.log(exercise.id + " already in map");
				}
			}
			return { ...state, exercisesObject: newExercisesObject };
		default:
			return state;
	}
};
