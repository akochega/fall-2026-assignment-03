/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

// create the time_logs table
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('time_logs')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('ticket_id', 'integer', (col) =>
      col.references('tickets.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade'),
    )
    .addColumn('hours', 'integer', (col) => col.notNull())
    .addColumn('logged_at', 'timestamptz', (col) =>
      col.defaultTo(db.fn('now')),
    )
    .execute();
}

// remove the time_logs table
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('time_logs')
    .execute();
}