import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";

const cartsService = new CartsService();
const productsService = new ProductsService();

export class ViewsController {
  login(req, res) {
    res.render("login");
  }

  register(req, res) {
    res.render("register");
  }

  redirectToLogin(req, res) {
    res.redirect("/views/login");
  }

  errorLogin(req, res) {
    res.render("errorLogin");
  }

  errorRegister(req, res) {
    res.render("errorRegister");
  }

  async getCartProducts(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartsService.getCartById(cid);
      const newCart = JSON.parse(JSON.stringify(cart));
      const render = true;
      res.render("cart", { render, cart: newCart });
    } catch (error) {
      const render = false;
      res.render("cart", { render });
    }
  }

  async getProducts(req, res) {
    const { limit = 10, page = 1, sort, query } = req.query;
    const { userSession } = req.signedCookies;
    const { cart } = req.user ? req.user : "";

    const products = await productsService.getProducts({
      limit,
      page,
      sort,
      query,
    });

    let prevUrl = null;
    let nextUrl = null;
    if (products.hasPrevPage) {
      const i = req.originalUrl.indexOf("page=");
      if (i === -1) {
        prevUrl = `${req.originalUrl}?page=${products.prevPage}`;
      } else {
        prevUrl = `${req.originalUrl.slice(0, i)}page=${
          products.prevPage
        }${req.originalUrl.slice(i + 6, req.originalUrl.length)}`;
      }
    }
    if (products.hasNextPage) {
      const i = req.originalUrl.indexOf("page=");
      if (i === -1) {
        nextUrl = `${req.originalUrl}?page=${products.nextPage}`;
      } else {
        nextUrl = `${req.originalUrl.slice(0, i)}page=${
          products.nextPage
        }${req.originalUrl.slice(i + 6, req.originalUrl.length)}`;
      }
    }
    const render = products.docs.length === 0 ? false : true;

    res.render("products", {
      user: userSession,
      cartId: cart ? cart.toString() : "",
      status: "success",
      render: render,
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevUrl,
      nextLink: nextUrl,
    });
  }

  async getProduct(req, res) {
    try {
      const { pid } = req.params;
      const { cart } = req.user ? req.user : "";
      const product = await productsService.getProductById(pid);
      const render = true;
      res.render("product", {
        render,
        product,
        cartId: cart ? cart.toString() : "",
      });
    } catch (error) {
      const render = false;
      res.render("product", { render });
    }
  }
}
