import firebase from "firebase";
import { USER_POND_STATE_CHANGE, USER_STATE_CHANGE, USER_NOTIFICATION_STATE_CHANGE, USER_HISTORY_STATE_CHANGE } from "./constants";

export const fetchUser = () => {
    return (dispatch => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("users")
            .child(uid)
            .on("value", (snapshot) => {
                dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.val() })
                // console.log(snapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    })
}

export const fetchPonds = () => {
    return (dispatch => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("ponds")
            .child(uid)
            .on("value", (snapshot) => {
                dispatch({ type: USER_POND_STATE_CHANGE, ponds: snapshot.val() })
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    })
}

export const fetchNotification = () => {
    return (dispatch => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("notification")
            .child(uid)
            .orderByChild("date")
            .on("value", (snapshot) => {
                dispatch({ type: USER_NOTIFICATION_STATE_CHANGE, notification: snapshot.val() })
                console.log(snapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    })
}

export const fetchFluctuation = () => {
    return (dispatch => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("fluctuation")
            .child(uid)
            .orderByValue()
            .on("value", (snapshot) => {
                dispatch({ type: USER_HISTORY_STATE_CHANGE, fluctuation: snapshot.val() })
                // console.log(childSnapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    })
}