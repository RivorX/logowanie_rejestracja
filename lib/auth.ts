// lib/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

// Typy dla payload i tokenu
interface TokenPayload {
    username: string;
    // Możesz dodać inne właściwości, które będą w payload
}

// Funkcja do weryfikacji tokenu
export const verifyToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};

// Funkcja do generowania tokenu
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};
