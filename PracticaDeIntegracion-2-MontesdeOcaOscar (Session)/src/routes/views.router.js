const express = require("express");
const router = express.Router(); 
const ProductManager = require("../controllers/product-manager-db.js");
const CartManager = require("../controllers/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para la vista de perfil y lista de productos combinada
router.get("/products", async (req, res) => {
   try {
      if (!req.session.login) {
          return res.redirect("/login");
      }

      // Obtener el usuario de la sesión
      const user = req.session.user;

      // Obtener la lista de productos (10 productos por página)
      const { page = 1, limit = 10 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("products", {
         user: user,
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const carrito = await cartManager.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
         quantity: item.quantity
      }));


      res.render("carts", { productos: productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});
// Ruta para el formulario de login
router.get("/login", (req, res) => {
   if (req.session.login) {
       return res.redirect("/products");
   }
   res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
   if (req.session.login) {
       return res.redirect("/products");
   }
   res.render("register");
});
// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
   if (!req.session.login) {
       return res.redirect("/login");
   }
   res.render("profile", { user: req.session.user });
});

//Ruta admin:

router.get("/admin", (req, res, next) => {
   if (!req.isAuthenticated()) {
       return res.redirect('/login'); // Redirigir si el usuario no está autenticado
   }
   if (req.user.rol !== "admin") {
       return res.status(403).send("Accesso denegado, no eres administrador rata de 2 patas!!!!");
   }
   // Y si sos admin podes pasar al tablero de admin. 
   res.render("admin");
});



module.exports = router;
