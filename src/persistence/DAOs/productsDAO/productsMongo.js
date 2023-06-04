import { productsModel } from "../../MongoDB/models/products.model.js";

class ProductsMongo {
  async getProducts(param) {
    let query = {};
    if (param.query) {
      const i = param.query.indexOf(":");
      const f = param.query.length;
      const key = param.query.slice(0, i);
      const value = param.query.slice(i + 1, f);
      query[key] = value;
      delete param.query;
    }
    if (param.sort) {
      param.sort = param.sort === "asc" ? { price: 1 } : { price: -1 };
    }
    try {
      const products = await productsModel.paginate(query, {
        ...param,
        lean: true,
      });
      return products;
    } catch (error) {
      logger.error(
        "An error occurred while trying to get all products",
        error.message
      );
      throw new Error(error.message);
    }
  }
  async getProductById(pid) {
    try {
      const product = await productsModel.findById(pid).lean();
      if (!product)
        throw new Error("No se ha encontrado un producto con el id indicado");
      return product;
    } catch (error) {
      logger.error(
        `An error occurred while trying to get a product with id: ${pid}`,
        error.message
      );
      throw new Error(error.message);
    }
  }
  async addProduct(newProduct) {
    try {
      const product = await productsModel.create(newProduct);
      return product;
    } catch (error) {
      logger.error(
        "An error occurred while trying to add a new products to database",
        error.message
      );
      throw new Error(error.message);
    }
  }
  async updateProduct(pid, objProduct) {
    try {
      const product = await productsModel.findByIdAndUpdate(pid, objProduct, {
        new: true,
      });
      return product;
    } catch (error) {
      logger.error(
        "An error occurred while trying to update a product in database",
        error.message
      );
      throw new Error(error.message);
    }
  }
  async deleteProduct(pid) {
    try {
      const product = await productsModel.findByIdAndDelete(pid);
      return product.id;
    } catch (error) {
      logger.error(
        "An error occurred while trying to delete a product from database",
        error.message
      );
      throw new Error(error.message);
    }
  }
}

export default new ProductsMongo();
