import { helpers, requester } from "../helpers.js";
import { expect } from "chai";

describe("prueba de integracion del endpoint de carritos, /api/carts", () => {
  let createdCid;
  it("Metodo post crea un nuevo carrito en la base de datos", async () => {
    const resp = await requester.post("/api/carts");
    expect(resp.statusCode).to.be.equal(200);
    expect(resp.body.cart).to.have.property("_id");
    createdCid = resp.body.cart._id;
  });
  it("Metodo post a la ruta /:cid/products/:pid agrega un producto si el rol es user y el producto existe", async () => {
    const resp = await helpers.login("user");
    const cookie = resp.header["set-cookie"];
    const postResp = await requester
      .post(`/api/carts/${createdCid}/product/${helpers.products.existingId}`)
      .set("Cookie", cookie);
    expect(postResp.status).to.be.equal(200);
    expect(postResp.body.cart).to.have.property("products");
    expect(postResp.body.cart.products[0].product).to.be.equal(
      helpers.products.existingId
    );
  });
  it("El propietario de un producto no puede agregarlo a su carrito", async () => {
    const resp = await helpers.login("owner");
    const cookies = resp.headers["set-cookie"];
    const postResp = await requester
      .post(`/api/carts/${createdCid}/product/${helpers.carts.LuisProduct}`)
      .set("Cookie", cookies);
    expect(postResp.statusCode).to.be.equal(403);
  });
  it("Metodo get a la ruta /:cid obtiene la informacion del carrito especificado", async () => {
    const resp = await requester.get(`/api/carts/${createdCid}`);
    expect(resp.statusCode).to.be.equal(200);
    expect(resp.body).to.include.all.keys(["cart", "message"]);
    expect(resp.body.cart).to.include.all.keys(["_id", "products"]);
    expect(resp.body.cart.products).to.be.an("array");
    expect(resp.body.cart.products[0]).to.include.all.keys([
      "product",
      "quantity",
    ]);
  });
});
