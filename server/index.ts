// server/index.ts

import express, { Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { protect, RequestWithUser } from './middleware/authMiddleware';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Create a new pool instance with credentials from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// --- API ROUTES START HERE ---

// POST /api/register - User Registration Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [fullName, email, hashedPassword]
    );
    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/login - User Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/candidates - Fetch all candidates (Protected)
app.get('/api/candidates', protect, async (req, res) => {
  try {
    const candidatesResult = await pool.query('SELECT * FROM candidates ORDER BY id');
    res.status(200).json(candidatesResult.rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error fetching candidates.' });
  }
});

// POST /api/vote - Cast a vote (Protected)
app.post('/api/vote', protect, async (req: RequestWithUser, res: Response) => {
  const { candidateId } = req.body;
  const userId = req.user?.userId;

  if (!candidateId) {
    return res.status(400).json({ message: 'Candidate ID is required.' });
  }

  try {
    await pool.query(
      'INSERT INTO votes (user_id, candidate_id) VALUES ($1, $2)',
      [userId, candidateId]
    );
    res.status(201).json({ message: 'Vote cast successfully!' });
  } catch (error) {
    console.error('Error casting vote:', error);
    // Type-safe check for unique violation error from PostgreSQL
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return res.status(409).json({ message: 'You have already voted.' });
    }
    res.status(500).json({ message: 'Server error while casting vote.' });
  }
});

// GET /api/profile - A Protected Route
app.get('/api/profile', protect, async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  try {
    const userResult = await pool.query('SELECT id, full_name, email, role FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// GET / - Test database connection
app.get('/', async (req, res) => {
  try {
    const timeResult = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'SUCCESS! Database connection is working!',
      time: timeResult.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection failed', error);
    res.status(500).json({ message: 'ERROR: Database connection failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});