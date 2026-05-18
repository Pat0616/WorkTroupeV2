import db from '../db.js';

const PLANS = {
  Monthly: {
    duration: '1 Month',
    price: 50,
    months: 1,
  },
  Standard: {
    duration: '6 Months',
    price: 240,
    months: 6,
  },
  Premium: {
    duration: '1 Year',
    price: 900,
    months: 12,
  },
};

// POST /api/subscriptions/subscribe
export async function subscribe(req, res) {
  const { plan_name } = req.body;
  const userId = req.user.id;

  if (!PLANS[plan_name]) {
    return res.status(400).json({
      message: 'Invalid plan',
    });
  }

  const plan = PLANS[plan_name];

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + plan.months);

  const fmt = (d) => d.toISOString().split('T')[0];

  try {
    // Deactivate old subscriptions
    await db.query(
      'UPDATE subscriptions SET status = ? WHERE user_id = ?',
      ['Expired', userId]
    );

    await db.query(
      `INSERT INTO subscriptions 
       (user_id, plan_name, duration, price, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        plan_name,
        plan.duration,
        plan.price,
        fmt(startDate),
        fmt(endDate),
        'Active',
      ]
    );

    const [rows] = await db.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    return res.status(201).json({
      message: 'Subscription activated',
      subscription: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

// GET /api/subscriptions/my
export async function getMy(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [req.user.id]
    );

    return res.json({
      subscription: rows[0] || null,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

export default {
  subscribe,
  getMy,
};