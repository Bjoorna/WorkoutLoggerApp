import {SET_HIDE_TABBAR } from "../actions/appsettings";
const initialState = {
    hideTabBar: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case SET_HIDE_TABBAR:
            console.log("APPSETTINGS REDUCER");
            return{...state, hideTabBar: action.value};
        default:
            return {...state};
    }
}