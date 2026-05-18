import db from '../db.js';

// GET /api/notifications
export async function list(req, res) {
  const userId = req.user.id;

  try {
    const today = new Date().toISOString().split('T')[0];
    const soon = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Auto-generate due-soon notifications
    const [dueSoon] = await db.query(
      `SELECT t.id, t.title FROM tasks t
       JOIN task_assignees ta ON ta.task_id = t.id
       WHERE ta.user_id = ?
         AND t.due_date BETWEEN ? AND ?
         AND t.status != 'Done'`,
      [userId, today, soon]
    );

    for (const t of dueSoon) {
      const [exists] = await db.query(
        `SELECT id FROM notifications
         WHERE user_id = ? AND task_id = ? AND type = 'task_due_soon'`,
        [userId, t.id]
      );

      if (exists.length === 0) {
        await db.query(
          `INSERT INTO notifications (user_id, type, message, task_id)
           VALUES (?, 'task_due_soon', ?, ?)`,
          [userId, `Task "${t.title}" is due soon`, t.id]
        );
      }
    }

    // Auto-generate overdue notifications
    const [overdue] = await db.query(
      `SELECT t.id, t.title FROM tasks t
       JOIN task_assignees ta ON ta.task_id = t.id
       WHERE ta.user_id = ?
         AND t.due_date < ?
         AND t.status != 'Done'`,
      [userId, today]
    );

    for (const t of overdue) {
      const [exists] = await db.query(
        `SELECT id FROM notifications
         WHERE user_id = ? AND task_id = ? AND type = 'task_overdue'`,
        [userId, t.id]
      );

      if (exists.length === 0) {
        await db.query(
          `INSERT INTO notifications (user_id, type, message, task_id)
           VALUES (?, 'task_overdue', ?, ?)`,
          [userId, `Task "${t.title}" is overdue`, t.id]
        );
      }
    }

    const [notifications] = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [userId]
    );

    return res.json({ notifications });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// PUT /api/notifications/:id/read
export async function markRead(req, res) {
  try {
    await db.query(
      `UPDATE notifications
       SET is_read = 1
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    return res.json({ message: 'Marked as read' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// PUT /api/notifications/read-all
export async function markAllRead(req, res) {
  try {
    await db.query(
      `UPDATE notifications
       SET is_read = 1
       WHERE user_id = ?`,
      [req.user.id]
    );

    return res.json({ message: 'All marked as read' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

export default {
  list,
  markRead,
  markAllRead,
};