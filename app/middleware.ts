// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // Jeśli token jest wymagany na określonych ścieżkach i go brak
    if (!token) {
        // Określone ścieżki wymagające autoryzacji
        const protectedPaths = ['/dashboard', '/profile'];

        // Jeśli użytkownik próbuje wejść na chronioną stronę bez tokenu
        if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Token istnieje, więc pozwalamy na dostęp
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/profile'],
};
