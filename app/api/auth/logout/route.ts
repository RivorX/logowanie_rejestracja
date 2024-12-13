// app/api/auth/logout/route.ts
"use server";
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Wylogowano' });
    response.cookies.set('token', '', { maxAge: -1 }); // Usunięcie tokena
    return response;
}
