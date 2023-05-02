import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";

class SessionController {
  authUser(req, res) {
    const user = req.user;
    res.json({ message: "Authorized user", user });
  }
  openSession(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.fullName, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  closeSession(req, res) {
    req.session.destroy((error) => {
      if (error) {
        CustomError.generateError(ErrorEnums.SERVER_ERROR);
      } else {
        res.clearCookie("userSession");
        res.clearCookie("client_token");
        res.redirect("/");
      }
    });
  }
}

export default new SessionController();
