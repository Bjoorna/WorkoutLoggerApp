import * as firebase from '../../firebase/firebase';

export const GET_USER_FROM_DB = "GET_USER_FROM_DB"

export const SAVE_USER ="SAVE_USER" 


export const saveUser = (user) => {
    return (dispatch) => {
        dispatch({type: SAVE_USER, user: user});
    }
}