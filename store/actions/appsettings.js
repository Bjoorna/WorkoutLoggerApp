
export const SET_TAB_BAR_VALUE = "SET_TAB_BAR_VALUE";
export const SET_USE_DARKMODE = "SET_USE_DARKMODE"

export const toggleTabBar = (value) => {
    const nextValue = !currentValue;
    console.log("APPSETTINGS ACTION");
    dispatch({type: SET_TAB_BAR_VALUE, value: value});
}