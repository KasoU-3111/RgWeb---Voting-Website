// server/index.ts

import express, { Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { protect, RequestWithUser } from './middleware/authMiddleware';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// --- API ROUTES START HERE ---

// POST /api/register - Public User Registration
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

// POST /api/admin/register - Create a new admin (Protected, Admin Only)
app.post('/api/admin/register', protect, async (req: RequestWithUser, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can create new admin accounts.' });
  }
  const { fullName, email, password } = req.body;
  if (!email.endsWith('@admin.gmail.com')) {
    return res.status(400).json({ message: 'Invalid email domain for an admin account.' });
  }
  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [fullName, email, hashedPassword, 'admin']
    );
    res.status(201).json({
      message: 'Admin user registered successfully!',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error during admin registration.' });
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

// POST /api/admin/candidates - Create a new candidate (Admin Only)
app.post('/api/admin/candidates', protect, async (req: RequestWithUser, res: Response) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
    const { name, party, description } = req.body;
    if (!name || !party) {
      return res.status(400).json({ message: 'Candidate name and party are required.' });
    }
    try {
      const newCandidate = await pool.query(
        'INSERT INTO candidates (name, party, description) VALUES ($1, $2, $3) RETURNING *',
        [name, party, description || '']
      );
      res.status(201).json({
        message: 'Candidate added successfully!',
        candidate: newCandidate.rows[0],
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      res.status(500).json({ message: 'Server error while adding candidate.' });
    }
});

// PUT /api/admin/candidates/:id - Update a candidate (Admin Only)
app.put('/api/admin/candidates/:id', protect, async (req: RequestWithUser, res: Response) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
    const { id } = req.params;
    const { name, party, description } = req.body;
    if (!name || !party) {
      return res.status(400).json({ message: 'Candidate name and party are required.' });
    }
    try {
      const updatedCandidate = await pool.query(
        'UPDATE candidates SET name = $1, party = $2, description = $3 WHERE id = $4 RETURNING *',
        [name, party, description || '', id]
      );
      if (updatedCandidate.rows.length === 0) {
        return res.status(404).json({ message: 'Candidate not found.' });
      }
      res.status(200).json({
        message: 'Candidate updated successfully!',
        candidate: updatedCandidate.rows[0],
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      res.status(500).json({ message: 'Server error while updating candidate.' });
    }
});

// DELETE /api/admin/candidates/:id - Delete a candidate (Admin Only)
app.delete('/api/admin/candidates/:id', protect, async (req: RequestWithUser, res: Response) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
    const { id } = req.params;
    try {
      const deleteResult = await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ message: 'Candidate not found.' });
      }
      res.status(200).json({ message: 'Candidate deleted successfully!' });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ message: 'Server error while deleting candidate.' });
    }
});

// GET /api/admin/stats - Fetch dashboard statistics (Admin Only)
app.get('/api/admin/stats', protect, async (req: RequestWithUser, res: Response) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
    try {
      const totalVotesQuery = pool.query('SELECT COUNT(*) FROM votes');
      const totalUsersQuery = pool.query('SELECT COUNT(*) FROM users WHERE role = \'voter\'');
      const totalCandidatesQuery = pool.query('SELECT COUNT(*) FROM candidates');
      const [totalVotesResult, totalUsersResult, totalCandidatesResult] = await Promise.all([
        totalVotesQuery,
        totalUsersQuery,
        totalCandidatesQuery,
      ]);
      res.status(200).json({
        totalVotes: parseInt(totalVotesResult.rows[0].count, 10),
        registeredVoters: parseInt(totalUsersResult.rows[0].count, 10),
        activeCandidates: parseInt(totalCandidatesResult.rows[0].count, 10),
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Server error while fetching admin statistics.' });
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