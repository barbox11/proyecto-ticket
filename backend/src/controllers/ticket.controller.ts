import { Request, Response } from "express";
import { createTicket, getTickets, updateTicketStatus, deleteTicket } from "../services/ticket.service";

export const create = async (req: Request, res: Response) => {
    try {
        const { title, description, priority } = req.body;

        // Validar que título y descripción sean obligatorios
        if (!title || !description) {
            return res.status(400).json({ error: "Título y descripción son requeridos" });
        }

        // Validar longitud mínima del título
        if (title.trim().length < 3) {
            return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
        }

        // Validar que la prioridad sea un valor válido
        const validPriorities = ["baja", "media", "alta"];
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ error: "Prioridad inválida" });
        }

        const userId = Number((req as any).user.id);
        const ticket = await createTicket(title, description, userId, priority || "media");

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error creando ticket" });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
    const userId = Number((req as any).user.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getTickets(userId, page, limit);

    res.json(result);
    } catch (error) {
    res.status(500).json({ error: "Error al obtener tickets" });
    }
};

// 👇 nueva función al final
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;
        const userId = Number((req as any).user.id);

        const ticket = await updateTicketStatus(Number(id), userId, {
            title,
            description,
            priority,
            status,
        });

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando ticket" });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = Number((req as any).user.id);

        await deleteTicket(Number(id), userId);

        res.json({ message: "Ticket eliminado exitosamente" });
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }
        res.status(500).json({ error: "Error eliminando ticket" });
    }
};