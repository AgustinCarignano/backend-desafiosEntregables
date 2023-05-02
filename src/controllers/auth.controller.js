import usersService from "../services/users.service.js";
import { hashData } from "../utils/bcrypt.utils.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { generateToken } from "../utils/jwt.utils.js";

class AuthController {
  async facebookCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async githubCallback(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async jwtRegister(req, res, next) {
    const { email, password, firstName, lastName, age } = req.body;
    try {
      if (!email || !password || !firstName || !lastName || !age) {
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      }
      const user = await usersService.getUserByEmail(email);
      if (user) return res.redirect("/views/register/errorRegister");
      const hashedPassword = hashData(password);
      const newUser = await usersService.addUser({
        ...req.body,
        password: hashedPassword,
      });
      const token = await generateToken(newUser);
      res.cookie("client_token", token);
      //res.json({ token });
      res.redirect("/api/sessions/current");
    } catch (error) {
      next(error);
    }
  }
  async jwtLogin(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      }
      const validUser = await usersService.validateUser(email, password);
      if (!validUser) return res.redirect("/views/login/errorLogin");
      const token = await generateToken(validUser);
      res.cookie("client_token", token);
      //res.json({ token });
      res.redirect("/api/sessions/current");
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
