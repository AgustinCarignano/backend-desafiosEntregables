import usersService from "../services/users.service.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";

class SessionController {
  authUser(req, res) {
    const user = req.user;
    res.cookie(
      "userSession",
      { name: req.user.fullName, role: req.user.role },
      { signed: false }
    );
    req.session.logged = true;
    req.session.isAdmin = false;
    res.json({ message: "User logged in", user });
  }
  openSession(req, res) {
    const user = req.user;
    res.cookie(
      "userSession",
      { name: req.user.fullName, role: req.user.role },
      { signed: false }
    );
    req.session.logged = true;
    usersService.updateUser(user.email, {
      ...user,
      last_conection: new Date(),
    });
    res.redirect("/views/products");
  }
  async facebookCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.fullName, role: req.user.role },
      { signed: false }
    );
    req.session.logged = true;
    req.session.isAdmin = false;
    res.redirect("/views/products");
  }
  async githubCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.fullName, role: req.user.role },
      { signed: false }
    );
    req.session.logged = true;
    req.session.isAdmin = false;
    res.redirect("/views/products");
  }
  closeSession(req, res) {
    req.session.destroy((error) => {
      if (error) {
        CustomError.generateError(ErrorEnums.SERVER_ERROR);
      } else {
        const user = req.user;
        usersService.updateUser(user.email, {
          ...user,
          last_conection: new Date(),
        });
        res.clearCookie("userSession");
        res.clearCookie("client_token");
        res.redirect("/");
      }
    });
  }
}

export default new SessionController();
