import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
import Router from './routers/router.js';

// Configuration
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    "https://chettinad-handicrafts.vercel.app",
    "https://chettinad-handicrafts-uevm.vercel.app",
    "https://admin.chettinaduhandicrafts.in",
    "https://www.chettinaduhandicrafts.in",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy: This origin is not allowed access.'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api', Router);

app.get('/', (req, res) => {
    res.send('Server and Database are running fine...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});