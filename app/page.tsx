// app/page.tsx
'use client';

import { useRouter } from 'next/navigation'; // Hook do nawigacji w Next.js
import { Button } from "@/components/ui/button"; // Komponent Button z biblioteki UI

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/auth/login'); // Przekierowanie na stronę logowania
  };

  const goToRegister = () => {
    router.push('/auth/register'); // Przekierowanie na stronę rejestracji
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Application</h1>
      <p className="text-lg mb-8">To access your account, please log in or register.</p>
      <div className="flex space-x-4">
        <Button 
          onClick={goToLogin} 
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </Button>
        <Button 
          onClick={goToRegister} 
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
