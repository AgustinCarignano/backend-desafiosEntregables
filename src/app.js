import express from "express";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";

const app = express();
const PORT = 8080;

//dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

//Instancia de la clase para usar los metodos disponibles para la manipulacion de los productos
const productManager = new ProductManager(`${__dirname}/productos.json`);

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//metodos de la ruta raiz con protocolo http
app.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
  res.render("index", { products });
});

app.post("/", async (req, res) => {
  try {
    const productToAdd = req.body;
    const newProduct = await productManager.addProduct(productToAdd);
    res
      .status(200)
      .json({ message: "Producto cargado con éxito", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(parseInt(pid));
    res.json({ message: "producto eliminado con éxito" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//coneccion con el servidor socket cuando se llama a la ruta indicada
app.get("/realtimeproducts", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
  res.render("realTimeProducts", { products });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

//Websocket
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado", socket.id);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado", socket.id);
  });

  const products = await productManager.getProducts("all");

  socket.emit("inicio", products, "Conectado con Websocket");

  socket.on("deleteProduct", async (pid) => {
    await productManager.deleteProduct(parseInt(pid));
    const products = await productManager.getProducts("all");
    socket.emit("inicio", products);
  });

  socket.on("addProduct", async (obj) => {
    await productManager.addProduct(obj);
    const products = await productManager.getProducts("all");
    socket.emit("inicio", products);
  });
});
