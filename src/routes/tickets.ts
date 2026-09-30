import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
} from '../dal/tickets.js';
import {
  insertTimeLog,
  getTotalHoursForTicket,
} from '../dal/timeLogs.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// GET /tickets
router.get('/', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;

  const tickets = await getAllTickets({ limit, offset, status });

  res.json(tickets);
});

// GET /tickets/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const ticket = await getTicketById(id);

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.json(ticket);
});

// POST /tickets
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (typeof title !== 'string' || typeof description !== 'string') {
    res.status(400).json({
      error: 'Title and description are required',
    });
    return;
  }

  const ticket = await createTicket({ title, description, creator_id: res.locals.userId });

  res.status(201).json(ticket);
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  if (typeof status !== 'string') {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const ticket = await updateTicketStatus(id, status);

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.json(ticket);
});

// POST /tickets/:id/time
router.post('/:id/time', authMiddleware, async (req, res) => {
  const ticketId = Number(req.params.id);
  const { hours } = req.body;

  if (Number.isNaN(ticketId)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  if (typeof hours !== 'number') {
    res.status(400).json({ error: 'Hours is required' });
    return;
  }

  await insertTimeLog(ticketId, res.locals.userId, hours);

  res.status(201).json({ message: 'Time logged' });
});

// GET /tickets/:id/time
router.get('/:id/time', async (req, res) => {
  const ticketId = Number(req.params.id);

  if (Number.isNaN(ticketId)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const totalHours = await getTotalHoursForTicket(ticketId);

  res.json({
    ticket_id: ticketId,
    total_hours: totalHours,
  });
});

export default router;
