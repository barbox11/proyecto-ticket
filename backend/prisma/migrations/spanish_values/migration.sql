-- Migración para cambiar valores de status y priority a español
-- Status: open -> abierto, in_progress -> en_progreso, done -> cerrado
-- Priority: low -> baja, medium -> media, high -> alta

UPDATE "Ticket" SET status = 'abierto' WHERE status = 'open';
UPDATE "Ticket" SET status = 'en_progreso' WHERE status = 'in_progress';
UPDATE "Ticket" SET status = 'cerrado' WHERE status = 'done';

UPDATE "Ticket" SET priority = 'baja' WHERE priority = 'low';
UPDATE "Ticket" SET priority = 'media' WHERE priority = 'medium';
UPDATE "Ticket" SET priority = 'alta' WHERE priority = 'high';
