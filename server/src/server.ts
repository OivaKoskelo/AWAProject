import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        app.listen(3001, () => console.log('Server running on http://localhost:3001'));
    })
    .catch(err => console.error('DB Error:', err));