import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Test User',
        email: 'test@example.com',
      });

    expect(response.status).toBe(201);
  });

  // awaiting for the user first because we need the id of an existing user
  // to create a ticket
  it('should create a ticket', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Ticket User',
        email: 'ticket@example.com',
      });

    const response = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
      });

    expect(response.status).toBe(201);
  });

  it('should reject a request without X-User-Id', async () => {
    const response = await request(app)
      .post('/tickets')
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
      });

    expect(response.status).toBe(401);
  });

  it('should return 404 for a user that does not exist', async () => {
    const response = await request(app).get('/users/999999');

    expect(response.status).toBe(404);
  });

  it('should return 404 for a ticket that does not exist', async () => {
    const response = await request(app).get('/tickets/999999');

    expect(response.status).toBe(404);
  });

  it('should support pagination for tickets', async () => {
    const response = await request(app).get(
      '/tickets?limit=2&offset=0',
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(2);
  });
});