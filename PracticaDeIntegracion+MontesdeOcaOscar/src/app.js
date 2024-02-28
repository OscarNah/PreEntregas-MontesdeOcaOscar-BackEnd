const express = require("express"); // Se importa el módulo de express al archive app.js
const app = express(); //Se procede a crear la aplicación.
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080; // Se asigna el puerto al que se quiere trabajar.
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
const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


//Desafio loco del chat en el ecommerce: 
const MessageModel = require("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection",  (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async data => {

      //Guardo el mensaje en MongoDB: 
      await MessageModel.create(data);

      //Obtengo los mensajes de MongoDB y se los paso al cliente: 
      const messages = await MessageModel.find();
      console.log(messages);
      io.sockets.emit("message", messages);
   
  })
})

