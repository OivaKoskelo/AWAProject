import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Board } from '../models/Board';
import { authMiddleware } from '../middleware/auth';
import { registerValidator, loginValidator } from '../middleware/validate';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', registerValidator, async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    try {
        const user = await User.create({ email, passwordHash, username });

        //Creating a default board from which the new user can start customizing how they would like
        const defaultBoard = {
            userId: user._id,
            columns: [
                { id: 1, name: 'To Do', cards: [], color: "blue-grey darken-1" },
                { id: 2, name: 'In Progress', cards: [], color: "blue-grey darken-1" },
                { id: 3, name: 'Done', cards: [], color: "blue-grey darken-1" },
            ]
        };

        await Board.create(defaultBoard);

        res.json(user);             
    } catch (err) {
        res.status(400).json({ error: 'Email already in use' });
    }
});

router.post('/login', loginValidator, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).send('Invalid Email/Password');
        return
    }

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) {
        res.status(400).send('Invalid Email/Password');
        return
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '3h' });
    res.json({ token, username: user.username });
})
// Called to create the board when login in
router.get('/board', authMiddleware, async (req: any, res) => {
    let board = await Board.findOne({ userId: req.user.id });
    if (!board) {
        board = await Board.create({ userId: req.user.id, columns: [] });
    }
    res.json(board);
});
// Called whenever changes are made to the columns or cards 
// to save the changes in database
router.post('/board', authMiddleware, async (req: any, res) => {
    const { columns } = req.body;
    const board = await Board.findOneAndUpdate(
        { userId: req.user.id },
        { columns },
        { new: true }
    );
    res.json(board);
});

export default router;