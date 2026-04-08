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

export const updateTicketStatus = async (
  id: number,
  status: string
) => {
  return await prisma.ticket.update({
    where: { id },
    data: { status },
  });
};