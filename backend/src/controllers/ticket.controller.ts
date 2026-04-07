import { Request, Response } from "express";
import { createTicket, getTickets } from "../services/ticket.service";

export const create = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const userId = (req as any).user.id;

        const ticket = await createTicket(title, description, userId);
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
