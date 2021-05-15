import "firebase/storage"
import firebase from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyDvvOtCL56SuYBoUFMyJgxqVGV5HUCRR5w",
  authDomain: "my-test-58887.firebaseapp.com",
  projectId: "my-test-58887",
  storageBucket: "my-test-58887.appspot.com",
  messagingSenderId: "856458784314",
  appId: "1:856458784314:web:5b0972a997936156454f03",
}

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig)
}
