import { 
initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getDatabase,
ref,
push,
get,
child,
remove

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";




const firebaseConfig = {


apiKey: "AIzaSyAstm5bEDdHWCKSVphs4cfddCT-SYNqjZA",

authDomain: "todabelastudio-ea3ac.firebaseapp.com",

databaseURL: "https://todabelastudio-ea3ac-default-rtdb.firebaseio.com",

projectId: "todabelastudio-ea3ac",

storageBucket: "todabelastudio-ea3ac.firebasestorage.app",

messagingSenderId: "289555596882",

appId: "1:289555596882:web:32519783d49afacb28c18b"


};






const app = initializeApp(firebaseConfig);





const db = getDatabase(app);






export {

db,

ref,

push,

get,

child,

remove

};
