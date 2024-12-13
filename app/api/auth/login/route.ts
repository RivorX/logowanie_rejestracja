// app/api/auth/login/route.ts
"use server";

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

interface LoginRequest {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        const { email, password }: LoginRequest = await req.json();

        // Sprawdzenie, czy użytkownik istnieje
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // Sprawdzenie poprawności hasła
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        // Tworzenie tokena JWT (dodajemy dane takie jak userId i username)
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' } // Token wygasa po godzinie
        );

        // Tworzenie ciasteczka z tokenem
        const cookie = serialize('token', token, {
            httpOnly: true, // Token jest dostępny tylko przez HTTP, nie w JavaScript
            secure: process.env.NODE_ENV === 'production', // Tylko w środowisku produkcyjnym
            sameSite: 'strict', // Ochrona przed CSRF
            path: '/', // Ciasteczko dostępne w całej aplikacji
            maxAge: 3600, // Token ważny przez godzinę
        });

        // Tworzenie odpowiedzi z informacją o sukcesie
        const response = NextResponse.json({
            message: 'Login successful',
            userId: user.id,
            username: user.username, // Możesz dodać dane użytkownika do odpowiedzi
        });

        // Dodanie ciasteczka do odpowiedzi
        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('Błąd logowania:', error); // Dodanie logowania błędów dla lepszego debugowania
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}