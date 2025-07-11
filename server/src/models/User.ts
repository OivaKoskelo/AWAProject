import { Schema, model } from 'mongoose';

//Schemas for the users.

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true },
});

export const User = model('User', UserSchema)