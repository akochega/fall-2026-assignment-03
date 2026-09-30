import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  it('should create a user and ticket', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Time Log User',
        email: 'timelog@example.com',
      });

    expect(user.status).toBe(201);

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({
        title: 'Time Log Ticket',
        description: 'Ticket for testing time logs',
      });

    expect(ticket.status).toBe(201);
  });

  it('should add time to a ticket', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Time User 2',
        email: 'time2@example.com',
      });

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({
        title: 'Time Ticket 2',
        description: 'Testing time',
      });

    const response = await request(app)
      .post(`/tickets/${ticket.body.id}/time`)
      .set('X-User-Id', String(user.body.id))
      .send({
        hours: 2,
      });

    expect(response.status).toBe(201);
  });

  it('should return the total hours for a ticket', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Time User 3',
        email: 'time3@example.com',
      });

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({
        title: 'Time Ticket 3',
        description: 'Testing total time',
      });

    const ticketId = ticket.body.id;
    const userId = user.body.id;

    await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 2 });

    await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 3 });

    const response = await request(app)
      .get(`/tickets/${ticketId}/time`);

    expect(response.status).toBe(200);
    expect(response.body.ticket_id).toBe(ticketId);
    expect(response.body.total_hours).toBe(5);
  });
});
