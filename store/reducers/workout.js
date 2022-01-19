import { ADD_WORKOUT, GET_WORKOUTS } from "../actions/workout";

const initalState = {
	workouts: [],
};

export default (state = initalState, action) => {
	switch (action.type) {
        case ADD_WORKOUT:
            console.log(action.workout);
            return {workouts: []};
		case GET_WORKOUTS: 
			return {workouts: action.workouts};
		default:
			return state;
	}
};
