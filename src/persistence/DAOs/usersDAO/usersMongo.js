import { usersModel } from "../../MongoDB/models/users.model.js";

class UserMongo {
  async getAllUsers() {
    try {
      const users = usersModel.find().lean();
      return users;
    } catch (error) {
      return error;
    }
  }
  async addUser(userObj) {
    try {
      const user = await usersModel.create(userObj);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getUserByEmail(userEmail) {
    const user = await usersModel.findOne({ email: userEmail }).lean();
    if (!user) {
      return;
    }
    return user;
  }
  async getUserById(uid) {
    try {
      const user = await usersModel.findById(uid).lean();
      if (!user) throw new Error("user does not exist");
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateUser(userEmail, obj) {
    try {
      const newUser = await usersModel.findOneAndUpdate(
        { email: userEmail },
        { ...obj },
        { new: true }
      );
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserMongo();
