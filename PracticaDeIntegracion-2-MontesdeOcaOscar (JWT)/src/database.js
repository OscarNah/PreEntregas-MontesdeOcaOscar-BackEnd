const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://1im4montesdeocaoscar:coderhouse@cluster0.pjihogn.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Vamos a morir, tenemos un error"))
    