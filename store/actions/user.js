import { async } from '@firebase/util';
import * as firebase from '../../firebase/firebase';

export const GET_USER_FROM_DB = "GET_USER_FROM_DB"
export const UPDATE_USER ="UPDATE_USER";

export const SAVE_USER ="SAVE_USER" 


export const saveUser = (user) => {
    return (dispatch) => {
        dispatch({type: SAVE_USER, user: user});
    }
}


export const updateUser = (userID, user) => {
    return async (dispatch) => {
        try {
            console.log("updateing user from UserActions");
            await firebase.updateUser(userID, user);
            const updatedUser = await firebase.getDocumentFromCollection(userID, "users");
            console.log("new User: ");
            console.log(updatedUser);
            dispatch({type: SAVE_USER, user: updatedUser});
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const updateUserField = (userID, updatedField) => {
    return async(dispatch) => {
        try {
            console.log("UpdateUserField ACTIONS");
            await firebase.updateUserField(userID, updatedField);
            const updatedUser = await firebase.getDocumentFromCollection(userID, "users");
            dispatch({type: SAVE_USER, user: updatedUser});
        } catch (error) {
            throw new Error(error);
        }
    }
}