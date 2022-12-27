//Desafío entregable: "Manejo de archivos"

//Aclaraciones:
//-En este archivo, los llamados para leer o escribir el archivo .json se hace de manera asincrónica, utilizando promesas y async-await.
//-La ruta en la que se guardan las archivos poasee un componenete variable para generar rutas distintas para cada instancia del objeto.
//-El método "addProduct" recibe un objeto, el cual debe tener el formato establecido. No recibe las propiedades por separado
//-El método "updateProduct" recibe como parámetro la key de la propiedad a modificar y el nuevo valor. Se deberá llamar al método cada vez que se quiera cambiar una propiedad.
//-El método "deleteProduct" elimina el archivo .json generado si al eliminar el producto ya no queda ninguno en el arreglo.

const fs = require("fs");

class ProductManagerAsync {
  constructor() {
    if (ProductManagerAsync.contador) {
      ProductManagerAsync.contador++;
    } else {
      ProductManagerAsync.contador = 1;
    }
    this.path = `./dataAsync/productos-${ProductManagerAsync.contador}.json`;
  }
  async addProduct(productObj) {
    try {
      const products = await this.getProducts();
      if (
        productObj.title &&
        productObj.description &&
        productObj.price &&
        productObj.thumbnail &&
        productObj.code &&
        productObj.stock
      ) {
        const codeAlredyExist = products.some(
          (product) => product.code === productObj.code
        );
        if (!codeAlredyExist) {
          const product = {
            id: await this.#createId(),
            ...productObj,
          };
          products.push(product);
          await this.#writeFile(products);
        } else {
          this.#generateError(
            "No pueden existir dos productos con el mismo código"
          );
        }
      } else {
        this.#generateError(
          "Error al cargar el producto. No se permiten campos vacios en las propiedades del producto."
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productFile = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productFile);
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const searchedProduct = products.find((product) => product.id === id);
      return searchedProduct
        ? searchedProduct
        : this.#generateError(
            `Not found, No existe un producto con el id: ${id}`
          );
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(productId, keyToChange, newValue) {
    try {
      const products = await this.getProducts();
      const productToChange = products.find(
        (product) => product.id === productId
      );
      !productToChange &&
        this.#generateError(`No existe un producto con el id: ${productId}`);
      productToChange[keyToChange] = newValue;
      await this.#writeFile(products);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      let i = products.findIndex((producto) => producto.id === productId);
      i === -1 &&
        this.#generateError(`No existe un producto con el id: ${productId}`);
      products.splice(i, 1);
      if (products.length === 0) {
        await fs.promises.unlink(this.path);
      } else {
        await this.#writeFile(products);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async #createId() {
    try {
      const productFile = await this.getProducts();
      const id =
        productFile.length === 0
          ? 1
          : productFile[productFile.length - 1].id + 1;
      return id;
    } catch (error) {
      console.log(error);
    }
  }
  #generateError(message) {
    throw new Error(message);
  }
  async #writeFile(product) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(product));
    } catch (error) {
      console.log(error);
    }
  }
}

const productoDePrueba = {
  title: "Producto prueba",
  description: "Este es un  producto de prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
