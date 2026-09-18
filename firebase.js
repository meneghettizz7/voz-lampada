import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
getDatabase,
ref,
set,
onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQT_UvUGzPpZPossXvmrimqnGxkx2CQ3o",
    authDomain: "lampada-6262d.firebaseapp.com",
    projectId: "lampada-6262d",
    storageBucket: "lampada-6262d.firebasestorage.app",
    messagingSenderId: "664511432425",
    appId: "1:664511432425:web:17d3336c72083600c35278",
    measurementId: "G-6KZ6KQSMWB",
};

const app =
initializeApp(firebaseConfig);

const database =
getDatabase(app);

const luzRef =
ref(
database,
"casa/luz/ligada"
);

export {
database,
luzRef,
set,
onValue
};
