//Desafío entregable: "Clases con ECMAScript y ECMAScript avanzado"

class ProductManager {
  constructor() {
    this.product = [];
  }
  addProduct(title, description, price, thumbnail, code, stock) {
    if (title && description && price && thumbnail && code && stock) {
      const codeAlredyExist = this.product.some(
        (product) => product.code === code
      );
      if (!codeAlredyExist) {
        const product = {
          id: this.#createId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.product.push(product);
      } else {
        this.#generateError(
          "No pueden existir dos productos con el mismo código"
        );
      }
    } else {
      this.#generateError(
        "Error al cargar el producto. No se permiten campos vacios"
      );
    }
  }
  getProducts() {
    console.log("Los productos cargados son:", this.product);
  }
  getProductById(id) {
    const searchedProduct = this.product.find((product) => product.id === id);
    searchedProduct
      ? console.log("El producto buscado es:", searchedProduct)
      : this.#generateError("Not found: No existe un producto con ese id");
  }
  #createId() {
    const id =
      this.product.length === 0
        ? 1
        : this.product[this.product.length - 1].id + 1;
    return id;
  }
  #generateError(message) {
    throw new TypeError(message);
  }
}
