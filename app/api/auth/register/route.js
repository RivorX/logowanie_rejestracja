// app/api/auth/register/route.js
"use server"

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password, username } = await req.json();

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return new Response('User already exists', { status: 400 });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = await prisma.user.create({
        data: {
        email,
        password: hashedPassword,
        username,
        },
    });

    return new Response(JSON.stringify(user), { status: 201 });
}
