import { ticketsModel } from "../../MongoDB/models/tickets.model.js";

class TicketsMongo {
  constructor() {
    this.model = ticketsModel;
  }
  async getTicketById(tid) {
    try {
      const ticket = await this.model.findById(tid);
      return ticket;
    } catch (error) {
      logger.error(
        `An error occurred while trying to get the ticket with id ${tid}`,
        error.message
      );
      throw new Error(error.message);
    }
  }
  async generateTicket(code, totalPrice, userEmail) {
    try {
      const newTicket = await this.model.create({
        code,
        amount: totalPrice,
        purchaser: userEmail,
      });
      return newTicket;
    } catch (error) {
      logger.error(
        "An error occurred while trying to generate a ticket",
        error.message
      );
      throw new Error(error.message);
    }
  }
}

export default new TicketsMongo();
