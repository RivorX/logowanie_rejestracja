// lib/auth.js
import jwt from 'jsonwebtoken';

// Funkcja do weryfikacji tokenu
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Funkcja do generowania tokenu
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
