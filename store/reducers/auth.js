import { AUTH, LOGOUT, SAVE_USER } from "../actions/auth";
const initialState = {
	token: null,
	userID: null,
	autoLoginState: false,
	userData: null,
	newUserCreation: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTH:
			return {
				token: action.token,
				userID: action.userID,
				autoLoginState: true,
			};
		case LOGOUT:
			return { ...initialState, autoLoginState: true };
		case SAVE_USER:
			return state;
		default:
			return state;
	}
};
