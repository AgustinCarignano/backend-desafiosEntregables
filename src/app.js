import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express(); //Creación del servidor con Express
const PORT = 8080; //Se define el puerto al que se estará escuchando
const productManager = new ProductManager("productos.json"); //Creación de una instancia de la clase ProductManager

//Idicación del puerto a escuchar, con mensaje por consola
app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

//Dirección desde la que pueden obtenerse todos los productos o una cantidad limitada si se pasa la query limit
app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
  res.json({ products });
});

//Dirección con parametro variable para obtener solo un producto determinado por si id
app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (product instanceof Error) {
    const Error = product.message;
    res.json({ Error });
  } else {
    res.json({ product });
  }
});
