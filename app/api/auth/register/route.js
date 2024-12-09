// app/api/auth/register/route.js
"use server"
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password, username } = await req.json();

        // Sprawdzenie, czy użytkownik już istnieje
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 } // Zwróć odpowiedź 400 (Bad Request)
            );
        }

        // Tworzenie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego użytkownika
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });

        // Zwracanie sukcesu
        return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
