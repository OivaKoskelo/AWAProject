import { header } from "express-validator";
import { Schema, model, Types } from "mongoose";

/* Schemas for the board
Board -> Column -> Card -> (Comment possible)
-> means that the left one has the right one inside it. */

const CardSchema = new Schema({
    id: String,
    header: String,
    content: String,
    color: String,
    createdAt: String,
    updatedAt: String,
    estimatedTime: String,
});

const ColumnSchema = new Schema({
    id: String,
    name: String,
    cards: [CardSchema],
    color: String,
});

const BoardSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },
    columns: [ColumnSchema],
});

export const Board = model('Board', BoardSchema);