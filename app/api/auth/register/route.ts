// app/api/auth/register/route.ts
"use server";

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export async function POST(req: Request) {
  try {
    const { email, password, username }: RegisterRequest = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Set cookie with token
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
    });

    const response = NextResponse.json({
      message: 'User registered successfully',
      userId: newUser.id,
      username: newUser.username,
    });

    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Registration error:', error);

    // More descriptive error handling based on environment
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : String(error) },
      { status: 500 }
    );
  }
}
