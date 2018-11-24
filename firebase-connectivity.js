const firebase = require('firebase');
var config = {
    apiKey: process.env.JUNCTION2018FIREBASEAPIKEY,
    authDomain: "peakachu001.firebaseapp.com",
    databaseURL: "https://peakachu001.firebaseio.com",
    projectId: "peakachu001",
    storageBucket: "peakachu001.appspot.com",
    messagingSenderId: "155989702607"
  };
  
  firebase.initializeApp(config);

  module.exports = {
      firebase
  };