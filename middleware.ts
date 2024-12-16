// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';  // Importuj funkcję z 'jose'

export async function middleware(req: NextRequest) {
    // Sprawdzenie tokenu w ciasteczkach
    const token = req.cookies.get('token')?.value;

    // Jeśli brak tokenu, przekieruj na login
    if (!token) {
        return redirectToLogin(req);
    }

    // Weryfikacja tokenu
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined');
            throw new Error('JWT_SECRET is not defined');
        }

        // Weryfikacja tokenu przy użyciu 'jose'
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

        const response = NextResponse.next();
        response.headers.set('x-user', JSON.stringify({
            username: payload.username,
            email: payload.email,
        }));

        return response;
    } catch (error: any) {
        return redirectToLogin(req); // W przypadku błędu, przekierowanie na login
    }
}

// Funkcja przekierowująca na stronę logowania
function redirectToLogin(req: NextRequest) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname); // Dodanie przekierowania
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/dashboard', '/profile'], // Ścieżki podlegające middleware
};
