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

export const getTickets = async (userId: number) => {
  return await prisma.ticket.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
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