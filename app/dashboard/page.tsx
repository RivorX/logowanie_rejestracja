// /app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Import komponentu Button
import { useToast } from "@/hooks/use-toast"; // Hook do wyświetlania toastów

export default function DashboardPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast({
            title: 'Wylogowano pomyślnie',
            description: 'Za chwilę nastąpi przekierowanie na stronę główną...',
        });
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <p className="mb-6 text-lg">Witamy na dashboardzie!</p>
            <Button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Wyloguj się
            </Button>
        </div>
    );
}
