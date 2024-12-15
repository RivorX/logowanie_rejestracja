// app/dashboard/route.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Import komponentu Button
import { useToast } from "@/hooks/use-toast"; // Hook do wyświetlania toastów

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
        // Sprawdzanie sesji użytkownika
        const fetchUser = async () => {
            const res = await fetch('/api/auth/session');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user); // Ustaw dane użytkownika
            } else {
                // Toast o braku autoryzacji
                toast({
                    title: 'Brak autoryzacji',
                    description: 'Musisz się zalogować, aby uzyskać dostęp do tej strony.',
                    variant: 'destructive', // Styl ostrzeżenia
                });
                router.push('/auth/login'); // Przekierowanie do logowania
            }
            setLoading(false);
        };

        fetchUser();
    }, [router, toast]);

    if (loading) return <p>Ładowanie...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
            {user && (
                <p className="text-lg mb-4">
                    Zalogowany jako: <strong>{user.username}</strong>
                </p>
            )}
            <div className="flex space-x-4">
                <Button
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        toast({
                            title: 'Wylogowano pomyślnie',
                            description: 'Za chwilę nastąpi przekierowanie na stronę główną...',
                        });
                        router.push('/'); // Przekierowanie po wylogowaniu
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Wyloguj się
                </Button>
            </div>
        </div>
    );
}
