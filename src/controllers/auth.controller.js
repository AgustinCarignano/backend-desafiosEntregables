import usersService from "../services/users.service.js";
import { hashData } from "../utils/bcrypt.utils.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { generateToken, verifyToken } from "../utils/jwt.utils.js";
import { transporter } from "../utils/nodemailer.utils.js";
import { logger } from "../utils/winston.js";

class AuthController {
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
      const token = await generateToken(newUser, "1d");
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
      if (validUser instanceof Error)
        return res.redirect("/views/login/errorLogin");
      const token = await generateToken(validUser, "1d");
      res.cookie("client_token", token);
      //res.json({ token });
      res.redirect("/api/sessions/current");
    } catch (error) {
      next(error);
    }
  }
  async passRecover(req, res) {
    const { email } = req.body;
    try {
      const user = await usersService.getUserByEmail(email);
      if (!user) throw new CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const recoveryToken = await generateToken(user, "1h");
      const mailContent = {
        from: "CoderBackend",
        to: email,
        subject: "Recuperar contrasenia",
        html: `<p>Haz clic en el siguiente <a href="http://localhost:8080/views/newPassword/${recoveryToken}">enlace</a> para restaurar su contrasenia</p>`,
      };
      await transporter.sendMail(mailContent);
      res.render("recovery", { sent: true });
    } catch (error) {
      throw error;
    }
  }

  async newPassword(req, res) {
    const { recovery_token } = req.cookies;
    const { password } = req.body;
    try {
      const { user } = verifyToken(recovery_token);
      const isValidPass =
        (await usersService.validateUser(user.email, password)) instanceof
        Error;
      if (!isValidPass) {
        return res.render("newPassword", {
          auth: true,
          message: "Elige otra contraseña",
        });
      }
      const hashedPassword = hashData(password);
      await usersService.updateUser(user.email, { password: hashedPassword });
      res.redirect("/views/login");
    } catch (error) {
      res.redirect("/login/errorLogin");
    }
  }
}

export default new AuthController();
