import { prisma } from "../config/prisma";

    export const createTicket = async (
    title: string,
    description: string,
    userId: number,
    priority: string
    ) => {
    return await prisma.ticket.create({
        data: {
        title,
        description,
        priority,
        userId,
        },
    });
    };

export const getTickets = async (userId: number, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [tickets, total] = await prisma.$transaction([
        prisma.ticket.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        }),
        prisma.ticket.count({ where: { userId } }),
    ]);

    return {
        tickets,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + tickets.length < total,
    };
};

export const updateTicketStatus = async (
    id: number,
    userId: number,
    data: { title?: string; description?: string; priority?: string; status?: string }
) => {
    return await prisma.ticket.update({
        where: { id, userId },
        data,
    });
};

export const deleteTicket = async (id: number, userId: number) => {
    return await prisma.ticket.delete({
        where: { id, userId },
    });
};