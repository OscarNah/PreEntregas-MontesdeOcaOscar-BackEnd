const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager-db.js");
const productManager = new ProductManager();

//Listar todos los productos
router.get("/", async (req, res) => {
    try {
      const productos = await productManager.getProducts();
      const limit = req.query.limit;
      const limitNumber = limit ? parseInt(limit) : undefined;
  
      if (limitNumber && !isNaN(limitNumber)) {
        res.json(productos.slice(0, limitNumber));
      } else {
        res.json(productos);
      }
    } catch (error) {
      console.log("Error al obtener los productos", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });
  
  //Traer solo 1 producto por ID:
  router.get("/:pid", async (req, res) => {
    const id = req.params.pid
      try {
          const producto = await productManager.getProductById(id);
          if (!producto) {
              res.json({ error: "El producto buscado no existe" });
          }
          res.json(producto);
      } catch (error) {
          console.log('Error al obtener producto.', error)
          res.status(500).json({ error: 'Error del servidor' });
      }
  })
  
  // Agregar un nuevo producto por POST.
  router.post("/", async (req, res) => {
    const nuevoProducto = req.body; 
    try {
        await productManager.addProduct(nuevoProducto),
        res.status(201).json({message: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("error al agregar un producto ", error);
        res.status(500).json({error: "Error del servidor!"});
    }
  })
  //Actualizamos un producto de productos.json
  router.put("/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoActualizado = req.body;
    console.log(productoActualizado);
  
    try {
      await productManager.updateProduct(id, productoActualizado);
      res.status(200).json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
      console.log("Error al actualizar el producto ", error);
      res.status(500).json({ error: "Error del servidor!" });
    }
  });
  //Eliminar un producto de productos.json
  router.delete("/:pid", async( req, res) =>{
    const id = req.params.pid;

    try {
      await productManager.deleteProduct(id);
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Error al borrar el producto ", error);
      res.status(500).json({ error: "Error del servidor!" });
    }
  });

  module.exports = router;