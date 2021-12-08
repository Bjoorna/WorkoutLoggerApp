import User from "../../models/User";
import { GET_USER_FROM_DB, SAVE_USER } from "../actions/user";
const initialState = {
	user: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SAVE_USER:
			console.log("Action.user: ");
			console.log(action.user);
			const userdata = action.user;
			const newUser = new User(
				userdata.name,
				userdata.age,
				userdata.weight,
				userdata.height,
				userdata.profileImageURL
			);
			return { user: newUser };
		default:
			return state;
	}
};
