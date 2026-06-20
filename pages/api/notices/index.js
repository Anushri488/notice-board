import prisma from "../../../lib/prisma";
import { validateNoticeInput } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleList(req, res);
  }
  if (req.method === "POST") {
    return handleCreate(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleList(req, res) {
  try {
    // Urgent-first ordering happens here, in the database query, not in
    // the browser. Within each priority tier, newest publishDate first.
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
    });
    return res.status(200).json(notices);
  } catch (err) {
    console.error("GET /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to load notices." });
  }
}

async function handleCreate(req, res) {
  const result = validateNoticeInput(req.body ?? {});
  if (!result.valid) {
    return res.status(400).json({ error: "Validation failed.", fields: result.errors });
  }

  try {
    const notice = await prisma.notice.create({ data: result.data });
    return res.status(201).json(notice);
  } catch (err) {
    console.error("POST /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to create notice." });
  }
}
