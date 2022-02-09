import { ADD_WORKOUT, GET_WORKOUTS, GET_EXERCISES } from "../actions/workout";

const initalState = {
	workouts: [],
	exercises: []
};

export default (state = initalState, action) => {
	switch (action.type) {
        case ADD_WORKOUT:
            console.log(action.workout);
            return {workouts: []};
		case GET_WORKOUTS: 
			return {...state, workouts: action.workouts};
		case GET_EXERCISES:
			return {...state, exercises: action.exercises};

		default:
			return state;
	}
};
