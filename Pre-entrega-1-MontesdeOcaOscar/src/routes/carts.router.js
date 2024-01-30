const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

//Creamos el carrito:

router.post("/", async (req, res) =>{
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.log("Error al crear el carrito", error);
        res.status(500).json({error: "Error interno del servidor"})
        
    }
});

//Ver todos los productos del carrito
router.get("/:cid", async (req, res) =>{
    const cartId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.log("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

//Agregar productos a distintos carritos

router.post("/:cid/product/:pid", async (req, res) =>{
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = 1;
    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.log("Error al agregar producto al carrito", error);
        res.status(500).json({error: "Error interno del servidor"})
    }
});

module.exports = router;