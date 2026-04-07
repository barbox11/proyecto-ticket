import { prisma } from "../config/prisma";

export const createTicket = async (
    title: string,
    description: string,
    userId: number
    ) => {
    return await prisma.ticket.create({
        data: {
        title,
        description,
        userId,
        },
    });
    };

    export const getTickets = async () => {
    return await prisma.ticket.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            },
        },
    });
    };