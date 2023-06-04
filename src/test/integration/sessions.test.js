import { requester, helpers } from "../helpers.js";
import { expect } from "chai";

describe("prueba de integracion del endpoint de productos, /api/sessions", () => {
  let loginCookie;
  let globalSessionCookie;
  it("Metodo get sobre el endpoint /current extrae el token de cookies, abre una nueva sesion y setea una cookie de session", async () => {
    const loginResp = await helpers.login("user");
    const cookie = loginResp.headers["set-cookie"];
    loginCookie = cookie;
    const resp = await requester
      .get("/api/sessions/current")
      .set("Cookie", cookie);
    globalSessionCookie = resp.headers["set-cookie"];
    const sessionCookie = resp.headers["set-cookie"][0].split(";")[0];
    expect(sessionCookie).to.contain("userSession");
  });
  it("Metodo get sobre la ruta /login obtiene el token del header, abre sesion y responde los datos del usuario", async () => {
    const token = loginCookie[0].split(";")[0].split("=")[1];
    const resp = await requester
      .get("/api/sessions/login")
      .set("Authorization", `Bearer ${token}`);
    const sessionCookie = resp.headers["set-cookie"][0].split(";")[0];
    expect(resp.statusCode).to.be.equal(200);
    expect(sessionCookie).to.contain("userSession");
    expect(resp.body).to.have.property("user");
    expect(resp.body.user).to.include.all.keys(helpers.sessions.userKeys);
  });
});
