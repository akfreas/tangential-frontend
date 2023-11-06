'use client';
import { useSession, signIn } from 'next-auth/react';
import { Card, Button } from '@tremor/react';
import { Oval } from 'react-loader-spinner';

export const LoginWrapped = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-xl font-semibold">Please Log In</h1>
          <Button onClick={() => signIn('atlassian')}>Sign in</Button>
        </div>
      </Card>
    );
  }

  // If the session exists, render the content passed as children
  return <div>{children}</div>;
};
