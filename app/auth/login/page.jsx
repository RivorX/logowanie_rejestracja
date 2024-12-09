// app/auth/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setMessage('Login successful');
            // Po zalogowaniu przekierowujemy użytkownika na dashboard
            router.push('/dashboard');
        } else {
            const errorData = await res.json();
            setMessage(errorData.error || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <label htmlFor="email" className="block text-lg font-medium mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-lg font-medium mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}
