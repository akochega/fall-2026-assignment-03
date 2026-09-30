import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const userIdHeader = req.header('X-User-Id');

  // reject if no header
  if (userIdHeader === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = Number(userIdHeader);

  // reject if not a valid number
  if (Number.isNaN(userId)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.locals.userId = userId;
  next();
}

export default authMiddleware;