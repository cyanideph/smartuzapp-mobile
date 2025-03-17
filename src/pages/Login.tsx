
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={false} showBackButton={true} title="Login">
      <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <LoginForm />
      </div>
    </MainLayout>
  );
};

export default Login;
