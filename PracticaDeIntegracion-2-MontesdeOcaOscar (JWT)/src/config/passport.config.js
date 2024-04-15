//Importamos passport y la estrategia passport-jwt
const passport = require("passport");
const jwt = require("passport-jwt");
const GitHubStrategy = require("passport-github2");
//Guarda acá cuando estan importando!

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
        //Misma palabra que tenemos en la App.js! No se olviden! 
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
}

//Creamos el cookie extractor

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token;
}
//Github
passport.use("github", new GitHubStrategy({
    clientID: "Iv1.763e968fa04f685f",
    clientSecret: "d6ef03b14a8a5071c806c75b87a076924e9c8b52",
    callbackURL: "http://localhost:8080/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
    //Opcional: si ustedes quieren ver como lllega el perfil del usuario: 
    console.log(profile); 
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

module.exports = initializePassport;