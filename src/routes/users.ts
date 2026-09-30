import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// get all users
router.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

// get a user by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const user = await getUserById(id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
});

// create a new user
router.post('/', authMiddleware, async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

export default router;
