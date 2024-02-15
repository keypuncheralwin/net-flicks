'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToastActionElement } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { RotateCw } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { addNewUser, checkUserExists } from '../utils/action';
import { isNotEmpty, isValidEmail } from '../utils/helpers';

type AuthFormProps = {
  authType: 'login' | 'sign-up';
};

export default function AuthForm({ authType }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const showToast = (
    title: string,
    description: string,
    variant: 'destructive' | 'default' = 'destructive',
    action?: ToastActionElement | undefined
  ) => {
    toast({ title, description, variant, action });
  };

  const handleLogin = async (): Promise<boolean> => {
    const doesEmailExist = await checkUserExists(email);
    if (!doesEmailExist.success) {
      showToast(
        'Error Logging in',
        doesEmailExist.message,
        'destructive',
        <Link className="text-white hover:underline" href="/sign-up">
          Sign up now!
        </Link>
      );
      return false;
    }
    return true;
  };

  const handleSignUp = async (): Promise<boolean> => {
    if (!isNotEmpty(name)) {
      showToast('Invalid Name', 'Please enter a valid name');
      return false;
    }
    const addUserResponse = await addNewUser(name, email);
    if (!addUserResponse.success) {
      showToast('Error Signing Up', addUserResponse.message);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!isValidEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email');
        return;
      }

      const isUserValid =
        authType === 'sign-up' ? await handleSignUp() : await handleLogin();
      if (!isUserValid) return;

      const result = await signIn('email', { email, redirect: false });
      if (result?.error) {
        showToast('Error', result.error);
      } else {
        showToast(
          'Check Your Email',
          'We have sent a magic link to your email. Click the link to complete your login.',
          'default'
        );
      }
    } catch (error) {
      showToast('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-semibold text-white">
        {authType === 'sign-up' ? 'Sign Up' : 'Log In'}
      </h1>
      <div className="space-y-4 mt-5">
        {authType === 'sign-up' && (
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400"
            disabled={isLoading}
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 inline-block"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="destructive"
          className="w-full bg-[#e50914]"
        >
          {isLoading ? (
            <RotateCw className="animate-spin" />
          ) : authType === 'sign-up' ? (
            'Sign Up'
          ) : (
            'Log in'
          )}
        </Button>
      </div>
    </form>
  );
}
