import { logger } from "../../../utils/winston.js";
import { messagesModel } from "../../MongoDB/models/message.model.js";

class MessageMongo {
  constructor() {
    this.model = messagesModel;
  }
  async getMessages() {
    try {
      const messages = await this.model.find();
      return messages;
    } catch (error) {
      logger.error("An error occurred while trying to get all messages");
      return error;
    }
  }
  async saveMessage(newMessage) {
    try {
      await this.model.create(newMessage);
      return this.getMessages();
    } catch (error) {
      logger.error("An error occurred while trying to save a message");
      return error;
    }
  }
  async cleanHistory() {
    try {
      await this.model.deleteMany();
      return this.getMessages();
    } catch (error) {
      logger.error(
        "An error occurred while trying to clean the message history"
      );
      return error;
    }
  }
}

export default new MessageMongo();
