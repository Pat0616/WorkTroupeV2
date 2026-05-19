import db from '../db.js';

const PLAN_LIMITS = {
  Monthly: {
    maxGroups: 1,
    maxTasks: 10,
  },
  Standard: {
    maxGroups: 3,
    maxTasks: 50,
  },
  Premium: {
    maxGroups: Infinity,
    maxTasks: Infinity,
  },
};

async function getUserPlan(userId) {
  const today = new Date().toISOString().split('T')[0];

  const [subs] = await db.query(
    `SELECT * FROM subscriptions 
     WHERE user_id = ? 
     AND status = ? 
     AND end_date >= ?
     ORDER BY created_at DESC 
     LIMIT 1`,
    [userId, 'Active', today]
  );

  return subs.length > 0 ? subs[0].plan_name : null;
}

function randomCode(len = 6) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + len)
    .toUpperCase();
}

// GET /api/groups
export async function list(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT g.*, gm.role, u.name AS leader_name
       FROM \`groups\` g
       JOIN group_members gm 
         ON gm.group_id = g.id 
         AND gm.user_id = ?
       JOIN users u 
         ON u.id = g.created_by`,
      [req.user.id]
    );

    return res.json({
      groups: rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// POST /api/groups
export async function create(req, res) {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({
      message: 'Group name required',
    });
  }

  try {
    const plan = await getUserPlan(userId);

    if (!plan) {
      return res.status(403).json({
        message: 'No active subscription',
      });
    }

    const limits = PLAN_LIMITS[plan];

    const [existing] = await db.query(
      'SELECT COUNT(*) AS cnt FROM `groups` WHERE created_by = ?',
      [userId]
    );

    if (
      limits.maxGroups !== Infinity &&
      existing[0].cnt >= limits.maxGroups
    ) {
      return res.status(403).json({
        message: `Your ${plan} plan allows max ${limits.maxGroups} group(s). Upgrade to create more.`,
      });
    }

    const code = randomCode();

    const [result] = await db.query(
      'INSERT INTO `groups` (name, created_by, invite_code) VALUES (?, ?, ?)',
      [name, userId, code]
    );

    const groupId = result.insertId;

    await db.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [groupId, userId, 'leader']
    );

    const [rows] = await db.query(
      'SELECT * FROM `groups` WHERE id = ?',
      [groupId]
    );

    return res.status(201).json({
      group: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// GET /api/groups/:id
export async function getOne(req, res) {
  try {
    const [groups] = await db.query(
      'SELECT * FROM `groups` WHERE id = ?',
      [req.params.id]
    );

    if (groups.length === 0) {
      return res.status(404).json({
        message: 'Group not found',
      });
    }

    const [isMember] = await db.query(
      'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (isMember.length === 0) {
      return res.status(403).json({
        message: 'Not a member',
      });
    }

    const [members] = await db.query(
      `SELECT gm.role, u.id, u.name, u.email
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = ?`,
      [req.params.id]
    );

    return res.json({
      group: groups[0],
      members,
      myRole: isMember[0].role,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// POST /api/groups/join
export async function join(req, res) {
  const { invite_code } = req.body;
  const userId = req.user.id;

  if (!invite_code) {
    return res.status(400).json({
      message: 'Invite code required',
    });
  }

  try {
    const [groups] = await db.query(
      'SELECT * FROM `groups` WHERE invite_code = ?',
      [invite_code.toUpperCase()]
    );

    if (groups.length === 0) {
      return res.status(404).json({
        message: 'Invalid invite code',
      });
    }

    const group = groups[0];

    const [already] = await db.query(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [group.id, userId]
    );

    if (already.length > 0) {
      return res.status(409).json({
        message: 'Already a member',
      });
    }

    await db.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [group.id, userId, 'member']
    );

    await db.query(
      'INSERT INTO activity_logs (group_id, user_id, action) VALUES (?, ?, ?)',
      [group.id, userId, 'Joined the group']
    );

    return res.json({
      message: 'Joined group',
      group,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// DELETE /api/groups/:id
export async function remove(req, res) {
  try {
    const [member] = await db.query(
      'SELECT role FROM group_members WHERE group_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (
      member.length === 0 ||
      member[0].role !== 'leader'
    ) {
      return res.status(403).json({
        message: 'Only leader can delete group',
      });
    }

    await db.query(
      'DELETE FROM `groups` WHERE id = ?',
      [req.params.id]
    );

    return res.json({
      message: 'Group deleted',
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
  getOne,
  join,
  remove,
};