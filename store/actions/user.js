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
            await firebase.updateUser(userID, user);
            console.log("Retrieving new UserData");
            const updatedUser = await firebase.getDocumentFromCollection(userID, "users");
            console.log("new User: ");
            console.log(updatedUser);
            dispatch({type: SAVE_USER, user: updatedUser});
        } catch (error) {
            throw new Error(error);
        }
    }
}