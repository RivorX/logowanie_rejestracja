import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const headersList = headers();
    const userHeader = (await headersList).get('x-user');

    if (!userHeader) {
        redirect('/auth/login'); // Przekierowanie, jeśli brak użytkownika
    }

    const user = JSON.parse(userHeader);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="p-4 bg-blue-600 text-white">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>Zalogowany jako: {user.username}</p>
            </header>
            <main>{children}</main>
        </div>
    );
}
