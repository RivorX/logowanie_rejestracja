// app/dashboard/route.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"; 

interface User {
    username: string;
    email: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        // Sprawdzanie, czy użytkownik jest zalogowany
        const fetchUser = async () => {
            const res = await fetch('/api/auth/session');
            if (res.ok) {
                const data = await res.json();
                console.log('Dane użytkownika:', data); // Sprawdź, co jest w odpowiedzi
                setUser(data.user); // Ustawienie danych użytkownika
            } else {
                router.push('/auth/login'); // Przekierowanie, jeśli brak sesji
            }
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) return <p>Ładowanie...</p>;

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Witaj na dashboardzie!</h1>
            {user && (
                <p>
                    Jesteś zalogowany jako: <strong>{user.username}</strong>
                </p>
            )}
            <button
                onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    toast({
                        title: 'Wylogowano pomyślnie',
                        description: 'Za chwilę nastąpi przekierowanie na stronę główną...',
                    });
                    router.push('/'); // Wylogowanie i przekierowanie
                }}
                style={{
                    marginTop: '1rem',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Wyloguj się
            </button>
        </div>
    );
}
