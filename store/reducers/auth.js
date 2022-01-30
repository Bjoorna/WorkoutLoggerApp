import { AUTH, LOGOUT, INIT_SAVE_USER, SIGNUP_USER } from "../actions/auth";
const initialState = {
	token: null,
	userID: null,
	autoLoginState: false,
	newUserCreation: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTH:
			return {
				...state,
				token: action.token,
				userID: action.userID,
				autoLoginState: true,
			};
		case LOGOUT:
			return { ...initialState, autoLoginState: true };
		case INIT_SAVE_USER:
			return { ...state, newUserCreation: false, autoLoginState: true };
		case SIGNUP_USER:
			return {
				...state,
				token: action.token,
				userID: action.userID,
				newUserCreation: true,
			};

		default:
			return { ...state };
	}
};
