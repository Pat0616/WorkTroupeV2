import db from '../db.js';

const PLAN_LIMITS = {
  Monthly: { maxTasks: 10 },
  Standard: { maxTasks: 50 },
  Premium: { maxTasks: Infinity },
};

async function getRole(groupId, userId) {
  const [rows] = await db.query(
    'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
    [groupId, userId]
  );

  return rows.length > 0 ? rows[0].role : null;
}

// GET /api/groups/:groupId/tasks
export async function list(req, res) {
  const { groupId } = req.params;

  try {
    const role = await getRole(groupId, req.user.id);
    if (!role) return res.status(403).json({ message: 'Not a member' });

    const [tasks] = await db.query(
      `SELECT t.*, u.name AS creator_name
       FROM tasks t
       JOIN users u ON u.id = t.created_by
       WHERE t.group_id = ?
       ORDER BY t.created_at DESC`,
      [groupId]
    );

    for (const task of tasks) {
      const [assignees] = await db.query(
        `SELECT u.id, u.name
         FROM task_assignees ta
         JOIN users u ON u.id = ta.user_id
         WHERE ta.task_id = ?`,
        [task.id]
      );

      task.assignees = assignees;
    }

    return res.json({ tasks });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// POST /api/groups/:groupId/tasks
export async function create(req, res) {
  const { groupId } = req.params;
  const { title, description, due_date, priority, assignee_ids } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const role = await getRole(groupId, userId);
    if (role !== 'leader') {
      return res.status(403).json({ message: 'Only leaders can create tasks' });
    }

    // Check plan limits
    const today = new Date().toISOString().split('T')[0];

    const [subs] = await db.query(
      `SELECT plan_name
       FROM subscriptions
       WHERE user_id = ?
         AND status = ?
         AND end_date >= ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, 'Active', today]
    );

    if (subs.length > 0) {
      const limit =
        PLAN_LIMITS[subs[0].plan_name]?.maxTasks ?? 10;

      const [taskCount] = await db.query(
        'SELECT COUNT(*) AS cnt FROM tasks WHERE group_id = ?',
        [groupId]
      );

      if (
        limit !== Infinity &&
        taskCount[0].cnt >= limit
      ) {
        return res.status(403).json({
          message: `Task limit (${limit}) reached for your plan. Upgrade to add more.`,
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO tasks
       (group_id, created_by, title, description, due_date, priority)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        groupId,
        userId,
        title,
        description || null,
        due_date || null,
        priority || 'Medium',
      ]
    );

    const taskId = result.insertId;

    if (Array.isArray(assignee_ids) && assignee_ids.length > 0) {
      for (const uid of assignee_ids) {
        await db.query(
          'INSERT IGNORE INTO task_assignees (task_id, user_id) VALUES (?, ?)',
          [taskId, uid]
        );

        await db.query(
          `INSERT INTO notifications
           (user_id, type, message, task_id)
           VALUES (?, ?, ?, ?)`,
          [
            uid,
            'task_assigned',
            `You were assigned to task: ${title}`,
            taskId,
          ]
        );
      }
    }

    await db.query(
      `INSERT INTO activity_logs
       (group_id, user_id, action)
       VALUES (?, ?, ?)`,
      [groupId, userId, `Created task: ${title}`]
    );

    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    return res.status(201).json({ task: rows[0] });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// PUT /api/groups/:groupId/tasks/:taskId
export async function update(req, res) {
  const { groupId, taskId } = req.params;
  const userId = req.user.id;
  const {
    title,
    description,
    due_date,
    priority,
    status,
    assignee_ids,
  } = req.body;

  try {
    const role = await getRole(groupId, userId);
    if (!role) {
      return res.status(403).json({ message: 'Not a member' });
    }

    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND group_id = ?',
      [taskId, groupId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (role === 'member') {
      if (status) {
        await db.query(
          'UPDATE tasks SET status = ? WHERE id = ?',
          [status, taskId]
        );

        await db.query(
          `INSERT INTO activity_logs
           (group_id, user_id, action)
           VALUES (?, ?, ?)`,
          [
            groupId,
            userId,
            `Updated status of "${tasks[0].title}" to ${status}`,
          ]
        );
      }
    } else {
      await db.query(
        `UPDATE tasks SET
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         due_date = COALESCE(?, due_date),
         priority = COALESCE(?, priority),
         status = COALESCE(?, status)
         WHERE id = ?`,
        [title, description, due_date, priority, status, taskId]
      );

      if (Array.isArray(assignee_ids)) {
        await db.query(
          'DELETE FROM task_assignees WHERE task_id = ?',
          [taskId]
        );

        for (const uid of assignee_ids) {
          await db.query(
            'INSERT IGNORE INTO task_assignees (task_id, user_id) VALUES (?, ?)',
            [taskId, uid]
          );

          await db.query(
            `INSERT INTO notifications
             (user_id, type, message, task_id)
             VALUES (?, ?, ?, ?)`,
            [
              uid,
              'task_assigned',
              `You were assigned to task: ${
                title || tasks[0].title
              }`,
              taskId,
            ]
          );
        }
      }

      await db.query(
        `INSERT INTO activity_logs
         (group_id, user_id, action)
         VALUES (?, ?, ?)`,
        [
          groupId,
          userId,
          `Updated task: ${
            title || tasks[0].title
          }`,
        ]
      );
    }

    const [updated] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    return res.json({ task: updated[0] });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// DELETE /api/groups/:groupId/tasks/:taskId
export async function remove(req, res) {
  const { groupId, taskId } = req.params;
  const userId = req.user.id;

  try {
    const role = await getRole(groupId, userId);
    if (role !== 'leader') {
      return res.status(403).json({
        message: 'Only leaders can delete tasks',
      });
    }

    const [tasks] = await db.query(
      'SELECT title FROM tasks WHERE id = ? AND group_id = ?',
      [taskId, groupId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [
      taskId,
    ]);

    await db.query(
      `INSERT INTO activity_logs
       (group_id, user_id, action)
       VALUES (?, ?, ?)`,
      [
        groupId,
        userId,
        `Deleted task: ${tasks[0].title}`,
      ]
    );

    return res.json({ message: 'Task deleted' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// GET comments
export async function getComments(req, res) {
  const { groupId, taskId } = req.params;

  try {
    const role = await getRole(groupId, req.user.id);
    if (!role) return res.status(403).json({ message: 'Not a member' });

    const [comments] = await db.query(
      `SELECT c.*, u.name AS user_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC`,
      [taskId]
    );

    return res.json({ comments });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// POST comment
export async function addComment(req, res) {
  const { groupId, taskId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({
      message: 'Comment cannot be empty',
    });
  }

  try {
    const role = await getRole(groupId, userId);
    if (!role) {
      return res.status(403).json({ message: 'Not a member' });
    }

    const [result] = await db.query(
      `INSERT INTO comments
       (task_id, user_id, content)
       VALUES (?, ?, ?)`,
      [taskId, userId, content]
    );

    await db.query(
      `INSERT INTO activity_logs
       (group_id, user_id, action)
       VALUES (?, ?, ?)`,
      [
        groupId,
        userId,
        'Commented on a task',
      ]
    );

    const [rows] = await db.query(
      `SELECT c.*, u.name AS user_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      comment: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// GET dashboard
export async function dashboard(req, res) {
  const { groupId } = req.params;

  try {
    const role = await getRole(groupId, req.user.id);
    if (role !== 'leader') {
      return res.status(403).json({ message: 'Leaders only' });
    }

    const today = new Date().toISOString().split('T')[0];

    const [total] = await db.query(
      'SELECT COUNT(*) AS cnt FROM tasks WHERE group_id = ?',
      [groupId]
    );

    const [done] = await db.query(
      "SELECT COUNT(*) AS cnt FROM tasks WHERE group_id = ? AND status = 'Done'",
      [groupId]
    );

    const [overdue] = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM tasks
       WHERE group_id = ?
         AND due_date < ?
         AND status != 'Done'`,
      [groupId, today]
    );

    const [inprog] = await db.query(
      "SELECT COUNT(*) AS cnt FROM tasks WHERE group_id = ? AND status = 'In Progress'",
      [groupId]
    );

    const [logs] = await db.query(
      `SELECT al.*, u.name AS user_name
       FROM activity_logs al
       JOIN users u ON u.id = al.user_id
       WHERE al.group_id = ?
       ORDER BY al.timestamp DESC
       LIMIT 20`,
      [groupId]
    );

    return res.json({
      total: total[0].cnt,
      done: done[0].cnt,
      overdue: overdue[0].cnt,
      inProgress: inprog[0].cnt,
      logs,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

export default {
  list,
  create,
  update,
  remove,
  getComments,
  addComment,
  dashboard,
};