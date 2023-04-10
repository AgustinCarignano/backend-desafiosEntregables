import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./middlewares/passport.middleware.js";
import "./DAL/dbconfig.js";
import config from "./config.js";
import { __dirname } from "./utils/path.utils.js";
//Routes imports -------------------------------------------
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//Views --------------------------------------------------
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Cookies ------------------------------------------------
const COOKIE_KEY = config.cookieKey;
app.use(cookieParser(COOKIE_KEY));

//Session ------------------------------------------------
const URI = config.uri;
const SESSION_KEY = config.sessionKey;
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    resave: false,
    saveUninitialized: false,
    secret: SESSION_KEY,
    cookie: { maxAge: 86400000 },
  })
);

//Passport ------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

//Routes --------------------------------------------------
app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/users/", usersRouter);
app.use("/views", viewsRouter);

app.get("/", (_req, res) => {
  res.redirect("/views/login");
});
app.get("/*", (_req, res) => {
  res.render("errorUrl");
});

app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});
