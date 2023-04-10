import { CartsManager } from "../DAL/managers/carts.manager.js";
import { ProductsManager } from "../DAL/managers/products.manager.js";

const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

export class CartsService {
  async createCart() {
    try {
      const cart = await cartsManager.createCart();
      return cart;
    } catch (error) {
      return error;
    }
  }
  async getCartById(cid) {
    try {
      const cart = await cartsManager.getCartById(cid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async addProductToCart(cid, pid) {
    try {
      await productsManager.getProductById(pid);
      const cart = await cartsManager.addProductToCart(cid, pid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async updateCart(cid, newProducts) {
    try {
      const cart = await cartsManager.updateCart(cid, newProducts);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async updateProductInCart(cid, pid, quantity) {
    try {
      const cart = await cartsManager.updateProductInCart(cid, pid, quantity);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async deleteProduct(cid, pid) {
    try {
      const cart = await cartsManager.deleteProductById(cid, pid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async cleanCart(cid) {
    try {
      const cart = await cartsManager.deleteProducts(cid);
      return cart;
    } catch (error) {
      return error;
    }
  }
}
