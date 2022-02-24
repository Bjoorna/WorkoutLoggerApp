import {SET_TAB_BAR_VALUE, SET_USE_DARKMODE } from "../actions/appsettings";
const initialState = {
    hideTabBar: false,
    useDarkMode: true
};

export default (state = initialState, action) => {
    switch (action.type){
        case SET_TAB_BAR_VALUE:
            return{...state, hideTabBar: action.value};
        case SET_USE_DARKMODE: 
            console.log("setUseDarkmode from reducer");
            return {...state, useDarkMode: action.value}
        default:
            return {...state};
    }
}