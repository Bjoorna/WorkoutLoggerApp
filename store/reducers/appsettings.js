import {SET_HIDE_TABBAR, SET_USE_DARKMODE } from "../actions/appsettings";
const initialState = {
    hideTabBar: false,
    useDarkMode: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case SET_HIDE_TABBAR:
            console.log("APPSETTINGS REDUCER");
            return{...state, hideTabBar: action.value};
        case SET_USE_DARKMODE: 
            console.log("setUseDarkmode from reducer");
            return {...state, useDarkMode: action.value}
        default:
            return {...state};
    }
}