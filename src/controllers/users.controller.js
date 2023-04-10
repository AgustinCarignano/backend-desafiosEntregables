import { UsersService } from "../services/users.service.js";
import { hashData, compareHashedData } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";

const usersService = new UsersService();

export class UsersController {
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
  async jwtRegister(req, res) {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (user) return res.redirect("/views/register/errorRegister");
    const hashedPassword = hashData(password);
    const newUser = await usersService.addUser({
      ...req.body,
      password: hashedPassword,
    });
    const token = await generateToken(newUser);
    res.cookie("client_token", token);
    res.redirect("/api/users/verifyToken");
  }
  async jwtLogin(req, res) {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.redirect("/views/login/errorLogin");
    const isCorrectPassword = await compareHashedData(password, user.password);
    if (!isCorrectPassword) return res.redirect("/views/login/errorLogin");
    const token = await generateToken(user);
    res.cookie("client_token", token);
    res.redirect("/api/users/verifyToken");
  }
  async openSession(req, res) {
    res.cookie(
      "userSession",
      { name: req.user.first_name, rol: "user" },
      { signed: true }
    );
    req.session.logged = true;
    res.redirect("/views/products");
  }
  async closeSession(req, res) {
    req.session.destroy((error) => {
      if (error) {
        console.log(error);
      } else {
        res.clearCookie("userSession");
        res.clearCookie("client_token");
        res.redirect("/");
      }
    });
  }
}
