const firebase = require('firebase')
const firebaseApp = firebase.initializeApp({
  databaseURL: "https://tride-431c6.firebaseio.com"
})
module.exports = firebaseApp.database()