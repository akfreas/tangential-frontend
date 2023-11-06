import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import Toast from './toast';
import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NextAuthProvider } from '../components/nextAuthProvider';
import { LoginWrapped } from '../components/loginWrapped';

export const metadata = {
  title: 'Tangential',
  description:
    'Crystal-clear Technical Program Management. Tangential is a tool for Technical Program Managers to manage their programs, projects, and epics.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        <NextAuthProvider>
          <LoginWrapped>{children}</LoginWrapped>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
