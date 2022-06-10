import {
	SET_IS_SCROLLING,
	SET_MONDAY_FIRSTDAY,
	SET_TAB_BAR_VALUE,
	SET_USE_DARKMODE,
} from "../actions/appsettings";
const initialState = {
	hideTabBar: false,
	useDarkMode: true,
	isScrolling: false,
	isMondayFirstDay: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_TAB_BAR_VALUE:
			return { ...state, hideTabBar: action.value };
		case SET_USE_DARKMODE:
			console.log("setUseDarkmode from reducer");
			return { ...state, useDarkMode: action.value };
		case SET_IS_SCROLLING:
			return { ...state, isScrolling: action.value };
		case SET_MONDAY_FIRSTDAY:
            console.log("Reduser monday");
			return { ...state, isMondayFirstDay: action.value };
		default:
			return { ...state };
	}
};
