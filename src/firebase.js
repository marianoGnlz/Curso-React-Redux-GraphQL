import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyD4D2BX5tVQpZOPjL3JZuEO2cIOpdQM6NU",
    authDomain: "redux-curso-910d1.firebaseapp.com",
    databaseURL: "https://redux-curso-910d1.firebaseio.com",
    projectId: "redux-curso-910d1",
    storageBucket: "redux-curso-910d1.appspot.com",
    messagingSenderId: "1010500999632",
    appId: "1:1010500999632:web:eac45955c32ad6a92941d5",
    measurementId: "G-QFVW07ZJ24"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore().collection('favs')

export const getFavs = (uid) => {
    return db.doc(uid).get()
        .then( snap => {
            return snap.data().array
        })
}


export const updateDB = (array, uid) => {
    return db.doc(uid).set({array})
}


export function loginWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
            .then(snap => snap.user)
}

export const signOutGoogle = () => firebase.auth().signOut();
