const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager-db.js");
const productManager = new ProductManager();

//1. Listar todos los productos.
router.get("/", async (req, res) => {
  try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productManager.getProducts({
          limit: parseInt(limit),
          page: parseInt(page),
          sort,
          query,
      });

      res.json({
          status: 'success',
          payload: productos,
          totalPages: productos.totalPages,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          page: productos.page,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
      });

  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
      });
  }
});
  
//2. Traer solo 1 producto por ID:
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
  
//3. Agregar un nuevo producto.
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
  //4. Actualizamos un producto por ID
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
  //5. Eliminar un producto de por ID
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