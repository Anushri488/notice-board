import prisma from "../../../lib/prisma";
import { validateNoticeInput } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId) || noticeId <= 0) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    return handleGet(req, res, noticeId);
  }
  if (req.method === "PUT") {
    return handleUpdate(req, res, noticeId);
  }
  if (req.method === "DELETE") {
    return handleDelete(req, res, noticeId);
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleGet(req, res, noticeId) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
    if (!notice) {
      return res.status(404).json({ error: "Notice not found." });
    }
    return res.status(200).json(notice);
  } catch (err) {
    console.error(`GET /api/notices/${noticeId} failed:`, err);
    return res.status(500).json({ error: "Failed to load notice." });
  }
}

async function handleUpdate(req, res, noticeId) {
  const result = validateNoticeInput(req.body ?? {});
  if (!result.valid) {
    return res.status(400).json({ error: "Validation failed.", fields: result.errors });
  }

  try {
    const notice = await prisma.notice.update({
      where: { id: noticeId },
      data: result.data,
    });
    return res.status(200).json(notice);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`PUT /api/notices/${noticeId} failed:`, err);
    return res.status(500).json({ error: "Failed to update notice." });
  }
}

async function handleDelete(req, res, noticeId) {
  try {
    await prisma.notice.delete({ where: { id: noticeId } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`DELETE /api/notices/${noticeId} failed:`, err);
    return res.status(500).json({ error: "Failed to delete notice." });
  }
}
