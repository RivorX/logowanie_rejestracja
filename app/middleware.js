// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value;

    if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}