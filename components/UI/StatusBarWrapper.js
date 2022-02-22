import React from "react";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

const StatusBarWrapper = props => {
    const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

    return <StatusBar style={useDarkMode ? "light": "dark"} />
};

export default StatusBarWrapper;