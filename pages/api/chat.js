// pages/api/chat.js
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 6; // Number of chats per page (adjust as needed)
  const pageNumber = parseInt(page, 10) || 1;

  // Filtering criteria if search query exists
  const where = search
    ? {
      OR: [
        { message: { contains: search, mode: "insensitive" } },
        { response: { contains: search, mode: "insensitive" } },
      ],
    }
    : {};

  // Get total count for pagination
  const totalCount = await prisma.chatHistory.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch paginated results
  const chatHistory = await prisma.chatHistory.findMany({
    where,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: { timestamp: "desc" },
  });

  res.status(200).json({ chatHistory, totalPages });
}
