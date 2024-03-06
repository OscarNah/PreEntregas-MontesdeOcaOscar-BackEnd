const express = require("express"); // Se importa el módulo de express al archive app.js
const app = express(); //Se procede a crear la aplicación.
const exphbs = require("express-handlebars");
const PUERTO = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Escuchar puerto
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO} http://localhost:8080`);
});
