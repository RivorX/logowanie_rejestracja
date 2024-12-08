// app/page.jsx
'use client';

import { useRouter } from 'next/navigation'; // Hook do nawigacji w Next.js
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/auth/login'); // Przekierowanie na stronę logowania
  };

  const goToRegister = () => {
    router.push('/auth/register'); // Przekierowanie na stronę rejestracji
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Our Application</h1>
      <p>To access your account, please log in or register.</p>
      <div>
        <Button 
          onClick={goToLogin} 
          style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Login
        </Button>
        <Button 
          onClick={goToRegister} 
          style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
