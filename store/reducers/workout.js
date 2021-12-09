import { ADD_WORKOUT } from "../actions/workout";

const initalState = {
	workouts: [],
};

export default (state = initalState, action) => {
	switch (action.type) {
        case ADD_WORKOUT:
            console.log(action.workout);
            return {workouts: []}
		default:
			return state;
	}
};
