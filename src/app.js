import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import "./middlewares/passport.middleware.js";
import "./persistence/MongoDB/configMongo.js";
import config from "./config.js";
import { __dirname } from "./utils/path.utils.js";
//Routes imports -------------------------------------------
import indexRouter from "./routes/index.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { logger } from "./utils/winston.js";

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

//Cors ----------------------------------------------------
app.use(cors());

//Routes --------------------------------------------------
app.use("/api/carts/", indexRouter.carts);
app.use("/api/products/", indexRouter.products);
app.use("/api/auth", indexRouter.auth);
app.use("/api/sessions", indexRouter.sessions);
app.use("/views", indexRouter.views);

//Rota de prueba de logger -----------------------------------------------
app.get("/loggerTest", (req, res) => {
  logger.info(
    `El servidor se esta ejecutando en el entorno de ${
      config.node_env === "dev" ? "desarrollo" : "produccion"
    }`
  );

  logger.fatal(
    "Log de tipo fatal. Debe aparecer en consola y en archivo solo si se esta en el entorno productivo"
  );
  logger.error(
    "Log de tipo error. Debe aparecer en consola y en archivo solo si se esta en el entorno productivo"
  );
  logger.warning(
    "Log de tipo warning. Debe aparecer solo en consola para ambos entornos"
  );
  logger.info(
    "Log de tipo info. Debe aparecer solo en consola para ambos entornos"
  );
  logger.http(
    "Log de tipo http. Debe aparecer en consola solo cuando se esta en el entorno de desarrollo"
  );
  logger.debug(
    "Log de tipo debug. Debe aparecer en consola solo cuando se esta en el entorno de desarrollo"
  );
  res.send("Logger testing");
});

app.use(errorMiddleware);

app.get("/", (_req, res) => {
  res.redirect("/views/login");
});
app.get("/*", (_req, res) => {
  res.render("errorUrl", { errorCode: "404", errorMessage: "Invalid URL" });
});

export const httpServer = app.listen(PORT, () => {
  logger.info(`Listen to PORT ${PORT}`);
});

import("./controllers/messages.controller.js");
