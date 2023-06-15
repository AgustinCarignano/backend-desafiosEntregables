import usersService from "../services/users.service.js";

class UsersController {
  async saveDocuments(req, res) {
    const user = req.user;
    const files = req.files;
    const documents = [];
    for (const key in files) {
      documents.push(...files[key]);
    }
    const newDocuments = documents.map((item) => ({
      name: item.fieldname.split("-")[1],
      reference: item.path,
    }));
    const newInfoToUser = { documents: [...user.documents, ...newDocuments] };
    const updatedUser = await usersService.updateUser(
      user.email,
      newInfoToUser
    );
    req.user = updatedUser;
    res.redirect("/views/clientArea");
  }
  async upgradeUser(req, res) {
    const user = req.user;
    const essentialDocuments = ["identification", "address", "account"];
    const existingDocuments = user.documents.map((item) => item.name);
    let hasToUpgrade = true;
    essentialDocuments.forEach((item) => {
      if (!existingDocuments.includes(item)) hasToUpgrade = false;
    });
    if (hasToUpgrade) {
      const updatedUser = await usersService.updateUser(user.email, {
        ...user,
        role: "premium",
      });
      req.user = updatedUser;
      res.clearCookie("userSession").redirect("/api/sessions/current");
    } else {
      res.redirect("/views/clientArea");
    }
  }
}

export default new UsersController();
