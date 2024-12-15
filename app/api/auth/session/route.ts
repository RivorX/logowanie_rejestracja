// app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        // Pobranie ciasteczek
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Nieautoryzowany' }, { status: 401 });
        }

        // Zweryfikuj token JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const verified = jwt.verify(token, secret) as jwt.JwtPayload;

        // Przypisanie danych użytkownika z tokenu do odpowiedzi
        return NextResponse.json({ user: { username: verified.username } }, { status: 200 });
    } catch (error) {
        console.error('Błąd sesji:', error);
        return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 });
    }
}
