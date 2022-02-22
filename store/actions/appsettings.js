
export const SET_HIDE_TABBAR = "SET_HIDE_TABBAR";
export const SET_USE_DARKMODE = "SET_USE_DARKMODE"

export const toggleTabBar = (currentValue) => {
    const nextValue = !currentValue;
    console.log("APPSETTINGS ACTION");
    dispatch({type: SET_HIDE_TABBAR, value: nextValue});
}