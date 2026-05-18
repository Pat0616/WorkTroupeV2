import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'Email already in use',
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        name,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        email,
      },
      needsSubscription: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Check subscription
    const today = new Date().toISOString().split('T')[0];

    const [subs] = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    let subscriptionStatus = 'none';

    if (subs.length > 0) {
      const sub = subs[0];

      if (sub.end_date < today) {
        await db.query(
          'UPDATE subscriptions SET status = ? WHERE id = ?',
          ['Expired', sub.id]
        );

        subscriptionStatus = 'expired';
      } else {
        subscriptionStatus = 'active';
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      subscriptionStatus,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// GET /api/auth/me
export async function me(req, res) {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const [subs] = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    let subscription = null;
    let subscriptionStatus = 'none';

    if (subs.length > 0) {
      subscription = subs[0];

      if (subscription.end_date < today) {
        await db.query(
          'UPDATE subscriptions SET status = ? WHERE id = ?',
          ['Expired', subscription.id]
        );

        subscription.status = 'Expired';
        subscriptionStatus = 'expired';
      } else {
        subscriptionStatus = 'active';
      }
    }

    return res.json({
      user: users[0],
      subscription,
      subscriptionStatus,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

export default {
  register,
  login,
  me,
};