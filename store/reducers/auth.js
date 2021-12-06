import { AUTH, LOGOUT, SAVE_USER } from "../actions/auth";
const initialState = {
	token: null,
	userID: null,
	autoLoginState: false,
	userData: null
};

export default (state = initialState, action) => {
	console.log(action);
	switch (action.type) {
		case AUTH:
			return {
				token: action.token,
				userID: action.userID,
				autoLoginState: true,
			};
		case LOGOUT:
			console.log("Hello from logout reducer");

			return { ...initialState, autoLoginState: true };
		case SAVE_USER:
			console.log("SAVE USER FROM REDUCER: ");
			return state;
		default:
			return state;
	}
};
