const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcryp.js");

const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    //Register
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;
        try {

            let user = await UserModel.findOne({email:email});
            if(user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);

            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    // Login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("Este usuario no existeeeeeee ahhh");
                return done(null, false);
            }
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })
    //Github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.763e968fa04f685f",
        clientSecret: "d6ef03b14a8a5071c806c75b87a076924e9c8b52",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Opcional: si ustedes quieren ver como lllega el perfil del usuario: 
        // console.log(profile); //informacion de github del usuarfio que ingresa
        try {
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user) {
                //Si no encuentro ningun usuario con este email, lo voy a crear:
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "secreto",
                    age: 37,
                    email: profile._json.email,
                    password: "secreto"
                }
                //Una vez que tengo el nuevo usuario, lo guardo en MongoDB
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}
module.exports = initializePassport;