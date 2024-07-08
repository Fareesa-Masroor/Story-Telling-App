 

 import firebase from "firebase"





const firebaseConfig = {
  apiKey: "AIzaSyANhPgi1CCCuf_WIZov0y3kOgGdnysPYOU",
  authDomain: "story-telling-2-fa6e6.firebaseapp.com",
  databaseURL: "https://story-telling-2-fa6e6-default-rtdb.firebaseio.com",
  projectId: "story-telling-2-fa6e6",
  storageBucket: "story-telling-2-fa6e6.appspot.com",
  messagingSenderId: "630707175793",
  appId: "1:630707175793:web:862ee1218b0ee7968576d0"
};




if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
   firebase.app(); // if already initialized, use that one
}
export default firebase.firestore()