'use client';

import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });

            if (res.ok) {
                setMessage('Rejestracja zakończona sukcesem');
                setEmail('');
                setPassword('');
                setUsername('');
            } else {
                const errorData = await res.json();
                setMessage(`Błąd: ${errorData.error || 'Niepowodzenie rejestracji'}`);
            }
        } catch (error) {
            setMessage(`Błąd: ${error.message}`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
            <h1>Zarejestruj się</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            margin: '4px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            margin: '4px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Nazwa użytkownika:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            margin: '4px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Zarejestruj się
                </button>
            </form>
            {message && (
                <p style={{ marginTop: '1rem', color: res.ok ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
}
