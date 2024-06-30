import TicketModel from '../models/ticket.model.js';
import UserModel from '../models/user.model.js';
import { logger } from '../utils/logger.js';

class CheckoutController {
    async viewCheckout(req, res) {
        const ticketId = req.params.ticketId;

        try {
            const ticket = await TicketModel.findById(ticketId).populate('purchaser');
            if (!ticket) {
                logger.warn(`Ticket no encontrado: ${ticketId}`);
                return res.status(404).send('Ticket no encontrado');
            }

            const purchaser = await UserModel.findById(ticket.purchaser);
            if (!purchaser) {
                logger.warn(`Usuario no encontrado para el ticket: ${ticketId}`);
                return res.status(404).send('Usuario no encontrado');
            }

            logger.info(`Mostrando checkout para el ticket: ${ticketId}`);
            res.render('checkout', {
                cliente: `${purchaser.first_name} ${purchaser.last_name}`,
                numTicket: ticket.code,
                email: purchaser.email,
            });
        } catch (error) {
            logger.error('Error al obtener el ticket:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

export default new CheckoutController();
