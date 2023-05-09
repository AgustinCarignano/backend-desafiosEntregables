import { logger } from "../../../utils/winston.js";
import { cartsModel } from "../../MongoDB/models/carts.model.js";

class CartsMongo {
  async createCart() {
    try {
      const cart = await cartsModel.create({ products: [] });
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to create a cart",
        error.message
      );
      return;
    }
  }
  async getCartById(cid) {
    try {
      const cart = await cartsModel.findById(cid).populate({
        path: "products",
        populate: { path: "product", model: "Products" },
      });
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to get a cart",
        error.message
      );
      return error;
      //throw new Error(error.message);
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const product = cart.products.find(
        (item) => item.product.toString() === pid
      );
      if (product) {
        product.quantity++;
      } else {
        cart.products.push({
          product: pid,
          quantity: 1,
        });
      }
      cart.save();
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to add a product to cart",
        error.message
      );
      return error;
      //throw new Error(error.message);
    }
  }
  async updateCart(cid, newProducts) {
    try {
      const cart = await cartsModel.findByIdAndUpdate(
        cid,
        { products: newProducts },
        { new: true }
      );
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to update a cart",
        error.message
      );
      return error;
    }
  }
  async updateProductInCart(cid, pid, q) {
    try {
      const cart = await cartsModel.findById(cid);
      const product = cart.products.find(
        (item) => item.product.toString() === pid
      );
      product.quantity = q;
      cart.save();
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to update a cart",
        error.message
      );
      return error;
    }
  }
  async deleteProductById(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );
      cart.products.splice(productIndex, 1);
      cart.save();
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to delete a produtc from a cart",
        error.message
      );
      return error;
    }
  }
  async deleteProducts(cid) {
    try {
      const cart = await cartsModel.findById(cid);
      cart.products.splice(0, cart.products.length);
      cart.save();
      return cart;
    } catch (error) {
      logger.error(
        "An error occurred while trying to delete all products from a cart",
        error.message
      );
      return error;
    }
  }
}

export default new CartsMongo();
