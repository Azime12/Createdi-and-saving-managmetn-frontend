import { Metadata } from 'next';
import { Suspense } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center  bg-white">
       
        
        <Suspense fallback={<div className="text-center">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
    </main>
  );
}