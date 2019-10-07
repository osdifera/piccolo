const express = require('express');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

//Whenever you point to a path without specifying the file name,
//node will look for index.js
const keys = require('../config');

//We need to declare an empty user to store the user once it is returned
let user = {};

//let's declare the strategy
passport.use(new googleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
        //TODO: Investigate why they are storing user
        user = {...profile};
        return cb(null, profile);
    }
));

//Serialize user to session
passport.serializeUser((user, cb) => {
    cb(null, user);
});

//Deserialize user from session
passport.deserializeUser((user, cb) => {
    cb(null, user);
});

//Server declaration
const app = express();
app.use(cors());
app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//after the request we need to get the callback
app.get('/auth/google/callback', passport.authenticate('google'),
            (req, res) => {
                res.redirect('/profile');
            });

app.get("/user", (req, res) => {
    console.log("getting user data!");
    res.send(user);
});

const PORT = 5000;
app.listen(PORT);