import { Request, Response } from "express";
import { createTicket, getTickets, updateTicketStatus } from "../services/ticket.service"; // 👈 agrega el import

export const create = async (req: Request, res: Response) => {
    try {
        const { title, description, priority } = req.body;
        const userId = (req as any).user.id;

        const ticket = await createTicket(title, description, userId, priority);

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error creando ticket" });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const tickets = await getTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo tickets" });
    }
};

// 👇 nueva función al final
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await updateTicketStatus(Number(id), status);

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando ticket" });
    }
};