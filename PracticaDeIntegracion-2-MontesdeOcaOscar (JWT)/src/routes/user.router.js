const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

//Register: 

router.post("/register", async (req, res) => {
    const {first_name, last_name, email, password, age,} = req.body; 
    try {
        //1) Verificamos si el usuario existe en nuestra BD. 
        const existeUsuario = await userModel.findOne({email});

        if(existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        //2) Creamos un nuevo usuario: 
        const nuevoUsuario = new userModel({
            first_name,
            last_name,
            email, 
            password,
            age,
        });

        //3) Lo guardamos en la BD. 
        await nuevoUsuario.save();

        //4) Generamos el Token de JWT. 
        const token = jwt.sign({first_name}, {last_name}, {email}, {age}, "coderhouse", {expiresIn:"1h"});

        //5) Mandamos como cookie el token: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, //1 hora de expiración
            httpOnly: true //La cookie solo se puede acceder mediante HTTP. 
        });

        //6) Lo mandamos al Home: 
        res.redirect("/home");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})


router.post("/login", async (req, res) => {
    const {email, password} = req.body; 
    try {
        //1) Busco el usuario en MongoDB
        const usuarioEncontrado = await userModel.findOne({email});

        if(!usuarioEncontrado) {
            return res.status(401).send("Usuario no valido");
        }

        //2) Verificamos la contraseña: 
        if(password !== usuarioEncontrado.password) {
            return res.status(401).send("Contraseña incorrecta");
        }

        //3) Generamos el Token de JWT. 
        const token = jwt.sign({
            first_name: usuarioEncontrado.first_name,
            last_name: usuarioEncontrado.last_name,
            email: usuarioEncontrado.email,
            age: usuarioEncontrado.age,
            rol:usuarioEncontrado.rol}, "coderhouse", {expiresIn:"1h"});

        //4) Mandamos como cookie el token: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, //1 hora de expiración
            httpOnly: true //La cookie solo se puede acceder mediante HTTP. 
        });

        res.redirect("/home");
    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})

//Home: 

router.get("/home", passport.authenticate("jwt", {session:false}), (req, res) => {
    
    res.render("home", {first_name: req.user.first_name, email: req.user.email});
})


//Logout: 

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
    //Limpiamos la cookie y lo mandamos al login. 
})

//Github
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res)=> {})
//
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    try {
        // Aquí ya estás autenticado, así que puedes obtener la información del usuario a través de req.user
        const { first_name, last_name, email } = req.user;
        console.log(req.user);

        // Generar el token JWT
        const token = jwt.sign({ first_name, last_name, email }, "coderhouse", { expiresIn: "1h" });

        // Establecer la cookie del token
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, // 1 hora de expiración
            httpOnly: true // La cookie solo se puede acceder mediante HTTP
        });

        // Redirigir al usuario a la página de inicio
        res.redirect("/home");
    } catch (error) {
        // Manejar errores de autenticación
        console.error("Error en la autenticación de GitHub:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//Ruta admin:

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Accesso denegado, no eres administrador rata de 2 patas!!!!");
    }
    //Y si sos admin podes pasar al tablero de admin. 
    res.render("admin");
})

module.exports = router;