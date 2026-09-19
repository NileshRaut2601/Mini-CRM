const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors());
app.use(express.json());

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ error: 'Database error fetching customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'Customer name must not exceed 100 characters' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const insertQuery = `
      INSERT INTO customers (name, email)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [name.trim(), email.trim()]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error.message);
    res.status(500).json({ error: 'Database error creating customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'Customer name must not exceed 100 characters' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const updateQuery = `
      UPDATE customers
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [name.trim(), email.trim(), customerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customer:', error.message);
    res.status(500).json({ error: 'Database error updating customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const deleteQuery = `
      DELETE FROM customers
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(deleteQuery, [customerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer deleted successfully',
      customer: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting customer:', error.message);
    res.status(500).json({ error: 'Database error deleting customer' });
  }
});

app.listen(PORT, () => {
  console.log(`Mini CRM backend running on http://localhost:${PORT}`);
});