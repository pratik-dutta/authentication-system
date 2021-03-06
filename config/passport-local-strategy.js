/*****************IMPORTING FILES*******************************/
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

/****************SETTING FILES FOR PASSPORT***********************/
//authentication using passport
passport.use(new LocalStrategy({
    usernameField : "email",
    passReqToCallback: true
    },
    function(req, email, password, done){
        //find user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                // req.flash('error', err);
                console.log("Error in finding user --> Passport");
                return done(err);
            }
            if(!user || user.password != password){
                // req.flash('error', 'Invalid Username/Password');
                console.log("Invalid Username");
                return done(null, false);
            }
            return done(null, user);
        });
    }
));


//serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log("Error in finding user --> Passport");
            return done(err);
        }
        return done(null, user);
    });
});


//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    //if user is signed in, then pass on the request to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect("//signin/form");
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending it to the response locals
        res.locals.user = req.user;
        
    }
    next();
}

/*****************EXPORTING MODULES*******************************/
module.exports = passport;