import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        // Asynchroniczne pobranie ciasteczek
        const cookieStore = await cookies(); // Użyj await dla cookies()
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Nieautoryzowany' }, { status: 401 });
        }

        // Zweryfikuj token JWT
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Przypisanie danych użytkownika z tokenu do odpowiedzi
        return NextResponse.json({ user: { username: verified.username } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 });
    }
}

