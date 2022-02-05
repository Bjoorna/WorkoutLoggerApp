import User from "../../models/User";
import { GET_USER_FROM_DB, SAVE_USER, UPDATE_USER } from "../actions/user";
const initialState = {
	user: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SAVE_USER:
			const userdata = action.user;
			console.log(userdata);
			const newUser = new User(
				userdata.name,
				userdata.dob,
				userdata.weight,
				userdata.height,
				userdata.useMetric,
				userdata.profileImageURL
			);
			return {...state, user: newUser };
		default:
			return {...state};
	}
};
