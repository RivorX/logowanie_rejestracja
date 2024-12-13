// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    // Sprawdzamy token w ciasteczkach
    const token = req.cookies.get('token')?.value;

    // Jeśli nie ma tokenu i użytkownik próbuje uzyskać dostęp do strony /dashboard, przekierowujemy na /login
    if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    // Określamy, które ścieżki będą objęte middleware
    matcher: ['/dashboard', '/profile'],
};
