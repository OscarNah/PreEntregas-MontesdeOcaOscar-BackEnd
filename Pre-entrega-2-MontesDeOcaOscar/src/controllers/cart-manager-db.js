const CartModel = require("../models/cart.model.js");

class CartManager {

    //1. Crear carrito

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un carrito nuevo", error);
            throw error; 
        }
    }
    // 2. Obtener carrito por ID
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);

            if(!carrito) {
                console.log("No hay carrito con ese ID");
                return null; 
            }
            
            return carrito;

        } catch (error) {
            console.log("Error al obtener el carrito con el ID proporcionado", error);
            throw error; 
        }
    }
    // 3. Agregar Producto al carrito usando el ID del producto

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if(existeProducto) {
                existeProducto.quantity += quantity; 
            }else {
                carrito.products.push({product: productId, quantity});
            }

            carrito.markModified("products");

            await carrito.save();
            return carrito;
            
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error; 
        }
    }
    // 4. Eliminar un producto del carrito usando el ID de carrito y producto.
    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('No se pudo eliminar el producto del carrito', error);
            throw error;
        }
    }
    //5. Acualizar carrito
    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }
    //6. Actualizar SOLO la cantidad de ejemplares del producto
    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }
    //7. Eliminar todos los productos del carrito (vaciar)
    async vaciarCarrito(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }
}

module.exports = CartManager;