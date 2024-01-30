const express = require("express"); // Se importa el módulo de express al archive app.js
const app = express(); //Se procede a crear la aplicación.
const PUERTO = 8080; // Se asigna el puerto al que se quiere trabajar.
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

//Middleware
app.use(express.json());
//Para manipular datos JSON
app.use(express.urlencoded({extended:true}));
//Para recibir datos complejos. 
//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//Escuchar puerto
app.listen(PUERTO, () => {
  console.log(`Escucuchando en http://localhost:${PUERTO}`);
});