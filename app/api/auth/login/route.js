// app/api/auth/login/route.js
"use server"

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password } = await req.json();

    // Sprawdzenie, czy użytkownik istnieje
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return new Response('User not found', { status: 400 });
    }

    // Sprawdzenie poprawności hasła
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return new Response('Invalid credentials', { status: 400 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
}
