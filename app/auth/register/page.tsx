// app/auth/register/route.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Importujemy hook do nawigacji
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const registerSchema = z.object({
  email: z.string().email('Niepoprawny email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  username: z.string().min(2, 'Nazwa użytkownika jest za krótka'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter(); // Hook do nawigacji
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', username: '' },
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Niepowodzenie rejestracji');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Zapisz token w localStorage lub cookies
      localStorage.setItem('authToken', data.token);

      toast({
        title: 'Rejestracja zakończona sukcesem',
        description: 'Przekierowanie na stronę główną...',
        variant: 'default',
      });

      // Przekierowanie na stronę dashboard
      router.push('/dashboard');
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Błąd rejestracji',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Zarejestruj się</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Wprowadź email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Wprowadź hasło" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa użytkownika</FormLabel>
                <FormControl>
                  <Input placeholder="Wprowadź nazwę użytkownika" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={mutation.status === 'pending'}>
            {mutation.status === 'pending' ? 'Rejestracja...' : 'Zarejestruj się'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
