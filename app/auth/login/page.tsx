// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; 
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// Schemat walidacji Zod
const loginSchema = z.object({
    email: z.string().email('Niepoprawny email'),
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const { handleSubmit, control } = form;
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();
    const { toast } = useToast();

    // Mutacja logowania
    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Błąd logowania');
            }

            return res.json(); // Oczekujemy, że API zwróci obiekt zawierający token
        },
        onSuccess: (data) => {
            // Zapisz token w localStorage (lub w cookies, jeśli preferujesz)
            localStorage.setItem('token', data.token);

            // Wyświetlenie powiadomienia o pomyślnym logowaniu
            toast({ title: 'Zalogowano pomyślnie', description: "Przekierowano do strony głównej",});

            // Przekierowanie na stronę dashboard po udanym logowaniu
            router.push('/dashboard');
        },
        onError: (error: any) => {
            setErrorMessage(error.message || 'Błąd logowania');
            toast({ title: 'Błąd logowania', description: error.message, variant: 'error' });
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Zaloguj się</h1>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value || ""}  // Zapewnia, że wartość jest zawsze kontrolowana
                            placeholder="Wprowadź email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState?.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Hasło</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            value={field.value || ""}  // Zapewnia, że wartość jest kontrolowana
                            placeholder="Wprowadź hasło"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState?.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.status === 'pending'}
                    >
                        {loginMutation.status === 'pending' ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>
                </form>
            </Form>

            {errorMessage && (
                <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
            )}
        </div>
    );
}
