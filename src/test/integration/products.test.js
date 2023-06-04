import { requester, helpers } from "../helpers.js";
import { expect } from "chai";

describe("prueba de integracion del endpoint de productos, /api/products", () => {
  const premiumUser = {
    cookie: "",
    createdId: "",
  };
  it("Metodo get devuelve un array de objectos de tipo productos, con datos de paginacion", async () => {
    const { _body: body } = await requester.get("/api/products");
    expect(body).to.include.all.keys(helpers.products.getAllKeys);
    expect(body.status).to.be.equal("success");
    expect(body.payload).to.be.an("array");
    expect(body.payload[0]).to.include.all.keys(
      helpers.products.productTypeKeys
    );
  });
  it("Metodo get al endpoint /:id devuelve un objeto con status y un objeto de tipo producto", async () => {
    const { _body: body } = await requester.get(
      `/api/products/${helpers.products.existingId}`
    );
    expect(body).to.include.all.keys(["status", "product"]);
    expect(body.product).to.include.all.keys(helpers.products.productTypeKeys);
  });
  it("Metodo post devuelve codigo 401 si no se esta logeado", async () => {
    const resp = await requester
      .post("/api/products")
      .send(helpers.products.testProduct);
    expect(resp.statusCode).to.be.equal(401);
  });
  it("Metodo post devuelve codigo 403 si se esta logeado como usuario", async () => {
    const resp = await helpers.login("user");
    const cookies = resp.header["set-cookie"];
    const postResp = await requester
      .post("/api/products")
      .set("Cookie", [...cookies])
      .send(helpers.products.testProduct);
    expect(postResp.statusCode).to.be.equal(403);
  });
  it("Metodo post devuelve el producto agregado si se esta logeado como premium", async () => {
    const resp = await helpers.login("premium");
    const cookies = resp.header["set-cookie"];
    const postResp = await requester
      .post("/api/products")
      .set("Cookie", [...cookies])
      .send(helpers.products.testProduct);
    expect(postResp.statusCode).to.be.equal(200);
    expect(postResp.body.product).to.have.property("_id");
    premiumUser.cookie = cookies;
    premiumUser.createdId = postResp.body.product._id;
  });
  it("El propietario de un producto puede eliminar un producto", async () => {
    const resp = await requester
      .delete(`/api/products/${premiumUser.createdId}`)
      .set("Cookie", premiumUser.cookie);
    expect(resp.statusCode).to.be.equal(200);
    expect(resp.body.id).to.be.equal(premiumUser.createdId);
  });
});
