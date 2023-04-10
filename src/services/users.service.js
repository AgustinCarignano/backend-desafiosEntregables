import { UsersManager } from "../DAL/managers/users.manager.js";
import { CartsManager } from "../DAL/managers/carts.manager.js";

const usersManager = new UsersManager();
const cartsManager = new CartsManager();

export class UsersService {
  async addUser(user) {
    try {
      const { _id } = await cartsManager.createCart();
      const newUser = await usersManager.addUser({ ...user, cart: _id });
      return newUser;
    } catch (error) {
      return error;
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await usersManager.getUserByEmail(email);
      return user;
    } catch (error) {
      return error;
    }
  }
  async getUserById(id) {
    try {
      const user = await usersManager.getUserById(id);
      return user;
    } catch (error) {
      return error;
    }
  }
}
