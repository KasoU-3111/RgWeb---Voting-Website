import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'SUCCESS! Database connection is working!',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'ERROR: Database connection failed.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});